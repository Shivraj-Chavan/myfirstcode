import pool from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ================= REGISTER =================
export const registerReferral = async (req, res) => {
  try {
    const {
      instituteName, contactPerson, mobile, email, password, confirmPassword,
      address, city, state, pincode, gstNumber, panNumber, website,
    } = req.body;

    if (!instituteName || !contactPerson || !mobile || !email || !password) {
      return res.status(400).json({ success: false, message: "Please fill all required fields" });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: "Passwords do not match" });
    }

    const [existing] = await pool.query("SELECT id FROM referral_partners WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);

    // NOTE: DB columns are `name` and `organization_name`, not
    // `contact_person`/`institute_name` — request body keys stay
    // camelCase (instituteName/contactPerson) to match the frontend
    // form, only the SQL column names below are mapped to the real schema.
    await pool.query(
      `INSERT INTO referral_partners
        (organization_name, name, mobile, email, password, address, city, state, pincode, gst_number, pan_number, website, status)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?, 'PENDING')`,
      [instituteName, contactPerson, mobile, email, hashed, address || "", city || "", state || "", pincode || "", gstNumber || "", panNumber || "", website || ""]
    );

    return res.status(201).json({
      success: true,
      message: "Registration submitted. Your account is pending admin approval.",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ================= LOGIN =================
export const loginReferral = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [rows] = await pool.query("SELECT * FROM referral_partners WHERE email = ?", [email]);
    if (rows.length === 0) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    const partner = rows[0];
    const match = await bcrypt.compare(password, partner.password);
    if (!match) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    if (partner.status === "PENDING") {
      return res.status(403).json({ success: false, message: "Your account is pending admin approval" });
    }
    if (partner.status === "REJECTED") {
      return res.status(403).json({ success: false, message: "Your registration was rejected. Contact admin." });
    }

    const token = jwt.sign(
      { id: partner.id, email: partner.email, role: "referral" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      partner: {
        id: partner.id,
        instituteName: partner.organization_name,
        contactPerson: partner.name,
        email: partner.email,
        mobile: partner.mobile,
        status: partner.status,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ================= ADMIN: LIST =================
export const getReferralPartners = async (req, res) => {
  try {
    const { status } = req.query;
    let sql = `
      SELECT
        id,
        organization_name AS institute_name,
        name AS contact_person,
        mobile, email, city, state, status, created_at
      FROM referral_partners
    `;
    const params = [];
    if (status && status !== "All") {
      sql += " WHERE status = ?";
      params.push(status);
    }
    sql += " ORDER BY created_at DESC";

    const [rows] = await pool.query(sql, params);
    return res.status(200).json({ success: true, data: rows });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ================= ADMIN: SINGLE =================
export const getReferralPartnerById = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT
        id,
        organization_name AS institute_name,
        name AS contact_person,
        mobile, email, address, city, state, pincode,
        gst_number, pan_number, website, status, created_at
      FROM referral_partners WHERE id = ?`,
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Referral partner not found" });
    }
    return res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ================= ADMIN: APPROVE / REJECT =================
export const approveReferralPartner = async (req, res) => {
  try {
    await pool.query("UPDATE referral_partners SET status = 'APPROVED' WHERE id = ?", [req.params.id]);
    return res.status(200).json({ success: true, message: "Referral partner approved" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const rejectReferralPartner = async (req, res) => {
  try {
    await pool.query("UPDATE referral_partners SET status = 'REJECTED' WHERE id = ?", [req.params.id]);
    return res.status(200).json({ success: true, message: "Referral partner rejected" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};