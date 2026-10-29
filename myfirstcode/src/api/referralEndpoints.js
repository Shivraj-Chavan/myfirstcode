const BASE = import.meta.env.VITE_API_URL || "/api";

export const REFERRAL_ENDPOINTS = {
 
 
 // ---------------- REFFERAL ----------------
  register: "/referral-auth/register",
  login: "/referral-auth/login",

  // Admin
  partners: "/referral-auth", // GET (?status=PENDING|APPROVED|REJECTED)
  partner: (id) => `/referral-auth/${id}`, // GET
  approvePartner: (id) => `/referral-auth/${id}/approve`, // PUT
  rejectPartner: (id) => `/referral-auth/${id}/reject`, // PUT

  // Referral partner
addStudent: "/referral-students", // POST
  myStudents: "/referral-students/mine", // GET
  dashboardStats: "/referral-students/dashboard-stats", // GET
  student: (id) => `/referral-students/${id}`, // GET one / PUT / DELETE (only while LEAD_ADDED/PENDING_REVIEW)

  // Admin
  allReferralStudents: "/referral-students/all", // GET
  updateLeadStatus: (id) => `/referral-students/${id}/status`, // PUT { status, paymentStatus }
}

export default BASE;