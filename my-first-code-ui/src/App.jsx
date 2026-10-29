// import {
//   BrowserRouter,
//   Routes,
//   Route,
// } from "react-router-dom";
// import Navbar from "./components/navbar";
// import Dashboard from "./pages/studentPanel/dashboard";
// import TeacherDashboard from "./pages/TeacherPanel/teacherDashboard";
// import AdminDashboard from "./pages/adminPanel/adminDashboard";
// import Home from "./pages/home";


// function App() {

//   return (
//     <BrowserRouter>

//       {/* GLOBAL NAVBAR */}

//       <Navbar />

//       <Routes>

//         {/* HOME */}

//         <Route
//           path="/"
//           element={<Home />}
//         />

//         {/* STUDENT */}

//         <Route
//           path="/student-dashboard"
//           element={<Dashboard />}
//         />

//         {/* TEACHER */}

//         <Route
//           path="/teacher-dashboard"
//           element={<TeacherDashboard />}
//         />

//         {/* ADMIN */}

//         <Route
//           path="/admin-dashboard"
//           element={<AdminDashboard />}
//         />

//       </Routes>

//     </BrowserRouter>
//   );
// }

// export default App;



import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home, Settings } from "lucide-react";
import Navbar from "./components/navbar";
import AdminLayout from "./layouts/adminLayout";

// student pages

import Dashboard from "./pages/studentPanel/dashboard";
import MyCourses from "./pages/studentPanel/myCourses";
import Calender from "./pages/studentPanel/calender";
import Playground from "./pages/studentPanel/playground";
import Assignmnet from "./pages/studentPanel/assignment";
import Certificates from "./pages/studentPanel/certificates";
import Quizzes from "./pages/studentPanel/quizzes";
import Leaderboard from "./pages/studentPanel/leaderboard";
import Profile from "./pages/studentPanel/profile";
import StudentLayout from "./layouts/studentLayout";

// Teacher pages
import TeacherDashboard from "./pages/TeacherPanel/teacherDashboard";
import TeacherLayout from "./layouts/teacherLayout";
import MyCourse from "./pages/TeacherPanel/myCourses";
import Students from "./pages/TeacherPanel/students";
import ScheduleCalendar from "./pages/TeacherPanel/scheduleCalendar";
import Submissions from "./pages/TeacherPanel/submissions";
import Announcements from "./pages/TeacherPanel/announcements";
import LiveClasses from "./pages/TeacherPanel/liveClasses";
import Analytics from "./pages/TeacherPanel/analytics";
import Assignments from './pages/TeacherPanel/assignments'
import TeacherProtectedRoute from "./components/teacherProtectedRoute";
import Quizz from "./pages/TeacherPanel/quizz";
import Certificate from "./pages/TeacherPanel/certificate";

// admin pages
import AdminDashboard from "./pages/adminPanel/adminDashboard";
import Teachers from "./pages/adminPanel/teachers";
import Courses from "./pages/adminPanel/myCourses";
import Categories from "./pages/adminPanel/categories";
import Payments from "./pages/adminPanel/payments";
import Reports from "./pages/adminPanel/reports";
import CMS from "./pages/adminPanel/cms";
import AdminProtectedRoute from "./components/adminProtectedRoute";
import Asssignments from "./pages/adminPanel/asssignments"
import AdminQuizzes from "./pages/adminPanel/quizzes";
import Calendar from "../src/pages/adminPanel/calendar";
import StudentEnquiry from "./pages/studentPanel/studentenquiry";
import TeacherEnquiries from "./pages/TeacherPanel/teacherEnquiries";
import CourseView from "./components/courseView";
import LevelLearning from "./components/levelLearning";
 // import Students from "./pages/adminPanel/students";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* HOME */}
        <Route path="/" element={<Home />} />

        {/* STUDENT LAYOUT */}
        <Route path="/student" element={<StudentLayout />}>
          <Route path="dashboard" index element={<Dashboard />} />
          <Route path="courses" element={<MyCourses />} />

        <Route
          path="/student/course/:id"
          element={<CourseView />}
        />
          <Route path="calendar" element={<Calender />} />
          <Route path="playground" element={<Playground />} />
          <Route path="assignments" element={<Assignmnet />} />
          <Route path="certificates" element={<Certificates />} />
          <Route path="quizzes" element={<Quizzes />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="enquiry" element={<StudentEnquiry />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="/student/level/:id" element={<LevelLearning />}/>
        </Route>

        {/* TEACHER */}
       <Route path="/teacher" element={
    <TeacherProtectedRoute>
      <TeacherLayout />
    </TeacherProtectedRoute>
  }
>
        
        <Route index element={<TeacherDashboard />} />
        <Route path="dashboard" element={<TeacherDashboard />} />
        <Route path="courses" element={<MyCourse />} />
        <Route path="students" element={<Students />} />
        <Route path="calendar" element={<ScheduleCalendar />} />
        <Route path="assignments" element={<Assignments />} />
        <Route path="quizz" element={<Quizz />} />
        <Route path="certificate" element={<Certificate />} />
        <Route path="liveclasses" element={<LiveClasses />} />
        <Route path="enquiries" element={<TeacherEnquiries />} />
        <Route path="announcements" element={<Announcements />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="settings" element={<Settings />} />

      </Route>

        <Route path="/admin" element={
          <AdminProtectedRoute>
            <AdminLayout />
          </AdminProtectedRoute>
        }
      >

        {/* DASHBOARD */}

        <Route index element={<AdminDashboard />}/>

        {/* STUDENTS */}

        <Route
          path="students"
          element={<Students />}
        />

        {/* TEACHERS */}

        <Route
          path="teachers"
          element={<Teachers />}
        />

        {/* COURSES */}

        <Route
          path="courses"
          element={<Courses />}
        />

         <Route
          path="asssignmnets"
          element={<Asssignments />}
        />

         <Route
          path="calendar"
          element={<Calendar />}
        />

        <Route
          path="quizzes"
          element={<AdminQuizzes />}
        />

        {/* CATEGORIES */}

        <Route
          path="categories"
          element={<Categories />}
        />

        {/* PAYMENTS */}

        <Route
          path="payments"
          element={<Payments />}
        />

        {/* CERTIFICATES */}

        <Route
          path="certificates"
          element={<Certificates />}
        />

        {/* REPORTS */}

        <Route
          path="reports"
          element={<Reports />}
        />

        {/* CMS */}

        <Route
          path="cms"
          element={<CMS />}
        />

        {/* NOTIFICATIONS */}

        {/* <Route
          path="notifications"
          element={<Notifications />}
        /> */}

        {/* SETTINGS */}

        <Route
          path="settings"
          element={<Settings />}
        />

      </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;