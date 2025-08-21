import { useContext, useEffect, useMemo, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../../../context/Context";
import SideBar from "../Side/SideBar";
import NavBar from "../Nav/NavBar";
import Style from "./AdminMaster.module.css";
import SessionModalWrapper from "../../SessionModalWrapper";
import ScrollToTop from "../utils/ScrollToTop";

function AdminMaster() {
  const { userData }: any = useContext(AuthContext);
  console.log(userData);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    // Close sidebar when switching to desktop
    if (!isMobile) setIsSidebarOpen(false);
  }, [isMobile]);

  const contentClassName = useMemo(() => {
    if (isMobile && isSidebarOpen)
      return `${Style.content} ${Style.contentShift}`;
    return Style.content;
  }, [isMobile, isSidebarOpen]);
  return (
    <>
      <ScrollToTop />
      <SessionModalWrapper />
      {userData?.role === "User" ? <Navigate to={"/auth"} /> : ""}
      <div className={`${Style.appcontainer}`}>
        <SideBar
          isOpen={isSidebarOpen}
          isMobile={isMobile}
          onClose={() => setIsSidebarOpen(false)}
        />
        <div className={`${contentClassName}`}>
          <NavBar
            isMobile={isMobile}
            isSidebarOpen={isSidebarOpen}
            onToggleSidebar={() => setIsSidebarOpen((p) => !p)}
          />
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default AdminMaster;
