import express from "express";

import {
  getStudentDashboard,
} from "../controllers/studentDashboardController.js";

const router = express.Router();

router.get("/student", getStudentDashboard);

export default router;