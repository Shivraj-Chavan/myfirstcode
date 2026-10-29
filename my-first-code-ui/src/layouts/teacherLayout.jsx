import { Outlet, useNavigate, useLocation } from "react-router-dom";
import TeacherSidebar from "../components/teacherSidebar";

const TeacherLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // derive active page from URL (clean + reliable)
  const path = location.pathname.split("/").pop();

  const activePage = path || "dashboard";

  return (
    <div className="flex min-h-screen bg-slate-100">

      {/* Sidebar */}
      <TeacherSidebar
        activePage={activePage}
        onNavigate={(route) => navigate(`/teacher/${route}`)}
      />

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </div>

    </div>
  );
};

export default TeacherLayout;