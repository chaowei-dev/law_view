import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import authService from "../../services/authService";

const SuperRoute = ({ children }) => {
  const location = useLocation();
  const userRole = authService.getUserRole();

  if (userRole !== "super-user") {
    // Redirect them to the /login page, but save the current location they were trying to go to
    return <Navigate to="/books" state={{ from: location }} replace />;
  }

  return children;
};

export default SuperRoute;
