import React from "react";
import { Navigate } from "react-router-dom";
import jwtDecode from "jwt-decode";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/" replace />;
  } else {
    const { role } = jwtDecode(token);
    if (role && role === "admin") {
      return children;
    } else {
      return <Navigate to="/" replace />;
    }
  }
};

export default ProtectedRoute;
