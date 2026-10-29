import pool from "../config/db.js";


// ================= GET ALL COURSES =================

export const getCourses = async (
  req,
  res
) => {

  try {

    const sql = `
      SELECT *
      FROM courses
      ORDER BY id DESC
    `;

    const [courses] =
      await pool.query(sql);

    res.status(200).json({
      success: true,
      courses,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ================= GET SINGLE COURSE =================

export const getSingleCourse = async (
  req,
  res
) => {

  try {

    const { id } = req.params;

    const sql = `
      SELECT *
      FROM courses
      WHERE id=?
    `;

    const [result] =
      await pool.query(
        sql,
        [id]
      );

    if (result.length === 0) {

      return res.status(404).json({
        success: false,
        message:
          "Course Not Found",
      });
    }

    res.status(200).json({
      success: true,
      course: result[0],
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ================= GET TEACHER COURSES =================

export const getTeacherCourses =
  async (req, res) => {

    try {

      const { teacher_id } =
        req.params;

      const sql = `
        SELECT *
        FROM courses
        WHERE teacher_id=?
        ORDER BY id DESC
      `;

      const [courses] =
        await pool.query(
          sql,
          [teacher_id]
        );

      res.status(200).json({
        success: true,
        courses,
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };


// ================= CREATE COURSE =================

export const createCourse = async (
  req,
  res
) => {

  try {

    const {
      title,
      description,
      category,
      standard,
      thumbnail,
      teacher_id,
      status,
    } = req.body;

    const sql = `
      INSERT INTO courses
      (
        title,
        description,
        category,
        standard,
        thumbnail,
        teacher_id,
        status
      )

      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] =
      await pool.query(
        sql,
        [
          title,
          description || "",
          category,
          standard,
          thumbnail || "",
          teacher_id,
          status || "draft",
        ]
      );

    res.status(201).json({
      success: true,
      message:
        "Course Created Successfully",
      courseId:
        result.insertId,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ================= UPDATE COURSE =================

export const updateCourse = async (
  req,
  res
) => {

  try {

    const { id } = req.params;

    const {
      title,
      description,
      category,
      standard,
      thumbnail,
      status,
    } = req.body;

    const sql = `
      UPDATE courses

      SET
        title=?,
        description=?,
        category=?,
        standard=?,
        thumbnail=?,
        status=?

      WHERE id=?
    `;

    const [result] =
      await pool.query(
        sql,
        [
          title,
          description,
          category,
          standard,
          thumbnail,
          status,
          id,
        ]
      );

    if (
      result.affectedRows === 0
    ) {

      return res.status(404).json({
        success: false,
        message:
          "Course Not Found",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Course Updated Successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ================= DELETE COURSE =================

export const deleteCourse = async (
  req,
  res
) => {

  try {

    const { id } = req.params;

    const sql = `
      DELETE FROM courses
      WHERE id=?
    `;

    const [result] =
      await pool.query(
        sql,
        [id]
      );

    if (
      result.affectedRows === 0
    ) {

      return res.status(404).json({
        success: false,
        message:
          "Course Not Found",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Course Deleted Successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getCourseDetail =
  async (req, res) => {

    try {

      const { id } =
        req.params;

      const [course] =
        await pool.query(
          `
          SELECT *
          FROM courses
          WHERE id = ?
          `,
          [id]
        );

      const [chapters] =
        await pool.query(
          `
          SELECT *
          FROM course_lessons
          WHERE course_id = ?
          `,
          [id]
        );

      return res.status(200).json({

        success: true,

        course: course[0],

        chapters,

      });

    } catch (error) {

      return res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };


// ================= GET COURSES BY STANDARD =================

export const getCoursesByStandard =
  async (req, res) => {

  try {

    const { standard } =
      req.params;

    const sql = `
      SELECT
        c.*,
        u.name AS teacher_name

      FROM courses c

      LEFT JOIN users u
      ON c.teacher_id = u.id

      WHERE c.standard = ?
      AND c.status = 'Published'

      ORDER BY c.id DESC
    `;

    const [courses] =
      await pool.query(sql, [standard]);

    res.status(200).json({
      success: true,
      courses,
    });

  } catch (error) {

    console.log(
      "GET COURSES ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};