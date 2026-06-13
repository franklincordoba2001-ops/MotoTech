import { Navigate } from "react-router-dom";

function PrivateRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const rol = localStorage.getItem("rol") || localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/" />;
  }

  if (allowedRoles && !allowedRoles.includes(rol)) {
    return <Navigate to="/dashboard" />;
  }

  return children;
}

export default PrivateRoute;