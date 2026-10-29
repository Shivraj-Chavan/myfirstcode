import express from "express";
import {
  createLevel,
  getLevels,
  getLevelById,
  updateLevel,
  deleteLevel,
  getMyLevels,
  getLevelsByStandard,
} from "../controllers/levelController.js";

const router = express.Router();

router.post("/", createLevel);

router.get("/", getLevels);

router.get("/student/:studentId", getMyLevels);

router.get("/standard/:standard", getLevelsByStandard);

router.get("/:id", getLevelById);

router.put("/:id", updateLevel);

router.delete("/:id", deleteLevel);

export default router;