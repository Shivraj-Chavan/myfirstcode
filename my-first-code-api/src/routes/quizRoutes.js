import express from "express";

import {

  createQuiz,

  getAllQuizzes,

  getSingleQuiz,

  updateQuiz,

  deleteQuiz,

  submitQuiz,

  getQuizResults,

} from "../controllers/quizController.js";

import {
  verifyToken,
} from "../middleware/authMiddleware.js";

const router =
  express.Router();


// =======================================
// TEACHER / ADMIN ROUTES
// =======================================

// CREATE QUIZ

router.post(
  "/",
  verifyToken,
  createQuiz
);

// GET ALL QUIZZES

router.get(
  "/",
  verifyToken,
  getAllQuizzes
);

// GET SINGLE QUIZ

router.get(
  "/:id",
  verifyToken,
  getSingleQuiz
);

// UPDATE QUIZ

router.put(
  "/:id",
  verifyToken,
  updateQuiz
);

// DELETE QUIZ

router.delete(
  "/:id",
  verifyToken,
  deleteQuiz
);


// =======================================
// STUDENT ROUTES
// =======================================

// SUBMIT QUIZ

router.post(
  "/submit/:id",
  verifyToken,
  submitQuiz
);

// GET QUIZ RESULTS


router.get(
  "/quiz-results/:id",
  verifyToken,
  getQuizResults
);

export default router;