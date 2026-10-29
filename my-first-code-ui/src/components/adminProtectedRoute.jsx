import { Navigate } from "react-router-dom";

const AdminProtectedRoute = ({
  children,
}) => {

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  // ================= NOT LOGGED IN =================

  if (!user) {
    return <Navigate to="/" />;
  }

  // ================= NOT ADMIN =================

  if (user.role !== "admin") {
    return <Navigate to="/" />;
  }

  return children;
};

export default AdminProtectedRoute;