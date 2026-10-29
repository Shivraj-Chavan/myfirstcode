import pool from "../config/db.js";


// ================= GET ALL STUDENTS =================

export const getStudents = async (
  req,
  res
) => {

  try {

    const sql = `
      SELECT *
      FROM students
      ORDER BY id DESC
    `;

   const [result] =
  await pool.query(sql);

    res.status(200).json({
      success: true,
      students: result,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ================= GET SINGLE STUDENT =================

export const getStudent = async (
  req,
  res
) => {

  try {

    const { id } = req.params;

    const sql = `
      SELECT
        s.*,
        u.name AS teacher_name

      FROM students s

      LEFT JOIN users u
      ON s.teacher_id = u.id

      WHERE s.id=?
    `;

    const [result] =
      await pool.query(sql, [id]);

    if (result.length === 0) {

      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      student: result[0],
    });

  } catch (error) {

    console.log(
      "GET STUDENT ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ================= CREATE STUDENT =================

export const createStudent = async (req, res) => {

  try {

    const {
      name,
      email,
      phone,
      standard,
      course,
    } = req.body;

    if (
      !name ||
      !email ||
      !phone ||
      !standard ||
      !course
    ) {

      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // CHECK EXISTING EMAIL

const [exist] = await pool.query(
  `
  SELECT * FROM students
  WHERE email = ?
  `,
  [email]
);

if (exist.length > 0) {

  return res.status(400).json({
    success: false,
    message: "Student already exists",
  });
}
    const sql = `
      INSERT INTO students
      (
        name,
        email,
        phone,
        standard,
        course,
        status,
        registration_status
      )

      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    await pool.query(sql, [
      name,
      email,
      phone,
      standard,
      course,
      "Active",
      "PENDING",
    ]);

    res.status(201).json({
      success: true,
      message: "Registration Submitted",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


// ================= UPDATE STUDENT =================

export const updateStudent = async (
  req,
  res
) => {

  try {

    const { id } = req.params;

    const {
      name,
      email,
      phone,
      standard,
      course,
      status,
    } = req.body;

    const sql = `
      UPDATE students

      SET
        name=?,
        email=?,
        phone=?,
        standard=?,
        course=?,
        status=?

      WHERE id=?
    `;

    const [result] =
      await pool.query(sql, [
          name,
          email,
          phone,
          standard,
          course,
          status,
          id,
        ]);

    if (
      result.affectedRows === 0
    ) {

      return res.status(404).json({
        success: false,
        message:
          "Student Not Found",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Student Updated Successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ================= DELETE STUDENT =================

export const deleteStudent = async (
  req,
  res
) => {

  try {

    const { id } = req.params;

    const sql = `
      DELETE FROM students
      WHERE id=?
    `;

    const [result] =
      await pool.query(sql, [id]);

    if (
      result.affectedRows === 0
    ) {

      return res.status(404).json({
        success: false,
        message:
          "Student Not Found",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Student Deleted Successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const assignStudentTeacher = async (req, res) => {

  try {

    const { id } = req.params;

    const {
      teacher_id,
      batch_name,
      assigned_by,
    } = req.body;

    if (!teacher_id || !batch_name) {

      return res.status(400).json({
        success: false,
        message: "Teacher and Batch required",
      });
    }

    // CHECK TEACHER EXISTS

    const [teacher] = await pool.query(
      `
      SELECT id, name
      FROM users
      WHERE id=? AND role='TEACHER'
      `,
      [teacher_id]
    );

    if (teacher.length === 0) {

      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    const sql = `
      UPDATE students

      SET
        teacher_id=?,
        batch_name=?,
        assigned_by=?,
        assigned_at=NOW(),
        registration_status='ASSIGNED'

      WHERE id=?
    `;

    const [result] = await pool.query(sql, [
      teacher_id,
      batch_name.trim(),
      assigned_by || null,
      id,
    ]);

    if (result.affectedRows === 0) {

      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Student Assigned Successfully",
    });

  } catch (error) {

    console.log(
      "ASSIGN STUDENT ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getTeacherStudents = async (req, res) => {

  try {

    const teacherId = req.user.id;

    const sql = `
    SELECT
      s.*,
      u.name AS teacher_name
  
    FROM students s
  
    LEFT JOIN users u
    ON s.teacher_id = u.id
  
    WHERE s.teacher_id=?
  
    ORDER BY s.batch_name ASC,
             s.id DESC
  `;

    const [students] =
      await pool.query(sql, [teacherId]);

    res.status(200).json({
      success: true,
      students,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


export const getStudentFullProgress =
  async (req, res) => {

  try {

    const { id } = req.params;

    // STUDENT

    const [student] = await pool.query(
      `
      SELECT *
      FROM students
      WHERE id=?
      `,
      [id]
    );

    // LEVELS

    let levels = [];

    try {

      const [result] = await pool.query(
        `
        SELECT *
        FROM student_levels
        WHERE student_id=?
        `,
        [id]
      );

      levels = result;

    } catch (err) {

      console.log(
        "LEVELS ERROR:",
        err.message
      );
    }

    // ASSIGNMENTS

    let assignments = [];

    try {

      const [result] = await pool.query(
        `
        SELECT
          a.title,
          s.marks,
          s.submitted_at

        FROM assignment_submissions s

        LEFT JOIN assignments a
        ON s.assignment_id = a.id

        WHERE s.student_id=?
        `,
        [id]
      );

      assignments = result;

    } catch (err) {

      console.log(
        "ASSIGNMENTS ERROR:",
        err.message
      );
    }

    // QUIZZES

    let quizzes = [];

    try {

      const [result] = await pool.query(
        `
        SELECT
          q.title,
          qa.marks,
          qa.status,
          qa.attempted_at

        FROM quiz_attempts qa

        LEFT JOIN quizzes q
        ON qa.quiz_id = q.id

        WHERE qa.student_id=?
        `,
        [id]
      );

      quizzes = result;

    } catch (err) {

      console.log(
        "QUIZ ERROR:",
        err.message
      );
    }

    res.status(200).json({
      success: true,
      student: student[0] || null,
      levelsCompleted: levels.length,
      levels,
      assignments,
      quizzes,
    });

  } catch (error) {

    console.log(
      "FULL PROGRESS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const assignLevelsToStudent = async (req, res) => {
  try {
    console.log("BODY RECEIVED:", req.body);

    const { student_id, level_ids } = req.body;

    console.log("student_id:", student_id);
    console.log("level_ids:", level_ids);

    await pool.query(
      "DELETE FROM student_levels WHERE student_id=?",
      [student_id]
    );

    for (const levelId of level_ids) {
      console.log("INSERTING:", student_id, levelId);

      await pool.query(
        `
        INSERT INTO student_levels
        (student_id, level_id)
        VALUES (?,?)
        `,
        [student_id, levelId]
      );
    }

    const [rows] = await pool.query(
      "SELECT * FROM student_levels WHERE student_id=?",
      [student_id]
    );

    console.log("AFTER INSERT:", rows);

    res.json({
      success: true
    });

  } catch (err) {
    console.error(err);
  }
};

export const getStudentLevels = async (req, res) => {
  try {
    const { studentId } = req.params;

    const [rows] = await pool.query(
      `
      SELECT
        sl.id,
        sl.student_id,
        sl.level_id,
        l.level_name,
        l.level_number
      FROM student_levels sl
      JOIN levels l
      ON sl.level_id = l.id
      WHERE sl.student_id = ?
      `,
      [studentId]
    );

    res.json({
      success: true,
      levels: rows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * REMOVE SINGLE LEVEL
 * DELETE /student-levels/:studentId/:levelId
 */
export const removeStudentLevel =
  async (req, res) => {
    try {
      const {
        studentId,
        levelId,
      } = req.params;

      await pool.execute(
        `
        DELETE FROM student_levels
        WHERE student_id = ?
        AND level_id = ?
        `,
        [
          studentId,
          levelId,
        ]
      );

      res.status(200).json({
        success: true,
        message:
          "Level removed successfully",
      });

    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  };

export const assignLevels = async () => {
    try {
  
      console.log("Selected Student:", selectedStudent);
  
      console.log("Sending:", {
        student_id: selectedStudent.id,
        level_ids: selectedLevels
      });
  
      await axios.post(
        ENDPOINT.ASSIGN_LEVELS,
        {
          student_id: selectedStudent.id,
          level_ids: selectedLevels
        }
      );
  
      alert("Levels assigned successfully");
  
    } catch (err) {
      console.error(err);
    }
  };

export default {
  assignLevels,
  getStudentLevels,
  removeStudentLevel,
};