import pool from "../config/db.js";

export const getAdminDashboard = async (req, res) => {
  try {

    // ================= TOTAL STUDENTS =================

    const [students] = await pool.query(`
      SELECT COUNT(*) AS totalStudents
      FROM students
    `);

    // ================= TOTAL TEACHERS =================

    const [teachers] = await pool.query(`
      SELECT COUNT(*) AS totalTeachers
      FROM teachers
    `);

    // ================= TOTAL COURSES =================

    const [courses] = await pool.query(`
      SELECT COUNT(*) AS totalCourses
      FROM courses
    `);

    // ================= TOTAL QUIZZES =================

    const [quizzes] = await pool.query(`
      SELECT COUNT(*) AS totalQuizzes
      FROM quizzes
    `);

    // ================= TOTAL ASSIGNMENTS =================

    const [assignments] = await pool.query(`
      SELECT COUNT(*) AS totalAssignments
      FROM assignments
    `);

    // ================= RECENT ASSIGNMENTS =================

    const [activities] = await pool.query(`
      SELECT
        id,
        title,
        created_at
      FROM assignments
      ORDER BY created_at DESC
      LIMIT 8
    `);

    // ================= UPCOMING EVENTS =================

    const [events] = await pool.query(`
      SELECT
        id,
        title,
        start_datetime
      FROM calendar_events
      ORDER BY start_datetime ASC
      LIMIT 5
    `);

    // ================= MONTHLY STUDENT ANALYTICS =================

    const [analytics] = await pool.query(`
      SELECT
        MONTH(created_at) AS month,
        COUNT(*) AS total
      FROM students
      GROUP BY MONTH(created_at)
      ORDER BY month ASC
    `);

    // ================= RESPONSE =================

    res.status(200).json({

      stats: {
        totalStudents:
          students[0].totalStudents,

        totalTeachers:
          teachers[0].totalTeachers,

        totalCourses:
          courses[0].totalCourses,

        totalQuizzes:
          quizzes[0].totalQuizzes,

        totalAssignments:
          assignments[0].totalAssignments,
      },

      activities,

      events,

      analytics,

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });

  }
};