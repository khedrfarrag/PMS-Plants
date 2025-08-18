import React, { useState, useRef, useEffect, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {  faBell } from "@fortawesome/free-solid-svg-icons";
import Style from "./NavBar.module.css";
import Imguser from "../../../assets/svg/userimg.svg";
import {  useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/Context";
import { ImgURLBeasd, contactMessagesPoint } from "../../../constant/Const";
import { ContactMessageContext } from "../../../context/ContactMessageContext";

export default function NavBar() {
  const [dropdownOpenAvatar, setDropdownOpenAvatar] = useState(false);
  const [dropdownOpenBell, setDropdownOpenBell] = useState(false);
  const avatarDropdownRef = useRef<HTMLDivElement>(null);
  const bellDropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const {userData,logout}:any=useContext(AuthContext)
  console.log(userData)

  // إغلاق القائمة عند الضغط خارجها
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        avatarDropdownRef.current &&
        !avatarDropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpenAvatar(false);
      }
      if (
        bellDropdownRef.current &&
        !bellDropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpenBell(false);
      }
    }
    if (dropdownOpenAvatar || dropdownOpenBell) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpenAvatar, dropdownOpenBell]);

  const handleAvatarClick = () => {
    setDropdownOpenAvatar((prev) => !prev);
    setDropdownOpenBell(false);
  };
  const handleBellClick = async () => {
    await fetchMessages();
    setDropdownOpenBell((prev) => !prev);
    setDropdownOpenAvatar(false);
  };

  const handleMenuClick = (route: string) => {
    setDropdownOpenAvatar(false);
    setDropdownOpenBell(false);
    navigate(route);
  };

  const handleLogout = () => {
    
    logout(false,()=>navigate("/auth"))
  };

  const getRoleArabic = (role: string) => {
    switch (role) {
      case "SuperAdmin":
        return "مدير النظام";
      case "Admin":
        return "مشرف النظام";
      default:
        return role;
    }
  };

  // رسائل التواصل
  const { messages, fetchMessages } = useContext(ContactMessageContext) || { messages: [], fetchMessages: () => {} };
  const unreadCount = messages.filter((m: any) => !m.IsRead).length;

  return (
    <header
      className="d-flex justify-content-between align-items-center p-3 bg-white mb-2 shadow-sm"
      style={{ direction: "rtl" }}
    >
      {/* أيقونة الجرس والمستخدم */}
      <div className="d-flex align-items-center gap-5 ">
        <div className="d-flex align-items-center me-3 gap-3 position-relative">
          <img
            src={userData?.image ? `${ImgURLBeasd}${userData?.image}` : Imguser}
            alt="User Avatar"
            className="rounded-circle ms-2"
            style={{ width: "40px", height: "40px", cursor: "pointer" }}
            onClick={handleAvatarClick}
          />
          {/* القائمة المنسدلة الخاصة بالصورة */}
          {dropdownOpenAvatar && (
            <div
              ref={avatarDropdownRef}
              className={`${Style.dropdown} shadow bg-white rounded position-absolute`}
              style={{
                top: "50px",
                right: 0,
                minWidth: "180px",
                zIndex: 1000,
                border: "1px solid #eee",
              }}
            >
              <button
                className="dropdown-item w-100 text-end py-2 px-3 border-bottom bg-transparent"
                onClick={() => handleMenuClick("/admin/setting")}
              >
                إدارة الحساب
              </button>
              <button
                className="dropdown-item w-100 text-end py-2 px-3 border-bottom bg-transparent"
                onClick={() => handleMenuClick("/admin/orders")}
              >
                متابعة الطلبات/المشتريات
              </button>
              <button
                className="dropdown-item w-100 text-end py-2 px-3 border-bottom bg-transparent"
                onClick={() => handleMenuClick("/admin/product-list")}
              >
                المنتجات
              </button>
              <button
                className="dropdown-item w-100 text-end py-2 px-3 border-bottom bg-transparent"
                onClick={() => handleMenuClick("/admin/users-list")}
              >
                المستخدمين
              </button>
              <button
                className="dropdown-item w-100 text-end py-2 px-3 border-bottom bg-transparent"
                onClick={() => handleMenuClick("/admin/contact-message")}
              >
                 رسائل العملاء
              </button>
              <button
                className="dropdown-item w-100 text-end py-2 px-3 bg-transparent text-danger"
                onClick={handleLogout}
              >
                تسجيل خروج
              </button>
            </div>
          )}
          {/* القائمة المنسدلة الخاصة بالجرس */}
          {dropdownOpenBell && (
            <div
              ref={bellDropdownRef}
              className={`${Style.dropdown} shadow bg-white rounded position-absolute`}
              style={{
                top: "50px",
                right: 0,
                minWidth: "320px",
                maxWidth: "95vw",
                zIndex: 1000,
                border: "1px solid #eee",
                padding: 0,
                boxShadow: "0 4px 24px rgba(1,143,44,0.10)",
                borderRadius: 16,
                overflow: "hidden"
              }}
            >
              {/* قائمة الرسائل */}
              <div style={{ maxHeight: 400, overflowY: "auto", background: "#fff" }}>
                {messages.length === 0 ? (
                  <div className="text-center py-4 text-muted">لا توجد رسائل</div>
                ) : (
                  messages.map((msg, idx) => (
                    <div
                      key={msg.Id}
                      onClick={() => {
                        setDropdownOpenBell(false);
                        navigate("/admin/contact-message", { state: { messageId: msg.Id } });
                      }}
                      style={{
                        padding: "12px 18px",
                        borderBottom: idx === messages.length - 1 ? "none" : "1px solid #f0f0f0",
                        background: !msg.IsRead ? "#f6fff9" : "#fff",
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        gap: 2
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontWeight: 700, color: !msg.IsRead ? "#009247" : "#333", fontSize: 15 }}>{msg.Name}</span>
                        {!msg.IsRead && <span style={{ background: "#e74c3c", color: "#fff", borderRadius: 8, fontSize: 11, padding: "2px 8px", marginRight: 6 }}>جديدة</span>}
                        <span style={{ color: "#888", fontSize: 12, marginRight: "auto" }}>{new Date(msg.SentAt).toLocaleDateString("ar-EG", { month: "short", day: "numeric" })}</span>
                      </div>
                      <div style={{ color: "#666", fontSize: 13, marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {msg.Message.length > 50 ? msg.Message.slice(0, 50) + "..." : msg.Message}
                      </div>
                    </div>
                  ))
                )}
              </div>
              {/* زر عرض كل الرسائل */}
              <div style={{ borderTop: "1px solid #eee", background: "#fafafa", padding: 10, textAlign: "center" }}>
                <button
                  className="btn btn-sm"
                  style={{
                    background: "#009247",
                    color: "#fff",
                    borderRadius: 8,
                    fontWeight: 700,
                    fontSize: 15,
                    padding: "6px 24px",
                    border: "none",
                    boxShadow: "0 2px 8px rgba(1,143,44,0.08)",
                    transition: "background 0.2s"
                  }}
                  onClick={() => {
                    setDropdownOpenBell(false);
                    navigate("/admin/contact-message");
                  }}
                >
                  عرض كل الرسائل
                </button>
              </div>
            </div>
          )}
          <div>
            <strong className="d-none d-xl-block">
              {userData?.name}
            </strong>
            <p
              className="text-muted m-0 d-none d-xl-block"
              style={{ fontSize: ".9rem", fontWeight: "bold" }}
            >
              {userData?.role ? getRoleArabic(userData.role) : ""}
            </p>
          </div>
        </div>
        <FontAwesomeIcon
          icon={faBell}
          className="ms-5 "
          style={{ fontSize: "18px", color: unreadCount > 0 ? "#e74c3c" : "#888", cursor: "pointer", transition: "color 0.2s" }}
          onClick={handleBellClick}
        />
      </div>
    </header>
  );
}
