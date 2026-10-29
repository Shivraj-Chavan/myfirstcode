import express from "express";

import {
  getTeacherDashboard,
} from "../controllers/teacherDashboardController.js";

const router = express.Router();

router.get("/", getTeacherDashboard);

export default router;