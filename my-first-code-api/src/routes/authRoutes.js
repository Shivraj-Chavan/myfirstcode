import express from "express";
import { approveTeacher, createTeacher, deleteTeacher, getTeachers, login, register, verifyOtp } from "../controllers/authController.js";

const router = express.Router();

// ================= AUTH =================

router.post("/register", register);

router.post("/verify-otp", verifyOtp);

router.post("/login", login);

// ================= TEACHERS =================

router.post(
  "/teachers",
  createTeacher
);

router.get("/teachers", getTeachers);

router.put(
  "/approve-teacher/:id",
  approveTeacher
);

router.delete(
  "/delete-teacher/:id",
  deleteTeacher
);

export default router;