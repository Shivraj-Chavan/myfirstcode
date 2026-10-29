import pool from "../config/db.js";

// ================= GET ALL TEACHERS =================
export const getTeachers =
async (req, res) => {

  try {

    const [teachers] =
      await pool.query(`
        SELECT
          id,
          name,
          email
        FROM users
        WHERE role='TEACHER'
      `);

    res.status(200).json({
      success: true,
      teachers,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// ================= GET ALL APPROVED TEACHERS =================

// export const getAllTeachers = async (req, res) => {
//   try {

//     const [teachers] = await pool.query(`
//       SELECT 
//         id,
//         name,
//         email
//       FROM users
//       WHERE role = 'TEACHER'
//       AND status = 'Active'
//       AND approval_status = 'APPROVED'
//       ORDER BY name ASC
//     `);

//     res.status(200).json({
//       success: true,
//       teachers,
//     });

//   } catch (error) {
//     console.log(error);

//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch teachers",
//     });
//   }
// };

// ================= ADD TEACHER (REQUEST) =================
export const createTeacher = async (req, res) => {
  try {
    const { name, email, password, subject } = req.body;

    // CHECK EXISTING EMAIL
    const checkSql = `
      SELECT * FROM teachers
      WHERE email = ?
    `;

    const [existing] = await pool.query(checkSql, [email]);

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Teacher already exists",
      });
    }

    const sql = `
      INSERT INTO teachers
      (name, email, password, subject, status)
      VALUES (?, ?, ?, ?, 'PENDING')
    `;

    await pool
      .promise()
      .query(sql, [
        name,
        email,
        password,
        subject,
      ]);

    res.json({
      success: true,
      message:
        "Teacher request submitted successfully",
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ================= UPDATE TEACHER =================
export const updateTeacher = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      email,
      subject,
      status,
    } = req.body;

    const sql = `
      UPDATE teachers
      SET
        name = ?,
        email = ?,
        subject = ?,
        status = ?
      WHERE id = ?
    `;

    await pool
      .promise()
      .query(sql, [
        name,
        email,
        subject,
        status,
        id,
      ]);

    res.json({
      success: true,
      message: "Teacher updated successfully",
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ================= DELETE TEACHER =================
export const deleteTeacher = async (req, res) => {
  try {
    const { id } = req.params;

    const sql = `
      DELETE FROM teachers
      WHERE id = ?
    `;

    await pool.query(sql, [id]);

    res.json({
      success: true,
      message: "Teacher deleted successfully",
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ================= APPROVE TEACHER =================
export const approveTeacher = async (req, res) => {
  try {
    const { id } = req.params;

    const sql = `
      UPDATE teachers
      SET status = 'APPROVED'
      WHERE id = ?
    `;

    await pool.query(sql, [id]);

    res.json({
      success: true,
      message: "Teacher approved successfully",
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};