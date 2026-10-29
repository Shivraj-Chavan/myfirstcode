import pool from "../config/db.js";


// ========================================
// ISSUE CERTIFICATE
// ========================================

export const issueCertificate = async (req, res) => {
  try {
    console.log("BODY =>", req.body);

    const {
      student,
      studentId,
      std,
      teacher,
      course,
      type,
      grade,
      status,
      message,
    } = req.body;

    // VALIDATION
    if (
      !student ||
      !studentId ||
      !course ||
      !type ||
      !grade
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill required fields",
      });
    }

    // UNIQUE CERTIFICATE ID
    const certificateId = `CERT-${Date.now()}`;

    const sql = `
      INSERT INTO certificates
      (
        certificateId,
        student,
        studentId,
        std,
        teacher,
        course,
        type,
        grade,
        status,
        message
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      certificateId,
      student,
      studentId,
      std || "",
      teacher || "",
      course,
      type,
      grade,
      status || "Active",
      message || "",
    ];

    console.log("VALUES =>", values);

    const [result] = await pool.query(
      sql,
      values
    );

    console.log(
      "MYSQL INSERT SUCCESS =>",
      result
    );

    return res.status(201).json({
      success: true,
      message:
        "Certificate issued successfully",
      certificate: {
        id: certificateId,
        student,
        studentId,
        std,
        teacher,
        course,
        type,
        grade,
        status: status || "Active",
        message,
      },
    });

  } catch (err) {
    console.log(
      "MYSQL INSERT ERROR =>",
      err
    );

    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// ========================================
// GET ALL CERTIFICATES
// ========================================

export const getCertificates = async (req, res) => {
  try {
    const { search, status } = req.query;

    let sql = `
      SELECT *
      FROM certificates
      WHERE 1
    `;

    const values = [];

    // Search Filter
    if (search) {
      sql += `
        AND (
          student LIKE ?
          OR certificateId LIKE ?
        )
      `;

      values.push(
        `%${search}%`,
        `%${search}%`
      );
    }

    // Status Filter
    if (
      status &&
      status !== "All"
    ) {
      sql += `
        AND status = ?
      `;

      values.push(status);
    }

    // Latest First
    sql += `
      ORDER BY id DESC
    `;

    const [results] = await pool.query(
      sql,
      values
    );

    return res.status(200).json({
      success: true,
      count: results.length,
      certificates: results,
    });

  } catch (err) {
    console.error(
      "GET CERTIFICATES ERROR =>",
      err
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch certificates",
      error: err.message,
    });
  }
};

// ========================================
// GET STUDENT CERTIFICATES
// ========================================

export const getStudentCertificates =
  (req, res) => {

    const { studentId } = req.params;

    const sql = `
      SELECT * FROM certificates
      WHERE studentId = ?
      ORDER BY id DESC
    `;

    pool.query(
      sql,
      [studentId],
      (err, results) => {

        if (err) {
          return res.status(500).json({
            success: false,
            error: err,
          });
        }

        res.status(200).json({
          success: true,
          certificates: results,
        });
      }
    );
  };


// ========================================
// GET SINGLE CERTIFICATE
// ========================================

export const getSingleCertificate =
  (req, res) => {

    const sql = `
      SELECT * FROM certificates
      WHERE id = ?
    `;

    pool.query(
      sql,
      [req.params.id],
      (err, results) => {

        if (err) {
          return res.status(500).json({
            success: false,
            error: err,
          });
        }

        if (results.length === 0) {
          return res.status(404).json({
            success: false,
            message:
              "Certificate not found",
          });
        }

        res.status(200).json({
          success: true,
          certificate: results[0],
        });
      }
    );
  };


// ========================================
// UPDATE CERTIFICATE
// ========================================

// export const updateCertificate =
//   (req, res) => {

//     const {
//       student,
//       std,
//       teacher,
//       course,
//       type,
//       grade,
//       status,
//       message,
//     } = req.body;

//     const sql = `
//       UPDATE certificates
//       SET
//         student = ?,
//         std = ?,
//         teacher = ?,
//         course = ?,
//         type = ?,
//         grade = ?,
//         status = ?,
//         message = ?
//       WHERE id = ?
//     `;

//     pool.query(
//       sql,
//       [
//         student,
//         std,
//         teacher,
//         course,
//         type,
//         grade,
//         status,
//         message,
//         req.params.id,
//       ],
//       (err) => {

//         if (err) {
//           return res.status(500).json({
//             success: false,
//             error: err,
//           });
//         }

//         res.status(200).json({
//           success: true,
//           message:
//             "Certificate updated",
//         });
//       }
//     );
//   };



export const updateCertificate =
  async (req, res) => {
    try {
      const {
        student,
        std,
        teacher,
        course,
        type,
        grade,
        status,
        message,
      } = req.body;

      await pool.query(
        `
        UPDATE certificates
        SET
          student = ?,
          std = ?,
          teacher = ?,
          course = ?,
          type = ?,
          grade = ?,
          status = ?,
          message = ?
        WHERE id = ?
        `,
        [student, std, teacher, course, type, grade, status, message, req.params.id]
      );

      res.status(200).json({
        success: true,
        message: "Certificate updated",
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: err.message,
      });
    }
  };


// ========================================
// DELETE CERTIFICATE
// ========================================

// export const deleteCertificate =
//   (req, res) => {

//     const sql = `
//       DELETE FROM certificates
//       WHERE id = ?
//     `;

//     pool.query(
//       sql,
//       [req.params.id],
//       (err) => {

//         if (err) {
//           return res.status(500).json({
//             success: false,
//             error: err,
//           });
//         }

//         res.status(200).json({
//           success: true,
//           message:
//             "Certificate deleted",
//         });
//       }
//     );
//   };



export const deleteCertificate =
  async (req, res) => {
    try {
      await pool.query(
        `DELETE FROM certificates WHERE id = ?`,
        [req.params.id]
      );

      res.status(200).json({
        success: true,
        message: "Certificate deleted",
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: err.message,
      });
    }
  };

  export const getCertificatesByStudent = async (req, res) => {
    try {
  
      const studentId = Number(
        req.params.studentId
      );
      console.log({studentId});
      
  
      // Validate studentId
      if (!studentId) {
        return res.status(400).json({
          success: false,
          message: "Invalid student id",
        });
      }
  
      console.time("certificate_query");
  
      const [rows] = await pool.query(
        `
        SELECT *
        FROM certificates
        WHERE studentId = ?
        ORDER BY id DESC
        `,
        [studentId]
      );
  
      console.timeEnd("certificate_query");
  
      return res.status(200).json({
        success: true,
        certificates: rows,
      });
  
    } catch (err) {
  
      console.log(err);
  
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  };