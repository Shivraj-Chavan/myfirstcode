import pool from "../config/db.js";


// ========================
// CREATE ASSIGNMENT
// ========================

export const createAssignment =
async (req, res) => {

  try {

    const {

      title,                                         
      description,
      standard,
      language,
      categoryId,
      difficulty,
      starter_code,
      solution_code,
      expected_output,
      hints,
      testCases,
      marks

    } = req.body;

    await pool.query(

      `
      INSERT INTO assignments
      (
        created_by,
        title,
        description,
        standard,
        language,
        category,
        difficulty,
        starter_code,
        solution_code,
        expected_output,
        hints,
        test_cases,
        marks
      )

      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,

      [
        req.user.id,
        title,
        description,
        standard,
        language,
        categoryId,
        difficulty,
        starter_code,
        solution_code,
        expected_output,
        JSON.stringify(hints),
        JSON.stringify(testCases),
        marks
      ]
    );

    res.status(201).json({
      message:
        "Assignment created"
    });

  } catch (err) {

    res.status(500).json({
      message: err.message
    });
  }
};




// ======================================================
// GET ASSIGNMENT ATTEMPTS
// ======================================================

export const getAssignmentAttempts =
async (req, res) => {

  try {

    const assignmentId =
      req.params.id;

    // ======================================================
    // GET ASSIGNMENT
    // ======================================================

    const [assignmentRows] =
      await pool.query(

        `
        SELECT *
        FROM assignments
        WHERE id = ?
        `,

        [assignmentId]
      );

    if (
      assignmentRows.length === 0
    ) {

      return res.status(404).json({

        success: false,
        message: "Assignment not found",
      });
    }

    const assignment =
      assignmentRows[0];

    // ======================================================
    // GET ALL STUDENTS OF SAME STANDARD
    // ======================================================

    const [students] =
      await pool.query(

        `
        SELECT

          id,
          name,
          email,
          standard

        FROM users

        WHERE role = 'student'
        AND standard = ?
        `,

        [assignment.standard]
      );

    // ======================================================
    // GET ALL ATTEMPTS
    // ======================================================

    const [attempts] =
      await pool.query(

        `
        SELECT

  s.id,
  s.student_id,
  s.assignment_id,
  s.code,
  s.output,
  s.score,
  s.status,
  s.created_at,
  a.language,

  u.name,
  u.email,
  u.standard

FROM assignment_submissions s

LEFT JOIN users u
ON s.student_id = u.id

LEFT JOIN assignments a
ON s.assignment_id = a.id
        `,

        [assignmentId]
      );

    // ======================================================
    // BUILD RESPONSE
    // ======================================================

    const result =
      students.map((student) => {

        const studentAttempts =
          attempts.filter(
            (attempt) =>
              Number(attempt.student_id) ===
              Number(student.id)
          );

        // ==================================================
        // NOT ATTEMPTED
        // ==================================================

        if (
          studentAttempts.length === 0
        ) {

          return {

            studentId:
              student.id,

            studentName:
              student.name,

            email:
              student.email,

            standard:
              student.standard,

            attempted:
              false,

            totalAttempts: 0,

            latestSubmission:
              null,

            submissions: [],
          };
        }

        // ==================================================
        // ATTEMPTED
        // ==================================================

        return {

          studentId:
            student.id,

          studentName:
            student.name,

          email:
            student.email,

          standard:
            student.standard,

          attempted:
            true,

          totalAttempts:
            studentAttempts.length,

          latestSubmission: {

            id:
              studentAttempts[0].id,

            code:
              studentAttempts[0].code,

            language:
              studentAttempts[0].language,

            score:
              studentAttempts[0].score,

            status:
              studentAttempts[0].status,

            submittedAt:
              studentAttempts[0].submitted_at,
          },

          submissions:
            studentAttempts.map(
              (attempt) => ({

                id:
                  attempt.id,

                code:
                  attempt.code,

                language:
                  attempt.language,

                score:
                  attempt.score,

                status:
                  attempt.status,

                submittedAt:
                  attempt.submitted_at,
              })
            ),
        };
      });

    // ======================================================
    // FINAL RESPONSE
    // ======================================================

    return res.status(200).json({

      success: true,

      assignment: {

        id:
          assignment.id,

        title:
          assignment.title,

        standard:
          assignment.standard,

        marks:
          assignment.marks,
      },

      totalStudents:
        students.length,

      attempted:
        result.filter(
          (r) => r.attempted
        ).length,

      notAttempted:
        result.filter(
          (r) => !r.attempted
        ).length,

      data:
        result,
    });

  } catch (err) {

    console.log(
      "GET ASSIGNMENT ATTEMPTS ERROR",
      err 
    );

    return res.status(500).json({

      success: false,

      message:
        err.message,
    });
  }
};



// ========================
// GET ASSIGNMENTS
// ========================

export const getAssignments =
  async (req, res) => {

    try {

      const [assignments] =
      await pool.query(`
    
        SELECT
          a.*,
          u.name AS teacherName
    
        FROM assignments a
    
        LEFT JOIN users u
        ON a.created_by = u.id
    
        ORDER BY a.created_at DESC
    
      `);

      res.json({
        success: true,
        assignments,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch assignments",
      });

    }
  };



// ========================
// UPDATE ASSIGNMENT
// ========================

export const updateAssignment =
async (req, res) => {

  try {

    const { id } = req.params;

    const {

      title,
      description,
      standard,
      language,
      categoryId,
      difficulty,
      starter_code,
      solution_code,
      expected_output,
      hints,
      testCases,
      marks

    } = req.body;

    await pool.query(

      `
      UPDATE assignments

      SET

      title=?,
      description=?,
      standard=?,
      language=?,
      category=?,
      difficulty=?,
      starter_code=?,
      solution_code=?,
      expected_output=?,
      hints=?,
      test_cases=?,
      marks=?

      WHERE id=?
      `,

      [

        title,
        description,
        standard,
        language,
        categoryId,
        difficulty,
        starter_code,
        solution_code,
        expected_output,
        JSON.stringify(hints),
        JSON.stringify(testCases),
        marks,
        id

      ]
    );

    res.json({
      message:
        "Assignment updated"
    });

  } catch (err) {

    res.status(500).json({
      message: err.message
    });
  }
};




// ========================
// DELETE ASSIGNMENT
// ========================

export const deleteAssignment =
async (req, res) => {

  try {

    const { id } = req.params;

    await pool.query(

      `
      DELETE FROM assignments
      WHERE id=?
      `,

      [id]
    );

    res.json({
      message:
        "Assignment deleted"
    });

  } catch (err) {

    res.status(500).json({
      message: err.message
    });
  }
};