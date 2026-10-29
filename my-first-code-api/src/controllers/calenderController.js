// import pool from "../config/db.js";

// // =========================
// // CONSTANTS
// // =========================

// const ALLOWED_TYPES = [
//   "LIVE_CLASS",
//   "RECORDED_SESSION",
//   "ASSIGNMENT",
//   "QUIZ",
//   "EXAM",
//   "PARENT_MEETING",
//   "NOTICE",
// ];

// const normalizeStatus = (status) => {
//   const allowed = [
//     "SCHEDULED",
//     "COMPLETED",
//     "CANCELLED",
//   ];

//   return allowed.includes(status)
//     ? status
//     : "SCHEDULED";
// };

// // =========================
// // CREATE EVENT
// // =========================

// export const createEvent = async (req, res) => {
//   try {

//     const {
//       title,
//       description,
//       event_type,
//       standard,
//       start_datetime,
//       end_datetime,
//       meeting_link,
//       recording_url,
//       visibility,
//       status,
//     } = req.body;

//     if (
//       !title ||
//       !event_type ||
//       !start_datetime ||
//       !end_datetime
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "Missing required fields",
//       });
//     }
// console.log("===============")
//     if (!ALLOWED_TYPES.includes(event_type)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid event type",
//       });
//     }
// console.log("---------------")
//     const finalStatus = normalizeStatus(status);
// console.log( [
//   title,
//   description || null,
//   req.user.id,
//   event_type,
//   standard,
//   start_datetime,
//   end_datetime,
//   meeting_link || null,
//   recording_url || null,
//   visibility || "ALL",
//  "SCHEDULED",
// ])
//     const [result] = await pool.query(
//       `
//       INSERT INTO calendar_events
//       (
//         title,
//         description,
//         teacher_id,
//         event_type,
//         standard,
//         start_datetime,
//         end_datetime,
//         meeting_link,
//         recording_url,
//         visibility,
//         status
//       )
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//       `,
//       [
//         title,
//         description || null,
//         req.user.id,
//         event_type,
//         standard,
//         start_datetime,
//         end_datetime,
//         meeting_link || null,
//         recording_url || null,
//         visibility || "ALL",
//        "SCHEDULED",
//       ]
//     );

//     return res.status(201).json({
//       success: true,
//       message: "Event created successfully",
//       id: result.insertId,
//     });

//   } catch (err) {

//     console.log(err);

//     return res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };

// // =========================
// // GET EVENTS
// // =========================

// export const getEvents = async (req, res) => {
//   try {

//     const [rows] = await pool.query(
//       `
//       SELECT *
//       FROM calendar_events
//       WHERE teacher_id = ?
//       ORDER BY start_time ASC
//       `,
//       [req.user.id]
//     );

//     return res.status(200).json({
//       success: true,
//       data: rows,
//     });

//   } catch (err) {

//     console.log(err);

//     return res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };

// // =========================
// // UPDATE EVENT
// // =========================

// export const updateEvent = async (req, res) => {
//   try {

//     const { id } = req.params;

//     const {
//       title,
//       start_datetime,
//       end_datetime,
//       meeting_link,
//       recording_url,
//       visibility,
//       status,
//     } = req.body;

//     const finalStatus = normalizeStatus(status);

//     await pool.query(
//       `
//       UPDATE calendar_events
//       SET
//         title = ?,
//         start_time = ?,
//         end_time = ?,
//         meeting_link = ?,
//         recording_url = ?,
//         visibility = ?,
//         status = ?
//       WHERE id = ?
//       `,
//       [
//         title,
//         start_datetime,
//         end_datetime,
//         meeting_link || null,
//         recording_url || null,
//         visibility || "ALL",
//         finalStatus,
//         id,
//       ]
//     );

//     return res.status(200).json({
//       success: true,
//       message: "Updated successfully",
//     });

//   } catch (err) {

//     console.log(err);

//     return res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };

// // =========================
// // DELETE EVENT
// // =========================

// export const deleteEvent = async (req, res) => {
//   try {

//     await pool.query(
//       `DELETE FROM calendar_events WHERE id = ?`,
//       [req.params.id]
//     );

