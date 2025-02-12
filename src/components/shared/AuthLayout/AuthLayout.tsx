import React from "react";
import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div>
      this is AuthLayout
      <Outlet />
    </div>
  );
}

export default AuthLayout;
