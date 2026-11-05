// ================= USER CONTROLLER =================

import pool from "../config/db.js";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ================= REGISTER =================

export const register = async (
  req,
  res
) => {

  try {

    const {
      name,
      email,
      role,
      standard,
    } = req.body;

    const otp = Math.floor(
      100000 +
      Math.random() * 900000
    );

    // ================= CHECK EXISTING USER =================

    const [existingUser] =
      await pool.query(
        `
        SELECT *
        FROM users
        WHERE email = ?
        `,
        [email]
      );

    if (
      existingUser.length > 0
    ) {

      return res.status(400).json({
        success: false,
        message:
          "Email already exists",
      });

    }

    // ================= DEFAULT STATUS =================

    let status =
      "APPROVED";

    // Teacher needs approval

    if (
      role.toLowerCase() ===
      "teacher"
    ) {

      status = "PENDING";

    }

    // ================= INSERT USER =================

    await pool.query(
      `
      INSERT INTO users
      (
        name,
        email,
        role,
        otp,
        verified,
        status,
        standard
      )

      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        name,
        email,
        role.toLowerCase(),
        otp,
        false,
        status,
        standard || null,
      ]
    );

    console.log(
      "REGISTER OTP:",
      otp
    );

    return res.status(200).json({
      success: true,
      message:
        "OTP Sent Successfully",
      otp,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message:
        error.message,
    });

  }
};

// ================= VERIFY OTP =================

export const verifyOtp =
  async (req, res) => {

    try {

      const {
        email,
        otp,
      } = req.body;

      const [result] =
        await pool.query(
          `
          SELECT *
          FROM users
          WHERE email = ?
          AND otp = ?
          `,
          [email, otp]
        );

      if (
        result.length === 0
      ) {

        return res.status(400).json({
          success: false,
          message:
            "Invalid OTP",
        });

      }

      const user =
        result[0];

      // ================= VERIFY USER =================

      await pool.query(
        `
        UPDATE users
        SET verified = true,
            otp = NULL
        WHERE email = ?
        `,
        [email]
      );

      // ================= GENERATE JWT TOKEN =================

      const token = jwt.sign(
        {
          id: user.id,
          role: user.role,
          email: user.email,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );

      return res.status(200).json({
        success: true,
        message:
          "OTP Verified Successfully",
        token,
        user,
      });

    } catch (error) {

      return res.status(500).json({
        success: false,
        message:
          error.message,
      });

    }
  };

// ================= LOGIN =================

export const login = async (
  req,
  res
) => {

  try {

    const { email } =
      req.body;

    const [result] =
      await pool.query(
        `
        SELECT *
        FROM users
        WHERE email = ?
        AND verified = true
        `,
        [email]
      );

    if (
      result.length === 0
    ) {

      return res.status(400).json({
        success: false,
        message:
          "User is not verified",
      });

    }

    const user =
      result[0];

    // ================= TEACHER APPROVAL =================

    if (
      user.role === "teacher" &&
      user.status === "PENDING"
    ) {

      return res.status(403).json({
        success: false,
        message:
          "Waiting for admin approval",
      });

    }

    // ================= GENERATE OTP =================

    const otp = Math.floor(
      100000 +
      Math.random() * 900000
    );

    // ================= SAVE OTP =================

    await pool.query(
      `
      UPDATE users
      SET otp = ?
      WHERE email = ?
      `,
      [otp, email]
    );

    console.log(
      "LOGIN OTP:",
      otp
    );

    return res.status(200).json({

      success: true,

      message:
        "OTP Sent Successfully",

      otp,

    });

  } catch (error) {

    return res.status(500).json({

      success: false,

      message:
        error.message,

    });

  }
};

/* ================= END OTP LOGIN ================= */

// ================= GOOGLE LOGIN =================

export const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: "Google credential is required",
      });
    }

    // Verify the ID token with Google (signature, audience, expiry)
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload?.email || !payload.email_verified) {
      return res.status(401).json({
        success: false,
        message: "Google email is not verified",
      });
    }

    const [result] = await pool.query(
      `SELECT * FROM users WHERE email = ?`,
      [payload.email]
    );

    // Must have registered first
    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No account found for this Google email. Please register first.",
      });
    }

    const user = result[0];

    if (user.role === "teacher" && user.status === "PENDING") {
      return res.status(403).json({
        success: false,
        message: "Waiting for admin approval",
      });
    }

    // Google has confirmed ownership of this email, so mark it verified
    if (!user.verified) {
      await pool.query(`UPDATE users SET verified = true WHERE id = ?`, [user.id]);
      user.verified = 1;
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        standard: user.standard,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    delete user.otp;

    return res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      user,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Google sign-in failed",
      error: error.message,
    });
  }
};

// ================= GET TEACHERS =================

export const getTeachers =
  async (req, res) => {

    try {

      const [result] =
        await pool.query(
          `
          SELECT *
          FROM users
          WHERE role = 'teacher'
          ORDER BY id DESC
          `
        );

      return res.status(200).json({
        success: true,
        data: result,
      });

    } catch (error) {

      return res.status(500).json({
        success: false,
        message:
          error.message,
      });

    }
  };

// ================= APPROVE TEACHER =================

export const approveTeacher =
  async (req, res) => {

    try {

      const { id } =
        req.params;

      await pool.query(
        `
        UPDATE users
        SET status = 'APPROVED'
        WHERE id = ?
        `,
        [id]
      );

      return res.status(200).json({
        success: true,
        message:
          "Teacher Approved",
      });

    } catch (error) {

      return res.status(500).json({
        success: false,
        message:
          error.message,
      });

    }
  };

// ================= DELETE TEACHER =================

export const deleteTeacher =
  async (req, res) => {

    try {

      const { id } =
        req.params;

      await pool.query(
        `
        DELETE FROM users
        WHERE id = ?
        `,
        [id]
      );

      return res.status(200).json({
        success: true,
        message:
          "Teacher Deleted",
      });

    } catch (error) {

      return res.status(500).json({
        success: false,
        message:
          error.message,
      });

    }
  };


  // ================= CREATE TEACHER =================

export const createTeacher =
async (req, res) => {

  try {

    const {
      name,
      email,
      standard,
    } = req.body;

    // ================= VALIDATION =================

    if (
      !name ||
      !email
    ) {

      return res.status(400).json({
        success: false,
        message:
          "Name and Email are required",
      });

    }

    // ================= CHECK EXISTING =================

    const [existing] =
      await pool.query(
        `
        SELECT *
        FROM users
        WHERE email = ?
        `,
        [email]
      );

    if (
      existing.length > 0
    ) {

      return res.status(400).json({
        success: false,
        message:
          "Teacher already exists",
      });

    }

    // ================= GENERATE OTP =================

    const otp = Math.floor(
      100000 +
      Math.random() * 900000
    );

    // ================= INSERT TEACHER =================

    const [result] =
      await pool.query(
        `
        INSERT INTO users
        (
          name,
          email,
          role,
          otp,
          verified,
          status,
          standard
        )

        VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        [
          name,
          email,
          "teacher",
          otp,
          true,
          "PENDING",
          standard || null,
        ]
      );

    return res.status(201).json({

      success: true,

      message:
        "Teacher Created Successfully",

      data: {
        id: result.insertId,
        name,
        email,
        role: "teacher",
        status: "APPROVED",
        standard,
      },

    });

  } catch (error) {

    return res.status(500).json({

      success: false,

      message:
        error.message,

    });

  }
};