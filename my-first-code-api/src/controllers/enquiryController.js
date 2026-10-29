import pool from "../config/db.js";

// ======================================
// SEND ENQUIRY
// ======================================

export const sendEnquiry =
async (req, res) => {

  try {

    const studentId =
      req.user.id;

    const {
      teacher_id,
      subject,
      message,
    } = req.body;

    if (
      !teacher_id ||
      !message
    ) {

      return res.status(400)
      .json({
        success: false,
        message:
          "Teacher and message required",
      });
    }

    await pool.query(

      `
      INSERT INTO enquiries
      (
        student_id,
        teacher_id,
        subject,
        message
      )
      VALUES (?, ?, ?, ?)
      `,

      [
        studentId,
        teacher_id,
        subject,
        message,
      ]
    );

    res.json({
      success: true,
      message:
        "Enquiry sent successfully",
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
      message:
        "Server Error",
    });
  }
};

// ======================================
// STUDENT ENQUIRIES
// ======================================

export const getStudentEnquiries =
async (req, res) => {

  try {

    const studentId =
      req.user.id;

    const [data] =
      await pool.query(

      `
      SELECT

      enquiries.*,

      users.name AS teacherName

      FROM enquiries

      JOIN users
      ON users.id =
      enquiries.teacher_id

      WHERE student_id = ?

      ORDER BY enquiries.id DESC
      `,

      [studentId]
    );

    res.json({
      success: true,
      enquiries: data,
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
      message:
        "Server Error",
    });
  }
};


// ======================================
// ADMIN: ALL ENQUIRIES
// ======================================

export const getAllEnquiries =
async (req, res) => {

  try {

    const [data] =
      await pool.query(

      `
      SELECT

      enquiries.*,

      s.name AS studentName,
      t.name AS teacherName

      FROM enquiries

      LEFT JOIN users s
      ON s.id = enquiries.student_id

      LEFT JOIN users t
      ON t.id = enquiries.teacher_id

      ORDER BY enquiries.id DESC
      `
    );

    res.json({
      success: true,
      enquiries: data,
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
      message:
        "Server Error",
    });
  }
};


// ======================================
// TEACHER ENQUIRIES
// ======================================

export const getTeacherEnquiries =
async (req, res) => {

  try {

    const teacherId =
      req.user.id;

    const [data] =
      await pool.query(

      `
      SELECT

      enquiries.*,

      users.name AS studentName

      FROM enquiries

      JOIN users
      ON users.id =
      enquiries.student_id

      WHERE teacher_id = ?

      ORDER BY enquiries.id DESC
      `,

      [teacherId]
    );

    res.json({
      success: true,
      enquiries: data,
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
      message:
        "Server Error",
    });
  }
};

// ======================================
// REPLY ENQUIRY
// ======================================

export const replyEnquiry =
async (req, res) => {

  try {

    const { id } =
      req.params;

    const { reply } =
      req.body;

    await pool.query(

      `
      UPDATE enquiries
      SET
        reply = ?,
        status = 'replied'
      WHERE id = ?
      `,

      [
        reply,
        id,
      ]
    );

    res.json({
      success: true,
      message:
        "Reply sent successfully",
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
      message:
        "Server Error",
    });
  }
};