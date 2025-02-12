import React from "react";

import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../../../context/authcontext";

interface ProtectedRouteProps {
  children?: React.ReactNode;
  loginData?: any;
}
function ProtectedRoute({ loginData, children }: ProtectedRouteProps) {
  if (localStorage.getItem("token") || loginData) return children;
  else return <Navigate to="/dashboard/homepage" />;
}

export default ProtectedRoute;
