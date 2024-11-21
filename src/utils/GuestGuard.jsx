import { Navigate } from "react-router-dom";

const GuestGuard = ({ children }) => {
  const token = sessionStorage.getItem("token");
  const userRole = sessionStorage.getItem("role");

  // Check if the user is logged in
  if (token) {
    // Redirect based on user role
    if (userRole === "superadmin") {
      return <Navigate to="/super-admin" />;
    } else if (userRole === "admin") {
      return <Navigate to="/admin" />;
    } else if (userRole === "salesman") {
      return <Navigate to="/sales" />;
    } else {
      // Optional: Handle unknown roles
      return <Navigate to="/" />;
    }
  }

  // If not logged in, render the children
  return children;
};

export default GuestGuard;
