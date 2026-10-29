import { useState } from "react";
import AdminDashboard from "../pages/adminPanel/adminDashboard";
import Teachers from "../pages/adminPanel/teachers";
import Courses from "../pages/adminPanel/myCourses";
import AdminQuizzes from "../pages/adminPanel/quizzes";
import Students from "../pages/adminPanel/students";
import Asssignments from "../pages/adminPanel/asssignments";
import Calendar from "../pages/adminPanel/calendar";
import Payments from "../pages/adminPanel/payments";
import Reports from "../pages/adminPanel/reports";
import CMS from "../pages/adminPanel/cms";
import Certificates from "../pages/adminPanel/certificates";
import AdminSidebar from "../components/adminSidebar"
import Levels from "../pages/adminPanel/levels";

const AdminLayout = () => {

  const [activePage, setActivePage] =
    useState("dashboard");

  const renderPage = () => {

    switch (activePage) {

      case "dashboard":
        return <AdminDashboard />;

      case "students":
        return <Students />;

      case "teachers":
        return <Teachers />;

      case "courses":
        return <Courses />;

        case "levels":
          return <Levels />;

         case "asssignment":
        return <Asssignments />;

        case "calendar":
        return <Calendar/>;

         case "quizzes":
        return <AdminQuizzes />;

    //   case "categories":
        // return <Categories />;

      case "payments":
        return <Payments />;

      case "certificates":
        return <Certificates />;

      case "reports":
        return <Reports />;

      case "cms":
        return <CMS />;

    //   case "notifications":
    //     return <Notifications />;

    //   case "settings":
    //     return <Settings />;

      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-100">

      <AdminSidebar
        activePage={activePage}
        setActivePage={setActivePage}
      />

      <div className="flex-1 p-6 overflow-y-auto">

        {renderPage()}

      </div>

    </div>
  );
};

export default AdminLayout;