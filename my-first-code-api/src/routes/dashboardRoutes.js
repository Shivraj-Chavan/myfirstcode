import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { checkTeacherApproved } from "../middleware/teacherApprovalMiddleware.js";

const router = express.Router();

// Admin only
router.get(
  "/admin/dashboard",
  verifyToken,
  authorizeRoles("admin"),
  (req, res) => {
    res.json({ message: "Welcome Admin" });
  }
);

// Teacher only (approved)
router.get(
  "/teacher/dashboard",
  verifyToken,
  authorizeRoles("teacher"),
  checkTeacherApproved,
  (req, res) => {
    res.json({ message: "Welcome Teacher" });
  }
);

// Student only
router.get(
  "/student/dashboard",
  verifyToken,
  authorizeRoles("student"),
  (req, res) => {
    res.json({ message: "Welcome Student" });
  }
);

export default router;