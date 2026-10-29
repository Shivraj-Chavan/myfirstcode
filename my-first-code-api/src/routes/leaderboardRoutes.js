import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { getLeaderboard, getLeaderboardByStandard, getStudentGrowth } from "../controllers/leaderboardController.js";

const router = express.Router();

router.get("/", verifyToken, getLeaderboard);
router.get("/standard/:standard", verifyToken, getLeaderboardByStandard);
router.get("/growth/:studentId", verifyToken, getStudentGrowth);

export default router;