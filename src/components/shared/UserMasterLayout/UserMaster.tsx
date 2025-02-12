import React from "react";
import { Outlet } from "react-router-dom";

function UserMaster() {
  return (
    <div>
      this is User Master
      <Outlet />
    </div>
  );
}

export default UserMaster;
