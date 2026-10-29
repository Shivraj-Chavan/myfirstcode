import pool from "../config/db.js";

// ================= GLOBAL LEADERBOARD =================

export const getLeaderboard = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        u.id AS student_id,
        u.name,
        u.standard,
        COALESCE(SUM(qr.score), 0) AS totalScore,
        COUNT(qr.id) AS quizzesTaken,
        ROUND(AVG(qr.percentage), 1) AS avgPercentage

      FROM users u

      LEFT JOIN quiz_results qr
      ON qr.student_id = u.id

      WHERE u.role = 'student'

      GROUP BY u.id, u.name, u.standard

      ORDER BY totalScore DESC, avgPercentage DESC
    `);

    res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.log("GET LEADERBOARD ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// ================= STUDENT GROWTH (score over time) =================

export const getStudentGrowth = async (req, res) => {
    try {
      const { studentId } = req.params;
  
      const [rows] = await pool.query(
        `
        SELECT
          qr.id,
          qr.quiz_id,
          q.title AS quizTitle,
          qr.score,
          qr.total_marks,
          qr.percentage,
          qr.status,
          qr.attempt_no,
          qr.created_at
  
        FROM quiz_results qr
  
        LEFT JOIN quizzes q
        ON q.id = qr.quiz_id
  
        WHERE qr.student_id = ?
  
        ORDER BY qr.created_at ASC
        `,
        [studentId]
      );
  
      // Running cumulative total — this is the "growth" line
      let cumulative = 0;
      const growth = rows.map((r) => {
        cumulative += Number(r.score);
        return { ...r, cumulativeScore: cumulative };
      });
  
      res.status(200).json({
        success: true,
        data: growth,
      });
    } catch (error) {
      console.log("GET STUDENT GROWTH ERROR:", error);
  
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
  
// ================= LEADERBOARD BY STANDARD =================

export const getLeaderboardByStandard = async (req, res) => {
  try {
    const { standard } = req.params;

    const [rows] = await pool.query(
      `
      SELECT
        u.id AS student_id,
        u.name,
        u.standard,
        COALESCE(SUM(qr.score), 0) AS totalScore,
        COUNT(qr.id) AS quizzesTaken,
        ROUND(AVG(qr.percentage), 1) AS avgPercentage

      FROM users u

      LEFT JOIN quiz_results qr
      ON qr.student_id = u.id

      WHERE u.role = 'student'
      AND u.standard = ?

      GROUP BY u.id, u.name, u.standard

      ORDER BY totalScore DESC, avgPercentage DESC
      `,
      [standard]
    );

    res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.log("GET LEADERBOARD BY STANDARD ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};