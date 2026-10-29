import pool from "../config/db.js";

// ================= STUDENT DASHBOARD =================

export const getStudentDashboard =
  async (req, res) => {

    try {

      // ================= TOTAL COURSES =================

      const [courses] =
        await pool.query(`
          SELECT COUNT(*) AS total
          FROM courses
        `);

      // ================= TOTAL QUIZZES =================

      const [quizzes] =
        await pool.query(`
          SELECT COUNT(*) AS total
          FROM quizzes
        `);

      // ================= TOTAL ASSIGNMENTS =================

      const [assignments] =
        await pool.query(`
          SELECT COUNT(*) AS total
          FROM assignments
        `);

      // ================= COMPLETED COURSES =================
      // TEMP STATIC VALUE

      const completedCalender = 4;

      // ================= RECENT QUIZZES =================

      const [recentQuizzes] =
        await pool.query(`
          SELECT *
          FROM quizzes
          ORDER BY created_at DESC
          LIMIT 5
        `);

      // ================= EVENTS =================

      const [events] =
  await pool.query(`
    SELECT
      id,
      title,
      event_type,
      start_datetime
    FROM calendar_events
    ORDER BY start_datetime ASC
    LIMIT 5
  `);

      // ================= ANALYTICS =================
      // TEMP STATIC DATA

      const analytics = [
        {
          month: "Jan",
          total: 4,
        },
        {
          month: "Feb",
          total: 7,
        },
        {
          month: "Mar",
          total: 5,
        },
        {
          month: "Apr",
          total: 9,
        },
        {
          month: "May",
          total: 6,
        },
      ];

      return res.status(200).json({

        success: true,

        stats: {

          totalCourses:
            courses[0]?.total || 0,

          totalQuizzes:
            quizzes[0]?.total || 0,

          totalAssignments:
            assignments[0]?.total || 0,

            completedCalender,

        },

        recentQuizzes,

        events,

        analytics,

      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };