import express from "express";



import {

  createAssignment,
  getAssignments,
  updateAssignment,
  deleteAssignment,
  getAssignmentAttempts

} from "../controllers/assignmentController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();


// CREATE

router.post(
  "/",
  verifyToken,
  authorizeRoles(
    "teacher",
    "admin"
  ),
  createAssignment
);


router.get(

  "/:id/attempts",

  authorizeRoles,

  getAssignmentAttempts
);


// GET

router.get(
  "/",
  verifyToken,
  getAssignments
);


// UPDATE

router.put(
  "/:id",
  verifyToken,
  authorizeRoles(
    "teacher",
    "admin"
  ),
  updateAssignment
);


// DELETE

router.delete(
  "/:id",
  verifyToken,
  authorizeRoles(
    "teacher",
    "admin"
  ),
  deleteAssignment
);

export default router;