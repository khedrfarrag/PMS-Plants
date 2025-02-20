import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../../context/Context";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { userData } = useContext(AuthContext);
  if (!localStorage.getItem("token")) {
    return <Navigate to="/" />;
  } else return children;
}

export default ProtectedRoute;
