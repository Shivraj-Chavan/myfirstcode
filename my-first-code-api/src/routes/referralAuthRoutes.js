import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import {
  registerReferral,
  loginReferral,
  getReferralPartners,
  getReferralPartnerById,
  approveReferralPartner,
  rejectReferralPartner,
} from "../controllers/referralAuthController.js";

const router = express.Router();

// PUBLIC
router.post("/register", registerReferral);
router.post("/login", loginReferral);

// ADMIN ONLY
router.get("/", verifyToken, authorizeRoles("admin"), getReferralPartners);
router.get("/:id", verifyToken, authorizeRoles("admin"), getReferralPartnerById);
router.put("/:id/approve", verifyToken, authorizeRoles("admin"), approveReferralPartner);
router.put("/:id/reject", verifyToken, authorizeRoles("admin"), rejectReferralPartner);

export default router;