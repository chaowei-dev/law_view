// src/components/PrivateRoute.js
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import authService from "../../services/authService";

const PrivateRoute = ({ allowedUser, children }) => {
  const location = useLocation();
  const userRole = authService.getUserRole();  
  const isAllowed = allowedUser.includes(userRole);
  const isExpired = authService.isTokenExpired();

  if (!isAllowed) {
    // Redirect them to the /login page, but save the current location they were trying to go to
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (isExpired) {
    // Redirect them to the /login page, but save the current location they were trying to go to
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // if (!user) {
  //   // Redirect them to the /login page, but save the current location they were trying to go to
  //   return <Navigate to="/login" state={{ from: location }} replace />;
  // }

  return children;
};

export default PrivateRoute;
