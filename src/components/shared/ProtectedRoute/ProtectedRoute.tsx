import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  if (!token) {
    return <Navigate to="/" />;
  } else return children;
}

export default ProtectedRoute;
