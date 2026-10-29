import express from "express";
import { getStudentProfile, saveStudentProfile } from "../controllers/studentProfile.js";


const router = express.Router();

router.get(
  "/:id",
  getStudentProfile
);

router.put(
  "/:id",
  saveStudentProfile
);

export default router;