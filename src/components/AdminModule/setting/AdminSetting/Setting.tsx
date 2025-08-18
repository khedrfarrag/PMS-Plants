import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLock,
  faEnvelope,
  faTimes,
  faList,
  faCircleUser,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { authEndPoint, ImgURLBeasd } from "../../../../constant/Const";
import { ShimmerPostItem } from "react-shimmer-effects";
import { AuthContext } from "../../../../context/Context";
import { toast } from "react-toastify";

const defaultAvatar =
  "https://ui-avatars.com/api/?name=Admin&background=009247&color=fff&rounded=true&size=128";

interface Admin {
  Id: string;
  FirstName: string;
  LastName: string;
  Email: string;
  City: string;
  PhoneNumber: string;
}

export default function Setting() {
  // State for dropdown menu
  const [showDropdown, setShowDropdown] = useState(false);
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const dropdown = document.getElementById("admin-actions-dropdown");
      const button = document.querySelector('[aria-label="إجراءات الأدمن"]');
      // إذا لم يكن الضغط داخل القائمة أو زر الأيقونة، أغلق القائمة
      if (
        dropdown &&
        !dropdown.contains(e.target as Node) &&
        button &&
        !button.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    if (showDropdown) {
      document.addEventListener("mousedown", handleClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [showDropdown]);
  // دالة إزالة المشرف (إلغاء التأكيد)
  const handleUnconfirmAdmin = async (adminId: string) => {
    if (!adminId) return;
    setIsSubmitting(true);
    try {
      await axios.post(
        authEndPoint.UnConfirmAdmins(adminId),
        {},
        {
          headers: {
            Authorization: `Bearer ${
              localStorage.getItem("token") || sessionStorage.getItem("token")
            }`,
          },
        }
      );
      toast.success("تم إزالة المشرف بنجاح!");
      // تحديث القائمة بعد الإزالة
      const response = await axios.get(authEndPoint.GetConfirmAdmins, {
        headers: {
          Authorization: `Bearer ${
            localStorage.getItem("token") || sessionStorage.getItem("token")
          }`,
        },
      });
      const admins = Array.isArray(response.data.data)
        ? response.data.data
        : [];
      setAllAdmins(admins);
    } catch (error) {
      toast.error("حدث خطأ أثناء إزالة المشرف!");
    } finally {
      setIsSubmitting(false);
    }
  };
  // State لقائمة كل المشرفين والمودال الجديد
  const [allAdmins, setAllAdmins] = useState<Admin[]>([]);
  const [showAllAdminsModal, setShowAllAdminsModal] = useState(false);

  // دالة فتح المودال وجلب كل المشرفين
  const handleShowAllAdmins = async () => {
    setShowAllAdminsModal(true);
    try {
      setIsSubmitting(true);
      const response = await axios.get(authEndPoint.GetConfirmAdmins, {
        headers: {
          Authorization: `Bearer ${
            localStorage.getItem("token") || sessionStorage.getItem("token")
          }`,
        },
      });
      const admins = Array.isArray(response.data.data)
        ? response.data.data
        : [];
      setAllAdmins(admins);
    } catch (error) {
      setAllAdmins([]);
    } finally {
      setIsSubmitting(false);
    }
  };

  // دالة غلق المودال
  const handleCloseAllAdminsModal = () => {
    setShowAllAdminsModal(false);
    setAllAdmins([]);
  };

  const [showModal, setShowModal] = useState(false);
  // حذف input الإيميل، واستخدام select
  const [unconfirmedAdmins, setUnconfirmedAdmins] = useState<Admin[]>([]);
  const [selectedAdminId, setSelectedAdminId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showmodel = async () => {
    setShowModal(true);
    try {
      setIsSubmitting(true);
      const response = await axios.get(authEndPoint.GetUnconfirmedAdmins, {
        headers: {
          Authorization: `Bearer ${
            localStorage.getItem("token") || sessionStorage.getItem("token")
          }`,
        },
      });
      const admins = Array.isArray(response.data.data)
        ? response.data.data
        : [];
      setUnconfirmedAdmins(admins);
    } catch (error) {
      setUnconfirmedAdmins([]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedAdminId("");
  };
  // دالة تنفيذ الموافقة
  const handleConfirmAdmin = async () => {
    if (!selectedAdminId) return;
    setIsSubmitting(true);
    try {
      await axios.post(
        `${authEndPoint.ConfirmAdmin(selectedAdminId)}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${
              localStorage.getItem("token") || sessionStorage.getItem("token")
            }`,
          },
        }
      );
      // تحديث القائمة بعد الموافقة
      const response = await axios.get(authEndPoint.GetUnconfirmedAdmins, {
        headers: {
          Authorization: `Bearer ${
            localStorage.getItem("token") || sessionStorage.getItem("token")
          }`,
        },
      });

      const admins: Admin[] = response.data.data || response.data;
      setUnconfirmedAdmins(admins);
      console.log(admins);
      setSelectedAdminId("");
      console.log(selectedAdminId);
      setShowModal(false);
      toast.success("تم تأكيد الأدمن بنجاح!");
    } catch (error) {
      toast.error("حدث خطأ أثناء تأكيد الأدمن!");
    } finally {
      setIsSubmitting(false);
    }
  };
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);
  const { userData }: any = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdmin = async () => {
      setLoading(true);
      try {
        const response = await axios.get(authEndPoint.GetAllAdmins, {
          headers: {
            Authorization: `Bearer ${
              localStorage.getItem("token") || sessionStorage.getItem("token")
            }`,
          },
        });
        const admins: Admin[] = response.data.data || response.data;
        // صفّي الأدمن الحالي بناءً على userId أو email من userData
        let currentAdmin = null;
        if (userData?.userId) {
          currentAdmin = admins.find((a) => a.Id === userData.userId);
        }
        if (!currentAdmin && userData?.email) {
          currentAdmin = admins.find((a) => a.Email === userData.email);
        }
        if (!currentAdmin) {
          currentAdmin = admins[0];
        }
        setAdmin(currentAdmin);
      } catch (error) {
        setAdmin(null);
      } finally {
        setLoading(false);
      }
    };
    fetchAdmin();
  }, [userData]);

  // تجهيز رابط الصورة
  let imageUrl = defaultAvatar;
  if (userData?.image) {
    imageUrl =
      userData.image && userData.image.startsWith("/")
        ? `${ImgURLBeasd}${userData.image}`
        : userData.image;
  }

  if (loading) {
    return (
      <div style={{ maxWidth: 420, margin: "40px auto", padding: 24 }}>
        <ShimmerPostItem title cta />
      </div>
    );
  }

  if (!admin) {
    return (
      <div style={{ textAlign: "center", marginTop: 60, color: "#888" }}>
        <p>تعذر تحميل بيانات الأدمن</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 420, margin: "40px auto", padding: 24 }}>
      <div
        style={{
          background: "#fff",
          borderRadius: 18,
          boxShadow: "0 4px 24px rgba(1,143,44,0.10)",
          padding: 32,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 18,
          position: "relative",
        }}
      >
        {/* Dropdown icon top left */}
        {userData.role === "SuperAdmin" && (
          <div style={{ position: "absolute", top: 18, left: 18 }}>
            <button
              onClick={() => setShowDropdown((prev) => !prev)}
              style={{
                background: "#018f2c",
                color: "#fff",
                border: "none",
                borderRadius: "50%",
                width: 33,
                height: 33,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 8px rgba(1,143,44,0.08)",
                cursor: "pointer",
                fontSize: 18,
                transition: "background 0.2s",
              }}
              aria-label="إجراءات الأدمن"
            >
              <FontAwesomeIcon icon={faList} />
            </button>
            {showDropdown && (
              <div
                id="admin-actions-dropdown"
                style={{
                  position: "absolute",
                  top: 54,
                  left: 0,
                  background: "#fff",
                  borderRadius: 12,
                  boxShadow: "0 4px 16px rgba(1,143,44,0.12)",
                  minWidth: 180,
                  padding: "10px 0",
                  zIndex: 100,
                  display: "flex",
                  flexDirection: "column",
                  gap: 0,
                  border: "1px solid #eee",
                }}
              >
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    showmodel();
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#018f2c",
                    padding: "12px 18px",
                    textAlign: "right",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: 15,
                    cursor: "pointer",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <FontAwesomeIcon icon={faCircleCheck} />
                  تاكيد أدمن جديد
                </button>
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    handleShowAllAdmins();
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#018f2c",
                    padding: "12px 18px",
                    textAlign: "right",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: 15,
                    cursor: "pointer",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <FontAwesomeIcon icon={faCircleUser} />
                  عرض المشرفين
                </button>
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    navigate("/admin/change-password");
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#018f2c",
                    padding: "12px 18px",
                    textAlign: "right",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontWeight: 700,
                    fontSize: 15,
                    cursor: "pointer",
                  }}
                >
                  <FontAwesomeIcon icon={faLock} style={{ marginLeft: 8 }} />{" "}
                  تغيير كلمة المرور
                </button>
              </div>
            )}
          </div>
        )}
        {/* ...existing code... */}
        <img
          src={imageUrl}
          alt="admin-avatar"
          style={{
            width: 96,
            height: 96,
            borderRadius: "50%",
            objectFit: "cover",
            border: "3px solid #009247",
            marginBottom: 12,
          }}
          onError={(e) => (e.currentTarget.src = defaultAvatar)}
        />
        <h2
          style={{ color: "#018f2c", fontWeight: 900, fontSize: 26, margin: 0 }}
        >
          {userData?.name || `${admin.FirstName} ${admin.LastName}` || "أدمن"}
        </h2>
        <div style={{ color: "#555", fontSize: 16, marginBottom: 8 }}>
          {userData?.email || admin.Email}
        </div>
        {admin.PhoneNumber && (
          <div style={{ color: "#888", fontSize: 15 }}>{admin.PhoneNumber}</div>
        )}
        {admin.City && (
          <div style={{ color: "#888", fontSize: 15 }}>{admin.City}</div>
        )}
      </div>
      {/* Modal for listing all admins */}
      {showAllAdminsModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={handleCloseAllAdminsModal}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 18,
              boxShadow: "0 8px 32px rgba(1,143,44,0.15)",
              padding: 32,
              minWidth: 400,
              maxWidth: 500,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 20,
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleCloseAllAdminsModal}
              style={{
                position: "absolute",
                top: 15,
                right: 15,
                background: "transparent",
                border: "none",
                fontSize: 20,
                color: "#666",
                cursor: "pointer",
                padding: 5,
              }}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <div style={{ textAlign: "center", marginBottom: 10 }}>
              <FontAwesomeIcon
                icon={faEnvelope}
                style={{ fontSize: 40, color: "#018f2c", marginBottom: 15 }}
              />
              <h2
                style={{
                  color: "#018f2c",
                  fontWeight: 700,
                  fontSize: 24,
                  margin: 0,
                }}
              >
                قائمة كل المشرفين
              </h2>
            </div>
            <div style={{ width: "100%", maxHeight: 300, overflowY: "auto" }}>
              {isSubmitting ? (
                <div style={{ textAlign: "center", color: "#888" }}>
                  جاري التحميل...
                </div>
              ) : allAdmins.length === 0 ? (
                <div style={{ textAlign: "center", color: "#888" }}>
                  لا يوجد مشرفين
                </div>
              ) : (
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {allAdmins.map((admin) => (
                    <li
                      key={admin.Id}
                      style={{
                        padding: "10px 0",
                        borderBottom: "1px solid #eee",
                        color: "#018f2c",
                        fontWeight: 500,
                        fontSize: 16,
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <FontAwesomeIcon icon={faLock} style={{ fontSize: 18 }} />
                      {admin.Email} - {admin.FirstName} {admin.LastName}
                      <button
                        onClick={() => handleUnconfirmAdmin(admin.Id)}
                        disabled={isSubmitting}
                        style={{
                          marginRight: 8,
                          background: "#ff4d4f",
                          color: "#fff",
                          border: "none",
                          borderRadius: 8,
                          padding: "6px 14px",
                          fontWeight: 700,
                          fontSize: 13,
                          cursor: isSubmitting ? "not-allowed" : "pointer",
                          transition: "background 0.2s",
                        }}
                      >
                        إزالة
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal for confirming admin */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={closeModal}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 18,
              boxShadow: "0 8px 32px rgba(1,143,44,0.15)",
              padding: 32,
              minWidth: 400,
              maxWidth: 500,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 20,
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              style={{
                position: "absolute",
                top: 15,
                right: 15,
                background: "transparent",
                border: "none",
                fontSize: 20,
                color: "#666",
                cursor: "pointer",
                padding: 5,
              }}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <div style={{ textAlign: "center", marginBottom: 10 }}>
              <FontAwesomeIcon
                icon={faEnvelope}
                style={{ fontSize: 40, color: "#009247", marginBottom: 15 }}
              />
              <h2
                style={{
                  color: "#018f2c",
                  fontWeight: 700,
                  fontSize: 24,
                  margin: 0,
                }}
              >
                إضافة أدمن جديد
              </h2>
              <p style={{ color: "#666", fontSize: 14, margin: "8px 0 0 0" }}>
                اختر البريد الإلكتروني للأدمن الجديد
              </p>
            </div>
            <div style={{ width: "100%" }}>
              <select
                value={selectedAdminId}
                onChange={(e) => setSelectedAdminId(e.target.value)}
                disabled={isSubmitting || unconfirmedAdmins.length === 0}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  border: "2px solid #e0e0e0",
                  borderRadius: 12,
                  fontSize: 16,
                  outline: "none",
                  transition: "border-color 0.2s",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#009247")}
                onBlur={(e) => (e.target.style.borderColor = "#e0e0e0")}
              >
                <option value="" disabled>
                  {unconfirmedAdmins.length === 0
                    ? "لا يوجد أدمنز غير مؤكدين"
                    : "اختر البريد الإلكتروني"}
                </option>
                {Array.isArray(unconfirmedAdmins) &&
                  unconfirmedAdmins.map((admin) => (
                    <option key={admin.Id} value={admin.Id}>
                      {admin.Email} - {admin.FirstName} {admin.LastName}
                    </option>
                  ))}
              </select>
            </div>
            <div style={{ display: "flex", gap: 12, width: "100%" }}>
              <button
                disabled={isSubmitting || !selectedAdminId}
                onClick={handleConfirmAdmin}
                style={{
                  flex: 1,
                  background:
                    isSubmitting || !selectedAdminId ? "#ccc" : "#009247",
                  color: "#fff",
                  border: "none",
                  borderRadius: 12,
                  padding: "14px 20px",
                  fontWeight: 700,
                  fontSize: 14,
                  cursor:
                    isSubmitting || !selectedAdminId
                      ? "not-allowed"
                      : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  boxShadow: "0 2px 8px rgba(1,143,44,0.08)",
                  transition: "all 0.2s",
                }}
              >
                {isSubmitting ? (
                  <>
                    <div
                      style={{
                        width: 16,
                        height: 16,
                        border: "2px solid #fff",
                        borderTop: "2px solid transparent",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite",
                      }}
                    />
                    جاري الإرسال...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faEnvelope} />
                    تأكيد الأدمن
                  </>
                )}
              </button>
              <button
                onClick={closeModal}
                disabled={isSubmitting}
                style={{
                  flex: 1,
                  background: "#fff",
                  color: "#009247",
                  border: "2px solid #009247",
                  borderRadius: 12,
                  padding: "14px 20px",
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  transition: "all 0.2s",
                  opacity: isSubmitting ? 0.5 : 1,
                }}
              >
                <FontAwesomeIcon icon={faTimes} />
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
