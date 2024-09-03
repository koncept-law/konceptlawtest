import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoutes = ({ children, redirect }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  if (user && user.profile !== "superAdmin") return navigate(redirect);

  return <> {children}</>;
};

export default ProtectedRoutes;
