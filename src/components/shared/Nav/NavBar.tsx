import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faBell } from "@fortawesome/free-solid-svg-icons";
import Style from "./NavBar.module.css";
import Imguser from "../../../assets/svg/userimg.svg";
export default function NavBar() {
  return (
    <header
      className="d-flex justify-content-between align-items-center p-3 bg-white mb-2"
      style={{ direction: "rtl" }}
    >
      {/* أيقونة الجرس والمستخدم */}
      <div className="d-flex align-items-center gap-5 ">
        <div className="d-flex align-items-center me-3 gap-3">
          <img
            src={Imguser}
            alt="User Avatar"
            className="rounded-circle ms-2"
            style={{ width: "40px", height: "40px" }}
          />
          <div>
            <strong className="d-none d-xl-block">جوليا منصور</strong>
            <p
              className="text-muted m-0 d-none d-xl-block"
              style={{ fontSize: "0.9rem" }}
            >
              مشرف
            </p>
          </div>
        </div>
        <FontAwesomeIcon
          icon={faBell}
          className="text-muted ms-5 "
          style={{ fontSize: "18px" }}
        />
      </div>

      {/* مربع البحث */}
      <div className="w-75 border rounded  position-relative shadow ">
        <input
          type="text"
          className={`${Style.heroSearch} form-control ps-5 `}
          placeholder="ابحث..."
        />
        <FontAwesomeIcon
          icon={faSearch}
          className="position-absolute"
          style={{
            top: "50%",
            left: "15px",
            transform: "translateY(-50%)",
            color: "#aaa",
          }}
        />
      </div>
    </header>
  );
}
