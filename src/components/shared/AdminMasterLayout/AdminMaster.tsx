import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../../../context/Context";
import SideBar from "../Side/SideBar";
import NavBar from "../Nav/NavBar";


function AdminMaster() {
  const { userData }: any = useContext(AuthContext);
  console.log(userData);

  // const token: string | null = localStorage.getItem("token");
  return <>
     <NavBar/>
    
      <div className="container-fluid" dir="ltr">
        <div className="row">


          <div className="col-md-2  bg-info">
          <SideBar />
          </div>

          <div className="col-md-10 ">
          <Outlet />
          {userData?.payload?.role === "User" ? <Navigate to={"/auth"} /> : ""}
          </div>
        
       
       
      </div>
      
    </div>
        </>
    
  ;
}
export default AdminMaster;
