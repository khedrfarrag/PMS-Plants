import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../../context/Context";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole: string; // Role required to access the route
}

function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, role } = useContext(AuthContext); // Access auth state from context

  // Check if the user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // Check if the user's role matches the required role
  if (role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  // If authenticated and role matches, return the children (protected content)
  return <>{children}</>;
}

export default ProtectedRoute;
