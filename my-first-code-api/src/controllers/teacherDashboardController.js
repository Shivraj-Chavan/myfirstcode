import pool from "../config/db.js";

export const getTeacherDashboard = async (req, res) => {
  try {

    // ================= TOTAL COURSES =================

    const [courses] = await pool.query(`
      SELECT COUNT(*) AS totalCourses
      FROM courses
    `);

    // ================= TOTAL ASSIGNMENTS =================

    const [assignments] = await pool.query(`
      SELECT COUNT(*) AS totalAssignments
      FROM assignments
    `);

    // ================= TOTAL QUIZZES =================

    const [quizzes] = await pool.query(`
      SELECT COUNT(*) AS totalQuizzes
      FROM quizzes
    `);

    // ================= TOTAL STUDENTS =================

    const [students] = await pool.query(`
      SELECT COUNT(*) AS totalStudents
      FROM students
    `);

    // ================= RECENT ASSIGNMENTS =================

    const [submissions] = await pool.query(`
      SELECT
        id,
        title,
        created_at
      FROM assignments
      ORDER BY id DESC
      LIMIT 5
    `);

    // ================= UPCOMING EVENTS =================

    const [events] = await pool.query(`
      SELECT
        id,
        title,
        event_type,
        start_datetime,
        end_datetime
      FROM calendar_events
      ORDER BY start_datetime ASC
      LIMIT 5
    `);

    // ================= QUIZ ANALYTICS =================

    const [analytics] = await pool.query(`
      SELECT

        MONTH(created_at) AS monthNumber,

        DATE_FORMAT(created_at, '%b') AS month,

        COUNT(*) AS total

      FROM quizzes

      WHERE created_at IS NOT NULL

      GROUP BY
        MONTH(created_at),
        DATE_FORMAT(created_at, '%b')

      ORDER BY monthNumber ASC
    `);

    // ================= RESPONSE =================

    return res.status(200).json({

      success: true,

      stats: {

        totalCourses:
          courses[0]?.totalCourses || 0,

        totalAssignments:
          assignments[0]?.totalAssignments || 0,

        totalQuizzes:
          quizzes[0]?.totalQuizzes || 0,

        totalStudents:
          students[0]?.totalStudents || 0,
      },

      submissions,

      events,

      analytics,

    });

  } catch (error) {

    console.log(
      "Teacher Dashboard Error:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Failed to load teacher dashboard",

      error: error.message,

    });

  }
};