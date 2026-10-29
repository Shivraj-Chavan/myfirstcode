import express from "express";

import {
  getStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
  assignStudentTeacher,
  getStudentFullProgress,
  getTeacherStudents,
  assignLevels,
  getStudentLevels,
  removeStudentLevel,
  assignLevelsToStudent,
} from "../controllers/studentController.js";

import {
  verifyToken,
} from "../middleware/authMiddleware.js";

const router = express.Router();


// ================= GET =================

// ALL STUDENTS

router.get(
  "/",
  getStudents
);

// TEACHER STUDENTS

router.get(
  "/teacher",
  verifyToken,
  getTeacherStudents
);

// STUDENT PROGRESS

router.get(
  "/progress/:id",
  getStudentFullProgress
);

// SINGLE STUDENT

router.get(
  "/:id",
  getStudent
);


// ================= CREATE =================

router.post(
  "/create",
  createStudent
);


// ================= UPDATE =================

router.put(
  "/update/:id",
  // verifyToken,
  updateStudent
);


// ================= DELETE =================

router.delete(
  "/delete/:id",
  deleteStudent
);


// ================= ASSIGN =================

router.put(
  "/assign/:id",
  assignStudentTeacher
);

router.post(
  "/assign-levels",
  assignLevelsToStudent
);

router.get(
  "/:studentId",
  getStudentLevels
);

router.delete(
  "/:studentId/:levelId",
  removeStudentLevel
);

export default router;