import CONFIG from "../constance.js";

const ENDPOINT = {

  // LOGIN
  REGISTER: `${CONFIG.API_BASE_URL}/auth/register`,

  VERIFY_OTP: `${CONFIG.API_BASE_URL}/auth/verify-otp`,

  LOGIN: `${CONFIG.API_BASE_URL}/auth/login`,

   GET_TEACHERS: `${CONFIG.API_BASE_URL}/auth/teachers`,

  APPROVE_TEACHER: (id) => `${CONFIG.API_BASE_URL}/auth/approve-teacher/${id}`,

  DELETE_TEACHER: (id) => `${CONFIG.API_BASE_URL}/auth/delete-teacher/${id}`,
  CREATE: `${CONFIG.API_BASE_URL}/auth/teachers`,



  // COURSES

  // GET ALL COURSES
  GET_COURSES:`${CONFIG.API_BASE_URL}/courses`,

  // GET SINGLE COURSE
  GET_SINGLE_COURSE: (id) =>`${CONFIG.API_BASE_URL}/courses/${id}`,

  // CREATE COURSE
  CREATE_COURSE:`${CONFIG.API_BASE_URL}/courses/create`,

  // UPDATE COURSE
  UPDATE_COURSE: (id) => `${CONFIG.API_BASE_URL}/courses/update/${id}`,

  // DELETE COURSE
  DELETE_COURSE: (id) =>`${CONFIG.API_BASE_URL}/courses/delete/${id}`,

  GET_COURSE_DETAIL: (id) =>`${CONFIG.API_BASE_URL}/courses/${id}`,

  // GET COURSES BY STANDARD
  GET_COURSE_BY_STANDARD: (standard) =>`${CONFIG.API_BASE_URL}/courses/standard/${standard}`,

  // GET COURSES BY CATEGORY
  GET_COURSE_BY_CATEGORY: (category) =>`${CONFIG.API_BASE_URL}/courses/category/${category}`,

  // GET TEACHER COURSES
  GET_TEACHER_COURSES: (teacherId) =>`${CONFIG.API_BASE_URL}/courses/teacher/${teacherId}`,

  // SEARCH COURSES
  SEARCH_COURSES: ( keyword) =>`${CONFIG.API_BASE_URL}/courses/search/${keyword}`,

  // UPDATE COURSE STATUS
  UPDATE_COURSE_STATUS: (id) =>`${CONFIG.API_BASE_URL}/courses/status/${id}`,



 // ================= CALENDAR =================


  GET_EVENTS:
    `${CONFIG.API_BASE_URL}/calendar`,

  GET_SINGLE_EVENT: (id) =>
    `${CONFIG.API_BASE_URL}/calendar/${id}`,

  CREATE_EVENT:
    `${CONFIG.API_BASE_URL}/calendar/create`,

  UPDATE_EVENT: (id) =>
    `${CONFIG.API_BASE_URL}/calendar/update/${id}`,

  DELETE_EVENT: (id) =>
    `${CONFIG.API_BASE_URL}/calendar/delete/${id}`,

  GET_CALENDAR_DASHBOARD:
    `${CONFIG.API_BASE_URL}/calendar/dashboard`,

     GET_EVENTS_BY_STANDARD: (standard) =>`${CONFIG.API_BASE_URL}/calendar/events/student/${standard}`,

     GET_ALL_EVENTS_ADMIN:`${CONFIG.API_BASE_URL}/calendar/admin/events`,

    // ================= STUDENTS =================

    GET_ALL_STUDENTS:`${CONFIG.API_BASE_URL}/students`,

  GET_SINGLE_STUDENT: (id) => `${CONFIG.API_BASE_URL}/students/${id}`,

  CREATE_STUDENT:`${CONFIG.API_BASE_URL}/students/create`,

  UPDATE_STUDENT: (id) =>
    `${CONFIG.API_BASE_URL}/students/update/${id}`,

  DELETE_STUDENT: (id) =>
    `${CONFIG.API_BASE_URL}/students/delete/${id}`,

  GET_STUDENT_PROGRESS: (id) =>
    `${CONFIG.API_BASE_URL}/students/progress/${id}`,

  GET_TEACHER_STUDENTS:
    `${CONFIG.API_BASE_URL}/students/teacher`,

  ASSIGN_STUDENT: (id) =>
    `${CONFIG.API_BASE_URL}/students/assign/${id}`,

  ASSIGN_LEVELS:
  `${CONFIG.API_BASE_URL}/students/assign-levels`,  

GET_STUDENT_LEVELS: (studentId) =>
  `${CONFIG.API_BASE_URL}/students/${studentId}`,

REMOVE_STUDENT_LEVEL: (studentId, levelId) =>
  `${CONFIG.API_BASE_URL}/students/${studentId}/${levelId}`,


  // ================= TEACHERS =================

  GET_ALL_TEACHERS:
    `${CONFIG.API_BASE_URL}/teachers`,

  CREATE_TEACHER:
    `${CONFIG.API_BASE_URL}/teachers/request`,

  UPDATE_TEACHER: (id) =>
    `${CONFIG.API_BASE_URL}/teachers/${id}`,



  // ASSIGNMENTS
 GET_ASSIGNMENTS:
  `${CONFIG.API_BASE_URL}/assignments`,

  CREATE_ASSIGNMENT:
  `${CONFIG.API_BASE_URL}/assignments`,

  UPDATE_ASSIGNMENT:
  (id) =>
  `${CONFIG.API_BASE_URL}/assignments/${id}`,

  DELETE_ASSIGNMENT:
  (id) =>
  `${CONFIG.API_BASE_URL}/assignments/${id}`,

   GET_ASSIGNMENT_ATTEMPTS:(id) =>`${CONFIG.API_BASE_URL}/assignments/${id}/attempts`,


  
  // SUBMISSIONS
  SUBMIT: `${CONFIG.API_BASE_URL}/assignments/submit`,

  GET_SUBMISSIONS: (id) =>`${CONFIG.API_BASE_URL}/assignments/submissions/${id}`,

  // OPTIONAL ADVANCED APIs
  GET_MY_ASSIGNMENTS: `${CONFIG.API_BASE_URL}/assignments/my`,

  GET_MY_SUBMISSION: (id) =>`${CONFIG.API_BASE_URL}/assignments/${id}/my-submission`,

  GET_REPORT: (id) =>`${CONFIG.API_BASE_URL}/assignments/${id}/report`,




// QUIZZES

GET_QUIZZES: `${CONFIG.API_BASE_URL}/quizzes`,

  GET_SINGLE_QUIZ:(id) =>`${CONFIG.API_BASE_URL}/quizzes/${id}`,

  CREATE_QUIZ:`${CONFIG.API_BASE_URL}/quizzes`,

  UPDATE_QUIZ:(id) => `${CONFIG.API_BASE_URL}/quizzes/${id}`,

  DELETE_QUIZ:(id) =>`${CONFIG.API_BASE_URL}/quizzes/${id}`,

  SUBMIT_QUIZ:(id) => `${CONFIG.API_BASE_URL}/quizzes/submit/${id}`,

  GET_QUIZ_RESULTS:(id) => `${CONFIG.API_BASE_URL}/quizzes/quiz-results/${id}`,


  // RUN CODE 
  RUN_CODE: `${CONFIG.API_BASE_URL}/runcode/run`,



  // DASHBOARD
   ADMIN_DASHBOARD:`${CONFIG.API_BASE_URL}/admindashboard/admin`,
   TEACHER_DASHBOARD:`${CONFIG.API_BASE_URL}/teacherdashboard/`,
   STUDENT_DASHBOARD:`${CONFIG.API_BASE_URL}/studentdashboard/student`,


// ENQUIRY
   SEND_ENQUIRY:`${CONFIG.API_BASE_URL}/enquiry/send`,

GET_STUDENT_ENQUIRIES:`${CONFIG.API_BASE_URL}/enquiry/student`,

GET_TEACHER_ENQUIRIES:`${CONFIG.API_BASE_URL}/enquiry/teacher`,

REPLY_ENQUIRY:`${CONFIG.API_BASE_URL}/enquiry/reply`,



// CERTIFICATE 

GET_CERTIFICATES:`${CONFIG.API_BASE_URL}/certificates`,

GET_SINGLE_CERTIFICATE:`${CONFIG.API_BASE_URL}/certificates/single`,

GET_STUDENT_CERTIFICATES:`${CONFIG.API_BASE_URL}/certificates/student`,

ISSUE_CERTIFICATE:`${CONFIG.API_BASE_URL}/certificates/issue`,
   
UPDATE_CERTIFICATE:`${CONFIG.API_BASE_URL}/certificates`,

DELETE_CERTIFICATE:`${CONFIG.API_BASE_URL}/certificates`,

GET_CERTIFICATES_BY_STUDENT: (studentId) =>`${CONFIG.API_BASE_URL}/certificates/${studentId}`,


 // LEVELS
 GET_LEVELS:
 `${CONFIG.API_BASE_URL}/levels`,

CREATE_LEVEL:
 `${CONFIG.API_BASE_URL}/levels`,

UPDATE_LEVEL:
 (id) => `${CONFIG.API_BASE_URL}/levels/${id}`,

DELETE_LEVEL:
 (id) => `${CONFIG.API_BASE_URL}/levels/${id}`,

GET_LEVEL:
 (id) => `${CONFIG.API_BASE_URL}/levels/${id}`,

// STUDENT LEVELS
// ASSIGN_LEVELS:
//  `${CONFIG.API_BASE_URL}/students/student-levels/assign`,

GET_STUDENT_LEVELS: (id) =>`${CONFIG.API_BASE_URL}/students/${id}`,

REMOVE_STUDENT_LEVEL:
 (studentId, levelId) =>
   `${CONFIG.API_BASE_URL}/students/student-levels/${studentId}/${levelId}`,

// PAYMENTS
CREATE_LEVEL_ORDER:
 `${CONFIG.API_BASE_URL}/students/student/level-payment/order`,

VERIFY_LEVEL_PAYMENT:
 `${CONFIG.API_BASE_URL}/students/level-payment/verify`,

// COURSES
GET_MY_COURSES:
 `${CONFIG.API_BASE_URL}/students/my-courses`,

GET_COURSE_DETAILS:
 (id) =>
   `${CONFIG.API_BASE_URL}/students/my-courses/${id}`,

// PROGRESS
UPDATE_LESSON_PROGRESS:
 `${CONFIG.API_BASE_URL}/students/lesson-progress`,

GET_PROGRESS:
 `${CONFIG.API_BASE_URL}/students/progress`,


// STUDENT
 GET_STUDENT_PROFILE:(id) =>`${CONFIG.API_BASE_URL}/studentProfiles/${id}`,

UPDATE_STUDENT_PROFILE:(id) =>`${CONFIG.API_BASE_URL}/studentProfiles/${id}`,


//LEVELS
CREATE_LEVEL: `${CONFIG.API_BASE_URL}/levels`,
GET_LEVELS: `${CONFIG.API_BASE_URL}/levels`,
GET_LEVEL_BY_ID: (id) => `${CONFIG.API_BASE_URL}/levels/${id}`,
UPDATE_LEVEL: (id) => `${CONFIG.API_BASE_URL}/levels/${id}`,
DELETE_LEVEL: (id) => `${CONFIG.API_BASE_URL}/levels/${id}`,
GET_MY_LEVELS: (studentId) => `${CONFIG.API_BASE_URL}/levels/student/${studentId}`,
GET_LEVELS_BY_STANDARD: (standard) =>`${CONFIG.API_BASE_URL}/levels/standard/${standard}`,



  // Compiler
  RUN_CODE: `${CONFIG.API_BASE_URL}/compiler/run`,

  CREATE_SUBMISSION: `${CONFIG.API_BASE_URL}/compiler/submit`,

  GET_SUBMISSION: (id) =>
    `${CONFIG.API_BASE_URL}/compiler/submission/${id}`,

  GET_OUTPUT: (id) =>
    `${CONFIG.API_BASE_URL}/compiler/output/${id}`,
  
};


export default ENDPOINT;