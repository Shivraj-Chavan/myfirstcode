import express from "express";
import authRoutes from "./authRoutes.js";
import courseRoutes from '../routes/courseRoutes.js'
import studentRoutes from "./studentRoutes.js";
import calenderRoutes from "./calenderRoutes.js";
import teacherRoutes from "./teacherRoutes.js";
import dashboardRoutes from "./dashboardRoutes.js";
import quizRoutes from "./quizRoutes.js";
import assignmentRoutes from "./assignmentsRoutes.js";
import codeRoutes from './codeRoutes.js';
import adminDashboardRoutes from "./adminDashboardRoutes.js";
import teacherDashboardRoutes from "./teacherDashboardRoutes.js";
import studentDashboardRoutes from "./studentDashboardRoutes.js";
import enquiryRoutes from "./enquiryRoutes.js";
import certificateRoutes from "./certificateRoutes.js";
import levelRoutes from "./levelRoutes.js";
import studentProfileRoutes from "./studentProfileRoutes.js";
import compilerRoutes from "./compilerRoutes.js";
import leaderboardRoutes from "./leaderboardRoutes.js";
import referralAuthRoutes from "./referralAuthRoutes.js";
import referralStudentRoutes from "./referralStudentRoutes.js"

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/courses",courseRoutes);
router.use("/students",studentRoutes)
router.use("/calendar",calenderRoutes)
router.use("/teacher",teacherRoutes)
router.use("/dashboard", dashboardRoutes);
router.use("/quizzes", quizRoutes);
router.use("/assignments", assignmentRoutes);
router.use("/runcode", codeRoutes);
router.use("/adminDashboard", adminDashboardRoutes);
router.use("/teacherDashboard", teacherDashboardRoutes);
router.use("/studentDashboard", studentDashboardRoutes);
router.use("/enquiry",enquiryRoutes);
router.use("/certificates",certificateRoutes);
router.use("/levels",levelRoutes);
router.use("/studentProfiles",studentProfileRoutes);
router.use("/compiler",compilerRoutes);
router.use("/leaderboard",leaderboardRoutes);
router.use("/referral-auth", referralAuthRoutes);
router.use("/referral-students", referralStudentRoutes);


export default router;