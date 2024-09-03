import React from "react";
import { Navigate } from "react-router-dom";

const AdminProtectedRoutes = ({ isAdmin, redirect, children }) => {
  if (!isAdmin) {
    return <Navigate to={redirect} />;
  }
  return <>{children}</>;
};

export default AdminProtectedRoutes;
