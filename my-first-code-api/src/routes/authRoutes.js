import express from "express";

// google login
// import { approveTeacher, createTeacher, deleteTeacher, getTeachers, googleLogin, register, verifyOtp } from "../controllers/authController.js";


// otp login
import { approveTeacher, createTeacher, deleteTeacher, getTeachers, googleLogin, login, register, verifyOtp } from "../controllers/authController.js";
const router = express.Router();

// ================= AUTH =================

router.post("/register", register);

router.post("/verify-otp", verifyOtp);

router.post("/login", login); // OTP login — disabled
// router.post("/google-login", googleLogin);

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