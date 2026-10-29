import pool from "../config/db.js";

// ================= REFERRAL: ADD STUDENT LEAD =================
export const createReferralStudent = async (req, res) => {
  try {
    const referralPartnerId = req.user.id;
    const {
      studentName, age, gender, standard, schoolName, board, percentage,
      interestedCourse, preferredBatch, expectedJoiningMonth,
      studentMobile, parentMobile, studentEmail, parentEmail,
      address, city, state, pincode,
      parentName, relationship, occupation,
      referredHow, remarks,
    } = req.body;

    if (!studentName || !age || !standard || !schoolName || !interestedCourse || !studentMobile || !parentMobile) {
      return res.status(400).json({ success: false, message: "Please fill all required fields" });
    }

    // DB's `gender` column is an ENUM('MALE','FEMALE','OTHER') — normalize
    // whatever the form sends to match, or NULL if it doesn't fit.
    const genderValue = ["MALE", "FEMALE", "OTHER"].includes((gender || "").toUpperCase())
      ? gender.toUpperCase()
      : null;

    const [result] = await pool.query(
      `
      INSERT INTO referral_leads (
        referral_partner_id, student_name, age, gender, standard, school_name, board, percentage,
        interested_course, preferred_batch, expected_joining_month,
        student_mobile, parent_mobile, student_email, parent_email,
        address, city, state, pincode,
        parent_name, relationship, occupation,
        referred_how, remarks, status, payment_status
      )
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?, 'LEAD_ADDED', 'PENDING')
      `,
      [
        referralPartnerId, studentName, age, genderValue, standard, schoolName, board || "", percentage || "",
        interestedCourse, preferredBatch || "", expectedJoiningMonth || "",
        studentMobile, parentMobile, studentEmail || "", parentEmail || "",
        address || "", city || "", state || "", pincode || "",
        parentName || "", relationship || "", occupation || "",
        referredHow || "", remarks || "",
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Student lead added successfully",
      studentId: result.insertId,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ================= REFERRAL: MY STUDENTS =================
export const getMyReferralStudents = async (req, res) => {
  try {
    const referralPartnerId = req.user.id;
    const [rows] = await pool.query(
      "SELECT * FROM referral_leads WHERE referral_partner_id = ? ORDER BY created_at DESC",
      [referralPartnerId]
    );
    return res.status(200).json({ success: true, data: rows });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ================= REFERRAL: DASHBOARD STATS =================
export const getReferralDashboardStats = async (req, res) => {
  try {
    const referralPartnerId = req.user.id;

    const [[total]] = await pool.query("SELECT COUNT(*) AS c FROM referral_leads WHERE referral_partner_id=?", [referralPartnerId]);
    const [[pending]] = await pool.query("SELECT COUNT(*) AS c FROM referral_leads WHERE referral_partner_id=? AND status='LEAD_ADDED'", [referralPartnerId]);
    const [[enrolled]] = await pool.query("SELECT COUNT(*) AS c FROM referral_leads WHERE referral_partner_id=? AND status='ENROLLED'", [referralPartnerId]);
    const [[rejected]] = await pool.query("SELECT COUNT(*) AS c FROM referral_leads WHERE referral_partner_id=? AND status='REJECTED'", [referralPartnerId]);
    const [[paymentPending]] = await pool.query("SELECT COUNT(*) AS c FROM referral_leads WHERE referral_partner_id=? AND payment_status='PENDING'", [referralPartnerId]);
    const [[paymentVerified]] = await pool.query("SELECT COUNT(*) AS c FROM referral_leads WHERE referral_partner_id=? AND payment_status='VERIFIED'", [referralPartnerId]);

    return res.status(200).json({
      success: true,
      stats: {
        totalStudents: total.c,
        pendingLeads: pending.c,
        enrolled: enrolled.c,
        rejected: rejected.c,
        paymentPending: paymentPending.c,
        paymentVerified: paymentVerified.c,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


// ================= REFERRAL: GET SINGLE LEAD =================
export const getReferralStudentById = async (req, res) => {
  try {
    const referralPartnerId = req.user.id;
    const [rows] = await pool.query(
      "SELECT * FROM referral_leads WHERE id = ? AND referral_partner_id = ?",
      [req.params.id, referralPartnerId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Lead not found" });
    }
    return res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ================= REFERRAL: UPDATE LEAD (details only, not status) =================
export const updateReferralStudent = async (req, res) => {
  try {
    const referralPartnerId = req.user.id;
    const {
      studentName, age, gender, standard, schoolName, board, percentage,
      interestedCourse, preferredBatch, expectedJoiningMonth,
      studentMobile, parentMobile, studentEmail, parentEmail,
      address, city, state, pincode,
      parentName, relationship, occupation,
      referredHow, remarks,
    } = req.body;

    const genderValue = ["MALE", "FEMALE", "OTHER"].includes((gender || "").toUpperCase())
      ? gender.toUpperCase()
      : null;

    // Referral partners can only edit their own leads, and only while
    // the lead hasn't moved past LEAD_ADDED/PENDING_REVIEW — once
    // admin starts processing it (enquiry/counselling/etc.), the
    // partner's copy is locked to avoid conflicting edits. Adjust this
    // allow-list if you want editing permitted at more stages.
    const [result] = await pool.query(
      `
      UPDATE referral_leads
      SET
        student_name=?, age=?, gender=?, standard=?, school_name=?, board=?, percentage=?,
        interested_course=?, preferred_batch=?, expected_joining_month=?,
        student_mobile=?, parent_mobile=?, student_email=?, parent_email=?,
        address=?, city=?, state=?, pincode=?,
        parent_name=?, relationship=?, occupation=?,
        referred_how=?, remarks=?
      WHERE id=? AND referral_partner_id=? AND status IN ('LEAD_ADDED','PENDING_REVIEW')
      `,
      [
        studentName, age, genderValue, standard, schoolName, board || "", percentage || "",
        interestedCourse, preferredBatch || "", expectedJoiningMonth || "",
        studentMobile, parentMobile, studentEmail || "", parentEmail || "",
        address || "", city || "", state || "", pincode || "",
        parentName || "", relationship || "", occupation || "",
        referredHow || "", remarks || "",
        req.params.id, referralPartnerId,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({
        success: false,
        message: "Lead not found, not yours, or already past editing stage",
      });
    }

    return res.status(200).json({ success: true, message: "Lead updated successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ================= REFERRAL: DELETE LEAD =================
export const deleteReferralStudent = async (req, res) => {
  try {
    const referralPartnerId = req.user.id;

    // Same guard as update — only allow deleting leads still in the
    // earliest stages, so a partner can't remove a lead admin is
    // already actively processing.
    const [result] = await pool.query(
      "DELETE FROM referral_leads WHERE id=? AND referral_partner_id=? AND status IN ('LEAD_ADDED','PENDING_REVIEW')",
      [req.params.id, referralPartnerId]
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({
        success: false,
        message: "Lead not found, not yours, or already past editing stage",
      });
    }

    return res.status(200).json({ success: true, message: "Lead deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};





// ================= ADMIN: UPDATE LEAD STATUS =================
export const updateReferralLeadStatus = async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;

    const VALID_STATUSES = [
      "LEAD_ADDED", "PENDING_REVIEW", "ENQUIRY", "COUNSELLING", "INTERESTED",
      "ADMISSION_APPROVED", "PAYMENT_PENDING", "PAYMENT_SUBMITTED", "PAYMENT_VERIFICATION",
      "ENROLLED", "COMPLETED", "REJECTED", "CANCELLED", "NO_RESPONSE",
    ];
    const VALID_PAYMENT_STATUSES = ["PENDING", "UNDER_VERIFICATION", "VERIFIED", "REJECTED"];

    if (status && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }
    if (paymentStatus && !VALID_PAYMENT_STATUSES.includes(paymentStatus)) {
      return res.status(400).json({ success: false, message: "Invalid payment status value" });
    }
    if (!status && !paymentStatus) {
      return res.status(400).json({ success: false, message: "Provide status and/or paymentStatus" });
    }

    const sets = [];
    const values = [];
    if (status) { sets.push("status = ?"); values.push(status); }
    if (paymentStatus) { sets.push("payment_status = ?"); values.push(paymentStatus); }
    values.push(req.params.id);

    const [result] = await pool.query(
      `UPDATE referral_leads SET ${sets.join(", ")} WHERE id = ?`,
      values
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Lead not found" });
    }

    return res.status(200).json({ success: true, message: "Lead updated successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};



// ================= ADMIN: ALL REFERRAL STUDENTS =================
export const getAllReferralStudents = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        rl.*,
        rp.organization_name AS referralName,
        rp.name AS referralContact
      FROM referral_leads rl
      LEFT JOIN referral_partners rp ON rp.id = rl.referral_partner_id
      ORDER BY rl.created_at DESC
    `);
    return res.status(200).json({ success: true, data: rows });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};