import React, { useContext } from "react";
import { Navigate, Outlet, redirect } from "react-router-dom";
import { AuthContext } from "../../../context/Context";
import AdminMaster from "../AdminMasterLayout/AdminMaster";
import NotFound from "../NotFound/NotFound";

function AuthLayout() {
  const { userData }: any = useContext(AuthContext);
  const token = localStorage.getItem("token");
  console.log(userData);
  return <>{token ? <Navigate to={"/"} /> : <Outlet />}</>;
}

export default AuthLayout;
