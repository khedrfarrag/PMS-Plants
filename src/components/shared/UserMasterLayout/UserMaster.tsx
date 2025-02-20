import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../../../context/Context";

function UserMaster() {
  const { userData }: any = useContext(AuthContext);
  console.log(userData?.payload?.role);

  return (
    <>
      this is User Master
      {userData?.payload?.role === "Admin" ? <Navigate to={"/admin"} /> : ""}
      <Outlet />
    </>
  );
}

export default UserMaster;
