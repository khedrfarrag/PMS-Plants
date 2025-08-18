import React, { useContext, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faCartPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import Style from "./SlideBar.module.css";
import imgCompony from "../../../assets/svg/dashsvg/imgcompony.svg";
import {
  faTh,
  faUsers,
  faEnvelope,
  faShoppingCart,
  faCog,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate, NavLink } from "react-router-dom";
import { AuthContext } from "../../../context/Context";

export default function SideBar() {
  const navigate = useNavigate();
  const { logout }: null | any = useContext(AuthContext);
  const HandleLogout = () => {
    logout(false, () => navigate("/auth/login"));

  };

  return (
    <>
     
      <div
        className={`${Style.sidebar} d-flex flex-column align-items-center border-end vh-100 p-3`}
        style={{ width: "100px" }}
      >
        {/* الشعار */}
        <div className="mb-4">
          <img src={imgCompony} alt="Logo" className="img-fluid" />
        </div>

        {/* القائمة */}
        <div className="nav flex-column text-center w-100">
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              isActive ? `${Style.sidebarLink} ${Style.sidebarLinkActive}` : Style.sidebarLink
            }
          >
            <FontAwesomeIcon icon={faTh} size="lg" />
          </NavLink>
          <NavLink
            to="/admin/users-list"
            className={({ isActive }) =>
              isActive ? `${Style.sidebarLink} ${Style.sidebarLinkActive}` : Style.sidebarLink
            }
          >
            <FontAwesomeIcon icon={faUsers} size="lg" />
          </NavLink>
          <NavLink
            to="/admin/contact-message"
            className={({ isActive }) =>
              isActive ? `${Style.sidebarLink} ${Style.sidebarLinkActive}` : Style.sidebarLink
            }
          >
            <FontAwesomeIcon icon={faEnvelope} size="lg" />
          </NavLink>
          <NavLink
            to="/admin/product-list"
            className={({ isActive }) =>
              isActive ? `${Style.sidebarLink} ${Style.sidebarLinkActive}` : Style.sidebarLink
            }
          >
            <FontAwesomeIcon icon={faCartPlus} size="lg" />
          </NavLink>
          <NavLink
            to="/admin/orders"
            className={({ isActive }) =>
              isActive ? `${Style.sidebarLink} ${Style.sidebarLinkActive}` : Style.sidebarLink
            }
          >
            <FontAwesomeIcon icon={faShoppingCart} size="lg" />
          </NavLink>
          <NavLink
            to="/admin/setting"
            className={({ isActive }) =>
              isActive ? `${Style.sidebarLink} ${Style.sidebarLinkActive}` : Style.sidebarLink
            }
          >
            <FontAwesomeIcon icon={faCog} size="lg" />
          </NavLink>
        </div>

        {/* تسجيل الخروج */}
        <div className="mt-auto py-3">
          <FontAwesomeIcon
            icon={faSignOutAlt}
            size="lg"
            className=""
            onClick={HandleLogout}
            style={{ cursor: "pointer" ,color:"#e74c3c"}}
          />
        </div>
      </div>
   
      {/* <div className="d-block d-md-none">
      
        
      </div> */}
    </>
  );
}
