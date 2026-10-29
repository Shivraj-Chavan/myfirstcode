import pool from "../config/db.js";


// ================= CREATE QUIZ =================

export const createQuiz =
  async (req, res) => {

    try {

      const {

        title,
        description,
        standard,
        category,
        duration,
        questions,

      } = req.body;

      const created_by =
        req.user.id;

      // ================= INSERT QUIZ =================

      const [quizResult] =
        await pool.query(

          `
          INSERT INTO quizzes
          (
            title,
            description,
            standard,
            category,
            duration,
            created_by
          )
          VALUES (?, ?, ?, ?, ?, ?)
          `,

          [
            title,
            description,
            standard,
            category,
            duration,
            created_by,
          ]
        );

      const quizId =
        quizResult.insertId;

      // ================= INSERT QUESTIONS =================

      let totalMarks = 0;

      for (const q of questions) {

        totalMarks +=
          Number(q.marks);

        await pool.query(

          `
          INSERT INTO quiz_questions
          (
            quiz_id,
            question,
            option_a,
            option_b,
            option_c,
            option_d,
            correct_answer,
            marks
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `,

          [
            quizId,
            q.question,
            q.option_a,
            q.option_b,
            q.option_c,
            q.option_d,
            q.correct_answer,
            q.marks,
          ]
        );
      }

      // ================= UPDATE TOTAL MARKS =================

      await pool.query(

        `
        UPDATE quizzes
        SET total_marks=?
        WHERE id=?
        `,

        [
          totalMarks,
          quizId,
        ]
      );

      res.status(201).json({

        success: true,

        message:
          "Quiz Created Successfully",

        quizId,
      });

    } catch (err) {

      console.log(err);

      res.status(500).json({

        success: false,

        message: err.message,
      });
    }
  };

// ================= SUBMIT QUIZ =================