//     return res.status(200).json({
//       success: true,
//       message: "Deleted successfully",
//     });

//   } catch (err) {

//     console.log(err);

//     return res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };


// export const getEventsByStandard = async (req, res) => {
//   try {

//     const { standard } = req.params;
//     console.log("Standard Param:", standard);

//     const [rows] = await pool.query(
//       `
//       SELECT *
//       FROM calendar_events
//       WHERE standard = ?
//       ORDER BY start_datetime ASC
//       `,
//       [standard]
//     );
//     console.log("Rows Found:", rows.length);

//     return res.status(200).json({
//       success: true,
//       data: rows,
//     });

//   } catch (err) {

//     console.log(err);

//     return res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };



// export const getAllEventsAdmin = async (req, res) => {
//   try {

//     const [rows] = await pool.query(`
//       SELECT *
//       FROM calendar_events
//       ORDER BY start_datetime ASC
//     `);

//     return res.status(200).json({
//       success: true,
//       data: rows,
//     });

//   } catch (err) {

//     console.log(err);

//     return res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };













import pool from "../config/db.js";

const ALLOWED_TYPES = [
  "LIVE_CLASS",
  "RECORDED_SESSION",
  "ASSIGNMENT",
  "QUIZ",
  "EXAM",
  "PARENT_MEETING",
  "NOTICE",
];

const normalizeStatus = (status) => {
  const allowed = ["SCHEDULED", "COMPLETED", "CANCELLED"];
  return allowed.includes(status) ? status : "SCHEDULED";
};

// =======================
// CREATE EVENT
// =======================

export const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      event_type,
      standard,
      start_datetime,
      end_datetime,
      meeting_link,
      recording_url,
      visibility,
      status,
    } = req.body;

    if (!title || !event_type || !start_datetime || !end_datetime) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    if (!ALLOWED_TYPES.includes(event_type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid event type",
      });
    }

    const [result] = await pool.query(
      `
      INSERT INTO calendar_events
      (
        title,
        description,
        teacher_id,
        event_type,
        standard,
        start_datetime,
        end_datetime,
        meeting_link,
        recording_url,
        visibility,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        title,
        description || null,
        req.user.id,
        event_type,
        standard || null,
        start_datetime,
        end_datetime,
        meeting_link || null,
        recording_url || null,
        visibility || "ALL",
        normalizeStatus(status),
      ]
    );

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      id: result.insertId,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =======================
// GET TEACHER EVENTS
// =======================

export const getEvents = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT *
      FROM calendar_events
      WHERE teacher_id = ?
      ORDER BY start_datetime ASC
      `,
      [req.user.id]
    );

    res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =======================
// UPDATE EVENT
// =======================

export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      description,
      event_type,
      standard,
      start_datetime,
      end_datetime,
      meeting_link,
      recording_url,
      visibility,
      status,
    } = req.body;

    await pool.query(
      `
      UPDATE calendar_events
      SET
        title=?,
        description=?,
        event_type=?,
        standard=?,
        start_datetime=?,
        end_datetime=?,
        meeting_link=?,
        recording_url=?,
        visibility=?,
        status=?
      WHERE id=?
      `,
      [
        title,
        description,
        event_type,
        standard,
        start_datetime,
        end_datetime,
        meeting_link || null,
        recording_url || null,
        visibility || "ALL",
        normalizeStatus(status),
        id,
      ]
    );

    res.status(200).json({
      success: true,
      message: "Event updated successfully",
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =======================
// DELETE EVENT
// =======================

export const deleteEvent = async (req, res) => {
  try {
    await pool.query(
      "DELETE FROM calendar_events WHERE id=?",
      [req.params.id]
    );

    res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =======================
// STUDENT EVENTS
// =======================

export const getEventsByStandard = async (req, res) => {
  try {
    const { standard } = req.params;

    const [rows] = await pool.query(
      `
      SELECT *
      FROM calendar_events
      WHERE standard = ?
      ORDER BY start_datetime ASC
      `,
      [standard]
    );

    res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =======================
// ADMIN EVENTS
// =======================

export const getAllEventsAdmin = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT *
      FROM calendar_events
      ORDER BY start_datetime ASC
      `
    );

    res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};