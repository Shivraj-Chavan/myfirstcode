import { Navigate } from "react-router-dom";

const TeacherProtectedRoute = ({
  children,
}) => {

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  // ================= NOT LOGGED IN =================

  if (!user) {
    return <Navigate to="/" />;
  }

  // ================= NOT TEACHER =================

  if (user.role !== "teacher") {
    return <Navigate to="/" />;
  }

  // ================= NOT APPROVED =================

  if (user.status !== "APPROVED") {

    return (
      <div className="h-screen flex items-center justify-center text-3xl font-bold">
        Waiting For Admin Approval
      </div>
    );

  }

  return children;
};

export default TeacherProtectedRoute;