export const submitQuiz = async (
  req,
  res
) => {

  try {

    const student_id =
      req.user.id;

    const quiz_id =
      req.params.id;

    const { answers } =
      req.body;

    // ================= VALIDATION =================

    if (
      !answers ||
      !Array.isArray(answers)
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Answers are required",
      });
    }

    // ================= GET QUESTIONS =================

    const [questions] =
      await pool.query(

        `
        SELECT
          id,
          correct_answer,
          marks

        FROM quiz_questions

        WHERE quiz_id = ?
        `,

        [quiz_id]
      );

    if (
      questions.length === 0
    ) {

      return res.status(404).json({

        success: false,

        message:
          "Quiz questions not found",
      });
    }

    // ================= FIND ATTEMPT =================

    let [attempt] =
      await pool.query(

        `
        SELECT *
        FROM quiz_attempts

        WHERE
          student_id = ?
          AND quiz_id = ?
          AND status = 'PENDING'

        LIMIT 1
        `,

        [
          student_id,
          quiz_id,
        ]
      );

    let attempt_id;

    // ================= CREATE ATTEMPT =================

    if (
      attempt.length === 0
    ) {

      const [newAttempt] =
        await pool.query(

          `
          INSERT INTO quiz_attempts (

            student_id,
            quiz_id,
            status

          )

          VALUES (?, ?, 'PENDING')
          `,

          [
            student_id,
            quiz_id,
          ]
        );

      attempt_id =
        newAttempt.insertId;

    } else {

      attempt_id =
        attempt[0].id;
    }

    // ================= CALCULATE SCORE =================

    let score = 0;

    let total_marks = 0;

    questions.forEach(
      (question) => {

        total_marks +=
          Number(question.marks);

        const studentAnswer =
          answers.find(
            (a) =>
              Number(a.question_id) ===
              Number(question.id)
          );

        if (

          studentAnswer &&
          studentAnswer.answer ===
          question.correct_answer

        ) {

          score +=
            Number(question.marks);
        }
      }
    );

    // ================= PERCENTAGE =================

    const percentage =
      total_marks > 0

        ? (
            (score / total_marks) * 100
          ).toFixed(2)

        : 0;

    // ================= PASS/FAIL =================

    const status =
      percentage >= 35
        ? "Passed"
        : "Failed";

    // ================= ATTEMPT COUNT =================

    const [attemptRows] =
      await pool.query(

        `
        SELECT COUNT(*) AS total

        FROM quiz_results

        WHERE
          student_id = ?
          AND quiz_id = ?
        `,

        [
          student_id,
          quiz_id,
        ]
      );

    const attempt_no =
      attemptRows[0].total + 1;

    // ================= SAVE QUIZ RESULT =================

    await pool.query(

      `
      INSERT INTO quiz_results (

        student_id,
        quiz_id,
        score,
        total_marks,
        percentage,
        status,
        attempt_no

      )

      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,

      [

        student_id,
        quiz_id,
        score,
        total_marks,
        percentage,
        status,
        attempt_no,
      ]
    );

    // ================= DELETE OLD ANSWERS =================

    await pool.query(

      `
      DELETE FROM quiz_answers
      WHERE attempt_id = ?
      `,

      [attempt_id]
    );

    // ================= SAVE ANSWERS =================

    for (const ans of answers) {

      if (
        !ans.question_id ||
        !ans.answer
      ) {
        continue;
      }

      await pool.query(

        `
        INSERT INTO quiz_answers (

          attempt_id,
          student_id,
          quiz_id,
          question_id,
          selected_answer

        )

        VALUES (?, ?, ?, ?, ?)
        `,

        [

          attempt_id,
          student_id,
          quiz_id,
          ans.question_id,
          ans.answer,
        ]
      );
    }

    // ================= COMPLETE ATTEMPT =================

    await pool.query(

      `
      UPDATE quiz_attempts

      SET
        status = 'COMPLETED',
        submitted_at = NOW()

      WHERE id = ?
      `,

      [attempt_id]
    );

    // ================= RESPONSE =================

    return res.status(200).json({

      success: true,

      message:
        "Quiz submitted successfully",

      data: {

        score,

        total_marks,

        percentage,

        status,

        attempt_no,
      },
    });

  } catch (err) {

    console.log(
      "SUBMIT QUIZ ERROR",
      err
    );

    return res.status(500).json({

      success: false,

      message:
        err.message,
    });
  }
};



// ================= GET ALL QUIZZES =================

export const getAllQuizzes = async (
  req,
  res
) => {

  try {

    const student_id =
      req.user.id;

const [quizzes] =
  await pool.query(

    `
    SELECT

      q.*,

      qa.status AS attempt_status,

      qr.score,
      qr.total_marks,
      qr.percentage,
      qr.status AS result_status,
      qr.attempt_no

    FROM quizzes q

    LEFT JOIN (

      SELECT qa1.*

      FROM quiz_attempts qa1

      INNER JOIN (

        SELECT
          quiz_id,
          MAX(id) AS latest_id

        FROM quiz_attempts

        WHERE student_id = ?

        GROUP BY quiz_id

      ) qa2

      ON qa1.id = qa2.latest_id

    ) qa

    ON q.id = qa.quiz_id

    LEFT JOIN (

      SELECT qr1.*

      FROM quiz_results qr1

      INNER JOIN (

        SELECT
          quiz_id,
          MAX(id) AS latest_id

        FROM quiz_results

        WHERE student_id = ?

        GROUP BY quiz_id

      ) qr2

      ON qr1.id = qr2.latest_id

    ) qr

    ON q.id = qr.quiz_id

    ORDER BY q.id DESC
    `,

    [
      student_id,
      student_id,
    ]
  );

    return res.status(200).json({

      success: true,

      data: quizzes,

    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({

      success: false,

      message: error.message,

    });
  }
};

// ================= GET SINGLE QUIZ =================

export const getSingleQuiz =
  async (req, res) => {

    try {

      const { id } =
        req.params;

      // ================= QUIZ =================

      const [quiz] =
        await pool.query(

          `
          SELECT *
          FROM quizzes
          WHERE id=?
          `,

          [id]
        );

      if (
        quiz.length === 0
      ) {

        return res.status(404).json({

          success: false,

          message:
            "Quiz Not Found",
        });
      }

      // ================= QUESTIONS =================

      const [questions] =
        await pool.query(

          `
          SELECT *
          FROM quiz_questions
          WHERE quiz_id=?
          `,

          [id]
        );

      res.status(200).json({

        success: true,

        quiz: quiz[0],

        questions,
      });

    } catch (err) {

      res.status(500).json({

        success: false,

        message: err.message,
      });
    }
  };


// ================= UPDATE QUIZ =================

export const updateQuiz =
  async (req, res) => {

    try {

      const { id } =
        req.params;

      const {

        title,
        description,
        standard,
        category,
        duration,
        questions,

      } = req.body;

      // ================= UPDATE QUIZ =================

      await pool.query(

        `
        UPDATE quizzes
        SET
          title=?,
          description=?,
          standard=?,
          category=?,
          duration=?
        WHERE id=?
        `,

        [
          title,
          description,
          standard,
          category,
          duration,
          id,
        ]
      );

      // ================= DELETE OLD QUESTIONS =================

      await pool.query(

        `
        DELETE FROM quiz_questions
        WHERE quiz_id=?
        `,

        [id]
      );

      // ================= INSERT NEW QUESTIONS =================

      let totalMarks = 0;

      for (const q of questions) {

        totalMarks +=
          Number(q.marks);

        await pool.query(

          `
          INSERT INTO quiz_questions
          (
            quiz_id,
            question,
            option_a,
            option_b,
            option_c,
            option_d,
            correct_answer,
            marks
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `,

          [
            id,
            q.question,
            q.option_a,
            q.option_b,
            q.option_c,
            q.option_d,
            q.correct_answer,
            q.marks,
          ]
        );
      }

      // ================= UPDATE MARKS =================

      await pool.query(

        `
        UPDATE quizzes
        SET total_marks=?
        WHERE id=?
        `,

        [
          totalMarks,
          id,
        ]
      );

      res.status(200).json({

        success: true,

        message:
          "Quiz Updated Successfully",
      });

    } catch (err) {

      console.log(err);

      res.status(500).json({

        success: false,

        message: err.message,
      });
    }
  };


// ================= DELETE QUIZ =================

export const deleteQuiz =
  async (req, res) => {

    try {

      const { id } =
        req.params;

      // ================= DELETE QUESTIONS =================

      await pool.query(

        `
        DELETE FROM quiz_questions
        WHERE quiz_id=?
        `,

        [id]
      );

      // ================= DELETE QUIZ =================

      await pool.query(

        `
        DELETE FROM quizzes
        WHERE id=?
        `,

        [id]
      );

      res.status(200).json({

        success: true,

        message:
          "Quiz Deleted Successfully",
      });

    } catch (err) {

      res.status(500).json({

        success: false,

        message: err.message,
      });
    }
  };


// ================= GET QUIZ RESULTS =================

export const getQuizResults =
  async (req, res) => {

    try {

      const { id } = req.params;

      const [results] =
        await pool.query(

          `
          SELECT
            qr.*,
            u.name AS student_name,
            u.email AS student_email
          FROM quiz_results qr
          JOIN users u
          ON qr.student_id = u.id
          WHERE qr.quiz_id = ?
          ORDER BY qr.score DESC
          `,
          [id]
        );

      return res.status(200).json({

        success: true,

        data: results,
      });

    } catch (error) {

      console.log(
        "GET QUIZ RESULTS ERROR",
        error
      );

      return res.status(500).json({

        success: false,

        message: error.message,
      });
    }
  };