import express from "express";


import  { verifyToken } from "../middleware/authMiddleware.js";
import { runCode } from "../controllers/codeExecutionController.js";

const router =
  express.Router();

router.post(
  "/run",
  verifyToken,
  runCode
);

export default router;