import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { getStudentEnquiries, getTeacherEnquiries, replyEnquiry, sendEnquiry, getAllEnquiries } from "../controllers/enquiryController.js";;


const router =
  express.Router();

// ============================
// STUDENT SEND
// ============================

router.post(
  "/send",
  verifyToken,
  sendEnquiry
);

// ============================
// STUDENT GET OWN
// ============================

router.get(
  "/student",
  verifyToken,
  getStudentEnquiries
);

// ============================
// TEACHER GET
// ============================

router.get(
  "/teacher",
  verifyToken,
  getTeacherEnquiries
);

// ============================
// TEACHER REPLY
// ============================

router.put(
  "/reply/:id",
  verifyToken,
  replyEnquiry
);

// ============================
// ADMIN: GET ALL
// ============================

router.get(
  "/all",
  verifyToken,
  authorizeRoles("admin"),
  getAllEnquiries
);

export default router;