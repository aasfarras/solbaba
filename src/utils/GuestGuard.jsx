import { Navigate } from "react-router-dom";

const GuestGuard = ({ children }) => {
  const isLoggedIn = !!sessionStorage.getItem("token");

  if (isLoggedIn) {
    return <Navigate to="/" />;
  }

  return children;
};

export default GuestGuard;
