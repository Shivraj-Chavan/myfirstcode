import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import {
  createReferralStudent,
  getMyReferralStudents,
  getReferralDashboardStats,
  getAllReferralStudents,
  getReferralStudentById,
  updateReferralStudent,
  deleteReferralStudent,
  updateReferralLeadStatus,
} from "../controllers/referralStudentController.js";

const router = express.Router();

// REFERRAL PARTNER
router.post("/", verifyToken, authorizeRoles("referral"), createReferralStudent);
router.get("/mine", verifyToken, authorizeRoles("referral"), getMyReferralStudents);
router.get("/dashboard-stats", verifyToken, authorizeRoles("referral"), getReferralDashboardStats);
// ADMIN
router.get("/all", verifyToken, authorizeRoles("admin"), getAllReferralStudents);
router.get("/:id", verifyToken, authorizeRoles("referral"), getReferralStudentById);
router.put("/:id", verifyToken, authorizeRoles("referral"), updateReferralStudent);
router.delete("/:id", verifyToken, authorizeRoles("referral"), deleteReferralStudent);
router.put("/:id/status", verifyToken, authorizeRoles("admin"), updateReferralLeadStatus);


export default router;