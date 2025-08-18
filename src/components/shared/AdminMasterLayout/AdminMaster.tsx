import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../../../context/Context";
import SideBar from "../Side/SideBar";
import NavBar from "../Nav/NavBar";
import Style from "./AdminMaster.module.css";
import SessionModalWrapper from "../../SessionModalWrapper";

function AdminMaster() {
  const { userData }: any = useContext(AuthContext);
  console.log(userData);
  // const token: string | null = localStorage.getItem("token");
  return (
    <>
      <SessionModalWrapper />
      {userData?.role === "User" ? <Navigate to={"/auth"} /> : ""}
      <div className={`${Style.appcontainer}`}>
        <SideBar />
        <div className={`${Style.content}`}>
          <NavBar />
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default AdminMaster;
