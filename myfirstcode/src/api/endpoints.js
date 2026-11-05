
const BASE = import.meta.env.VITE_API_URL || "/api";

export const ENDPOINTS = {
  // ---------------- AUTH ----------------
  register: "/auth/register",
  verifyOtp: "/auth/verify-otp",
  login: "/auth/login", // OTP login — disabled
  googleLogin: "/auth/google-login",
  teachers: "/auth/teachers", // GET list (admin)
  approveTeacher: (id) => `/auth/approve-teacher/${id}`, // PUT
  deleteTeacher: (id) => `/auth/delete-teacher/${id}`, // DELETE

  // ---------------- COURSES ----------------
  courses: "/courses", // GET all
  course: (id) => `/courses/${id}`, // GET one
  createCourse: "/courses/create", // POST
  updateCourse: (id) => `/courses/update/${id}`, // PUT
  deleteCourse: (id) => `/courses/delete/${id}`, // DELETE
  coursesByStandard: (standard) => `/courses/standard/${standard}`, // GET
  teacherCourses: (teacherId) => `/courses/teacher/${teacherId}`, // GET (auth)

  // ---------------- STUDENTS ----------------
  students: "/students", // GET all
  student: (id) => `/students/${id}`, // GET one
  createStudent: "/students/create", // POST
  updateStudent: (id) => `/students/update/${id}`, // PUT
  deleteStudent: (id) => `/students/delete/${id}`, // DELETE
  assignStudent: (id) => `/students/assign/${id}`, // PUT { teacher_id, batch_name, assigned_by }
  studentProgress: (id) => `/students/progress/${id}`, // GET

// ---------------- CALENDAR (all require auth) ----------------
  events: "/calendar", // GET (teacher's own events only)
  createEvent: "/calendar/create", // POST
  updateEvent: (id) => `/calendar/update/${id}`, // PUT
  deleteEvent: (id) => `/calendar/delete/${id}`, // DELETE
  eventsByStandard: (standard) => `/calendar/events/student/${standard}`, // GET (student)
  adminEvents: "/calendar/admin/events", // GET (admin — all events)

  // ---------------- TEACHER (legacy `teachers` table — see note 4) ----------------
  teacherRequest: "/teacher/request", // POST public
  teacherList: "/teacher", // GET
  teacherUpdate: (id) => `/teacher/${id}`, // PUT
  teacherDelete: (id) => `/teacher/${id}`, // DELETE
  teacherApprove: (id) => `/teacher/approve/${id}`, // PUT

  // ---------------- DASHBOARDS ----------------
  adminDashboard: "/adminDashboard/admin", // GET
  teacherDashboard: "/teacherDashboard", // GET
  studentDashboard: "/studentDashboard/student", // GET

  // ---------------- QUIZZES ----------------
  quizzes: "/quizzes", // GET all / POST create
  quiz: (id) => `/quizzes/${id}`, // GET / PUT / DELETE
  submitQuiz: (id) => `/quizzes/submit/${id}`, // POST
  quizResults: (id) => `/quizzes/quiz-results/${id}`, // GET

  // ---------------- ASSIGNMENTS ----------------
  assignments: "/assignments", // GET all / POST create
  assignment: (id) => `/assignments/${id}`, // PUT / DELETE
  assignmentAttempts: (id) => `/assignments/${id}/attempts`, // GET — see note 3

// ---------------- ENQUIRIES ----------------
  // NOTE: backend mounts this router at "/enquiry" (singular) in index.js
  sendEnquiry: "/enquiry/send", // POST { teacher_id, subject, message }
  studentEnquiries: "/enquiry/student", // GET (student's own)
  teacherEnquiries: "/enquiry/teacher", // GET (teacher's inbox)
  replyEnquiry: (id) => `/enquiry/reply/${id}`, // PUT { reply }
  allEnquiries: "/enquiry/all", // GET (admin — every enquiry across all students/teachers)


    // ---------------- CERTIFICATES ----------------
  issueCertificate: "/certificates/issue", // POST
  certificates: "/certificates", // GET all (?search=&status=)
  studentCertificates: (studentId) => `/certificates/${studentId}`, 
  certificate: (id) => `/certificates/single/${id}`, // GET one
  updateCertificate: (id) => `/certificates/${id}`, // PUT
  deleteCertificate: (id) => `/certificates/${id}`, // DELETE


   // ---------------- LEADERBOARD ----------------
  leaderboard: "/leaderboard", // GET — all students, ranked
  leaderboardByStandard: (standard) => `/leaderboard/standard/${standard}`, // GET — ranked within one standard
  studentGrowth: (studentId) => `/leaderboard/growth/${studentId}`, // GET — chronological quiz history + cumulative score, for charting


    // ---------------- LEVELS ----------------
  levels: "/levels", // GET all / POST create
  level: (id) => `/levels/${id}`, // GET one / PUT / DELETE
  myLevels: (studentId) => `/levels/student/${studentId}`, // GET (student's assigned levels)
  levelsByStandard: (standard) => `/levels/standard/${standard}`, // GET — see note: only returns levels already assigned to *some* student of that standard, not all levels available for it

  // ---------------- CODE EXECUTION ----------------
  runCode: "/runcode/run", // POST


};

export default BASE;
