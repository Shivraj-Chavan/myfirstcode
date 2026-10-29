import express from "express";

import {
  getTeachers,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  approveTeacher,
} from "../controllers/teacherController.js";

const router = express.Router();


// ================= CREATE =================

// PUBLIC REQUEST

router.post(
  "/request",
  createTeacher
);


// ================= GET =================

router.get(
  "/",
  getTeachers
);


// ================= UPDATE =================

router.put(
  "/:id",
  updateTeacher
);


// ================= DELETE =================

router.delete(
  "/:id",
  deleteTeacher
);


// ================= APPROVE =================

router.put(
  "/approve/:id",
  approveTeacher
);

export default router;