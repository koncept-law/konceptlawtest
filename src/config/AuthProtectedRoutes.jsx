import React from "react";
import { Navigate } from "react-router-dom";
import { getItemFromStore } from "../utils";

const AuthProtectedRoutes = ({ children }) => {
  const token = getItemFromStore("konceptLawToken");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AuthProtectedRoutes;
