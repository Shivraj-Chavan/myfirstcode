import express from "express";

import {
  getCourses,
  getSingleCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  getCoursesByStandard,
  getTeacherCourses,
  getCourseDetail,
} from "../controllers/courseController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();


// GET ALL COURSES

router.get(
  "/",
  getCourses
);


// GET SINGLE COURSE

router.get(
  "/:id",
  getSingleCourse
);


// CREATE COURSE

router.post(
  "/create",
  createCourse
);


// UPDATE COURSE

router.put(
  "/update/:id",
  updateCourse
);

router.get(
  "/:id",
  getCourseDetail
);


// DELETE COURSE

router.delete(
  "/delete/:id",
  deleteCourse
);

router.get(
  "/standard/:standard",
  getCoursesByStandard
);

router.get(
  "/teacher/:teacher_id",
  verifyToken,
  getTeacherCourses
);

export default router;