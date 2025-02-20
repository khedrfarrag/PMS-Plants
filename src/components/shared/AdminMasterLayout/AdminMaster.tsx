import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../../../context/Context";
import SideBar from "../Side/SideBar";
import NavBar from "../Nav/NavBar";
import Style from "./AdminMaster.module.css";

function AdminMaster() {
  const { userData }: any = useContext(AuthContext);
  console.log(userData);

  // const token: string | null = localStorage.getItem("token");
  return (
    <>
      <div className="container-fluid d-flex position-relative w-100 vh-100">
        <SideBar />
        {userData?.payload?.role === "User" ? <Navigate to={"/auth"} /> : ""}
        <NavBar />
      </div>
      <Outlet />
    </>
  );
}

export default AdminMaster;
