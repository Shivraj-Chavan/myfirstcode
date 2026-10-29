import express from "express";

import {
  issueCertificate,
  getCertificates,
  getStudentCertificates,
  getSingleCertificate,
  updateCertificate,
  deleteCertificate,
  getCertificatesByStudent,
} from "../controllers/certificateController.js";

const router = express.Router();


// ISSUE
router.post(
  "/issue",
  issueCertificate
);


// GET ALL
router.get(
  "/",
  getCertificates
);


// GET STUDENT CERTIFICATES
router.get(
  "/student/:studentId",
  getStudentCertificates
);


// GET SINGLE
router.get(
  "/single/:id",
  getSingleCertificate
);


// UPDATE
router.put(
  "/:id",
  updateCertificate
);


// DELETE
router.delete(
  "/:id",
  deleteCertificate
);

router.get(
  "/:studentId",
  getCertificatesByStudent
);

export default router;