import React from "react";
import { Outlet } from "react-router-dom";

function AdminMaster() {
  return (
    <div>
      this is Admin Master
      <Outlet />
    </div>
  );
}

export default AdminMaster;
