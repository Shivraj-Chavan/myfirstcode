import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import DashboardLayout from "./components/layout/DashboardLayout.jsx";
import { studentNav, teacherNav, adminNav } from "./config/nav.js";

// Auth
import Landing from "./pages/Landing.jsx";
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import VerifyOtp from "./pages/auth/VerifyOtp.jsx";

// Student
import StudentDashboard from "./pages/student/StudentDashboard.jsx";
import StudentAssignments from "./pages/student/Assignments.jsx";
import StudentQuizzes from "./pages/student/Quizzes.jsx";
import QuizAttempt from "./pages/student/QuizAttempt.jsx";
import StudentCourses from "./pages/student/Courses.jsx";
import CourseDetail from "./pages/student/CourseDetail.jsx";
import Playground from "./pages/student/Playground.jsx";
import Leaderboard from "./pages/student/Leaderboard.jsx";
import StudentCalendar from "./pages/student/Calendar.jsx";
import StudentEnquiries from "./pages/student/Enquiries.jsx";
import StudentCertificates from "./pages/student/Certificates.jsx";

// Teacher
import TeacherDashboard from "./pages/teacher/TeacherDashboard.jsx";
import TeacherStudents from "./pages/teacher/Students.jsx";
import TeacherAssignments from "./pages/teacher/Assignments.jsx";
import AssignmentAttempts from "./pages/teacher/AssignmentAttempts.jsx";
import TeacherQuizzes from "./pages/teacher/Quizzes.jsx";
import QuizResults from "./pages/teacher/QuizResults.jsx";
import TeacherCalendar from "./pages/teacher/Calendar.jsx";
import TeacherCertificates from "./pages/teacher/Certificates.jsx";
import TeacherEnquiries from "./pages/teacher/Enquiries.jsx";

// Admin
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminStudents from "./pages/admin/Students.jsx";
import AdminTeachers from "./pages/admin/Teachers.jsx";
import AdminCourses from "./pages/admin/Courses.jsx";
import AdminCalendar from "./pages/admin/Calendar.jsx";
import AdminCertificates from "./pages/admin/Certificates.jsx";
import AdminReferralPartners from "./pages/admin/ReferralPartners.jsx";
import AdminReferralStudents from "./pages/admin/ReferralStudents.jsx";
import { ReferralLogin, ReferralRegister } from "./pages/referral/RegisterLogin.jsx";
import ReferralLayout from "./pages/referral/ReferralLayout.jsx";
import ReferralDashboard from "./pages/referral/Dashboard.jsx";
import AddStudent from "./pages/referral/AddStudent.jsx";
import MyStudents from "./pages/referral/MyStudents.jsx";
import { useReferralAuth } from "./context/ReferralAuthContext";
import TeacherLevels from "./pages/teacher/Levels.jsx";
import AdminEnquiries from "./pages/admin/Enquiries.jsx";

function RoleHome() {
  const { user } = useAuth();
  const token = localStorage.getItem("mfc_token");
  if (!token || !user) return <Landing />; // logged out → show the landing page, not a redirect
  if (user.role === "admin") return <Navigate to="/admin" replace />;
  if (user.role === "teacher") return <Navigate to="/teacher" replace />;
  return <Navigate to="/student" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RoleHome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />

      {/* ---------------- STUDENT ---------------- */}
      <Route
        path="/student/*"
        element={
          <ProtectedRoute roles={["student"]}>
            <DashboardLayout items={studentNav} roleLabel="Student panel" title="myFirstCode">
              <Routes>
                <Route index element={<StudentDashboard />} />
                <Route path="assignments" element={<StudentAssignments />} />
                <Route path="quizzes" element={<StudentQuizzes />} />
                <Route path="quizzes/:id" element={<QuizAttempt />} />
                <Route path="courses" element={<StudentCourses />} />
                  <Route path="courses/:id" element={<CourseDetail />} />
                <Route path="playground" element={<Playground />} />
                <Route path="leaderboard" element={<Leaderboard />} />
                <Route path="calendar" element={<StudentCalendar />} />
                <Route path="enquiries" element={<StudentEnquiries />} />
                <Route path="certificates" element={<StudentCertificates />} />
                <Route path="*" element={<Navigate to="/student" replace />} />
              </Routes>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* ---------------- TEACHER ---------------- */}
      <Route
        path="/teacher/*"
        element={
          <ProtectedRoute roles={["teacher"]}>
            <DashboardLayout items={teacherNav} roleLabel="Teacher panel" title="myFirstCode">
              <Routes>
                <Route index element={<TeacherDashboard />} />
                <Route path="students" element={<TeacherStudents />} />
                 <Route path="levels" element={<TeacherLevels />} />
                <Route path="assignments" element={<TeacherAssignments />} />
                <Route path="assignments/:id/attempts" element={<AssignmentAttempts />} />
                <Route path="quizzes" element={<TeacherQuizzes />} />
                <Route path="quizzes/:id/results" element={<QuizResults />} />
                <Route path="calendar" element={<TeacherCalendar />} />
                <Route path="certificates" element={<TeacherCertificates />} />
                <Route path="enquiries" element={<TeacherEnquiries />} />
                <Route path="*" element={<Navigate to="/teacher" replace />} />
              </Routes>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* ---------------- ADMIN ---------------- */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute roles={["admin"]}>
            <DashboardLayout items={adminNav} roleLabel="Admin panel" title="myFirstCode">
              <Routes>
                <Route index element={<AdminDashboard />} />
                <Route path="students" element={<AdminStudents />} />
                <Route path="teachers" element={<AdminTeachers />} />
                <Route path="courses" element={<AdminCourses />} />
                <Route path="calendar" element={<AdminCalendar />} />
                 <Route path="certificates" element={<AdminCertificates />} />
                <Route path="referral-partners" element={<AdminReferralPartners />} />
               <Route path="referral-students" element={<AdminReferralStudents />} />
                <Route path="enquiries" element={<AdminEnquiries />} />
                <Route path="*" element={<Navigate to="/admin" replace />} />
              </Routes>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* ---------------- REFERRAL PORTAL (fully separate auth) ---------------- */}
      <Route path="/referral/login" element={<ReferralLogin />} />
      <Route path="/referral/register" element={<ReferralRegister />} />
      <Route
        path="/referral"
        element={
          <ReferralProtectedRoute>
            <ReferralLayout />
          </ReferralProtectedRoute>
        }
      >
        <Route path="dashboard" element={<ReferralDashboard />} />
        <Route path="add-student" element={<AddStudent />} />
        <Route path="students" element={<MyStudents />} />
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function ReferralProtectedRoute({ children }) {
  const { partner } = useReferralAuth();
  const token = localStorage.getItem("refp_token");
  if (!token || !partner) return <Navigate to="/referral/login" replace />;
  return children;
}