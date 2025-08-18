import React, { useContext } from "react";
import { Navigate, Outlet, redirect } from "react-router-dom";
import AdminMaster from "../AdminMasterLayout/AdminMaster";
import NotFound from "../NotFound/NotFound";

function AuthLayout() {
  const token = localStorage.getItem("token");
  const sessionToken = sessionStorage.getItem("token");
  return <>{(token || sessionToken) ? <Navigate to={"/"} /> : <Outlet />}</>;
}

export default AuthLayout;
