import pool from "../config/db.js";

const safeParse = (value, fallback = []) => {
  try {
    if (!value) return fallback;

    // Already parsed object/array
    if (typeof value !== "string") return value;

    return JSON.parse(value);
  } catch (err) {
    console.error("JSON Parse Error:", err);
    return fallback;
  }
};


// CREATE LEVEL
// export const createLevel = async (req, res) => {
//   try {
//     const {
//       levelNumber,
//       levelName,
//       objective,
//       description,
//       duration,
//       durationUnit,
//       price,
//       currency,
//       language,
//       difficulty,
//       modules,
//       images,
//       videos,
//       thumbnail,
//       prerequisites,
//       maxStudents,
//       isFeatured,
//       isPublished,
//       certificate,
//       tags,
//     } = req.body;
//     console.log(req.body);

//     const [result] = await pool.query(
//       `
//       INSERT INTO levels (
//         level_number,
//         level_name,
//         objective,
//         description,
//         duration,
//         duration_unit,
//         price,
//         currency,
//         language,
//         difficulty,
//         modules,
//         images,
//         videos,
//         thumbnail,
//         prerequisites,
//         max_students,
//         is_featured,
//         is_published,
//         certificate,
//         tags
//       )
//       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
//       `,
//       [
//         levelNumber,
//         levelName,
//         objective,
//         description,
//         duration,
//         durationUnit,
//         price,
//         currency,
//         language,
//         difficulty,
//         JSON.stringify(modules || []),
//         JSON.stringify(images || []),
//         JSON.stringify(videos || []),
//         thumbnail || "",
//         prerequisites,
//         maxStudents,
//         isFeatured ? 1 : 0,
//         isPublished ? 1 : 0,
//         certificate ? 1 : 0,
//         JSON.stringify(tags || []),
//       ]
//     );

//     res.status(201).json({
//       success: true,
//       message: "Level created successfully",
//       levelId: result.insertId,
//     });
//   } catch (error) {
//     console.log(error);

//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };


export const createLevel = async (req, res) => {
  try {
    const {
      levelNumber,
      levelName,
      objective,
      description,
      duration,
      durationUnit,
      price,
      currency,
      language,
      difficulty,
      modules,
      images,
      videos,
      thumbnail,
      prerequisites,
      maxStudents,
      isFeatured,
      isPublished,
      certificate,
      tags,
    } = req.body;

    const [result] = await pool.execute(
      `
      INSERT INTO levels (
        level_number,
        level_name,
        objective,
        description,
        duration,
        duration_unit,
        price,
        currency,
        language,
        difficulty,
        modules,
        images,
        videos,
        thumbnail,
        prerequisites,
        max_students,
        is_featured,
        is_published,
        certificate,
        tags
      )
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
      `,
      [
        levelNumber || "",
        levelName || "",
        objective || "",
        description || "",
        duration || 0,
        durationUnit || "",
        price || 0,
        currency || "INR",
        language || "English",
        difficulty || "Beginner",

        JSON.stringify(modules || []),
        JSON.stringify(images || []),
        JSON.stringify(videos || []),

        JSON.stringify(thumbnail || []),

        prerequisites || "",
        maxStudents || 0,

        isFeatured ? 1 : 0,
        isPublished ? 1 : 0,
        certificate ? 1 : 0,

        JSON.stringify(tags || []),
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Level created successfully",
      levelId: result.insertId,
    });
  } catch (error) {
    console.error("CREATE LEVEL ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getLevels = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT *
      FROM levels
      ORDER BY level_number ASC
    `);

    const levels = rows.map((item) => ({
      ...item,
      modules: safeParse(item.modules),
      images: safeParse(item.images),
      videos: safeParse(item.videos),
      tags: safeParse(item.tags),
      thumbnail: safeParse(item.thumbnail),
    }));

    res.status(200).json({
      success: true,
      data: levels,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getLevelById = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM levels WHERE id = ?",
      [req.params.id]
    );

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: "Level not found",
      });
    }

    const level = {
      ...rows[0],
      modules: safeParse(rows[0].modules),
      images: safeParse(rows[0].images),
      videos: safeParse(rows[0].videos),
      tags: safeParse(rows[0].tags),
      thumbnail: safeParse(rows[0].thumbnail),
    };

    res.status(200).json({
      success: true,
      data: level,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const updateLevel = async (req, res) => {
  try {
    const id = req.params.id;

    const {
      levelNumber,
      levelName,
      objective,
      description,
      duration,
      durationUnit,
      price,
      currency,
      language,
      difficulty,
      modules,
      images,
      videos,
      thumbnail,
      prerequisites,
      maxStudents,
      isFeatured,
      isPublished,
      certificate,
      tags,
    } = req.body;

    await pool.query(
      `
      UPDATE levels
      SET
        level_number=?,
        level_name=?,
        objective=?,
        description=?,
        duration=?,
        duration_unit=?,
        price=?,
        currency=?,
        language=?,
        difficulty=?,
        modules=?,
        images=?,
        videos=?,
        thumbnail=?,
        prerequisites=?,
        max_students=?,
        is_featured=?,
        is_published=?,
        certificate=?,
        tags=?
      WHERE id=?
      `,
      [
        levelNumber,
        levelName,
        objective,
        description,
        duration,
        durationUnit,
        price,
        currency,
        language,
        difficulty,
        JSON.stringify(modules || []),
        JSON.stringify(images || []),
        JSON.stringify(videos || []),
        JSON.stringify(thumbnail || []),
        prerequisites,
        maxStudents,
        isFeatured ? 1 : 0,
        isPublished ? 1 : 0,
        certificate ? 1 : 0,
        JSON.stringify(tags || []),
        id,
      ]
    );

    res.status(200).json({
      success: true,
      message: "Level updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteLevel = async (req, res) => {
  try {
    await pool.query(
      "DELETE FROM levels WHERE id = ?",
      [req.params.id]
    );

    res.status(200).json({
      success: true,
      message: "Level deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const getLevelsByStandard = async (req, res) => {
  try {
    const { standard } = req.params;
    console.log("Standard:", standard);
    
    const sql = `
      SELECT DISTINCT l.*
      FROM levels l
      INNER JOIN students s
        ON s.standard = ?
      INNER JOIN student_levels sl
        ON sl.student_id = s.id
      WHERE sl.level_id = l.id
      ORDER BY l.level_number ASC
    `;

    const [levels] = await pool.query(sql, [standard]);

    res.status(200).json({
      success: true,
      data: levels,
    });

  } catch (error) {

    console.log(
      "GET LEVELS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMyLevels = async (req, res) => {
  const { studentId } = req.params;

  const [rows] = await pool.query(
    `
    SELECT l.*, sl.assigned_at
    FROM student_levels sl
    JOIN levels l
      ON l.id = sl.level_id
    WHERE sl.student_id = ?
    ORDER BY l.level_number
    `,
    [studentId]
  );

  res.json({
    success: true,
    levels: rows,
  });
};