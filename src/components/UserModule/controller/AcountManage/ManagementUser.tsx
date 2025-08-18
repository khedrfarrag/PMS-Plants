import React, { useContext, useEffect, useState } from "react";
import Styles from "./style/style.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faIdBadge,
  faListAlt,
  faBoxOpen,
  faHeart,
  faComments,
  faHeadset,
  faLock,
} from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../../../../context/Context";
import axios from "axios";
import {
  authEndPoint,
  contactMessagesPoint,
  ImgURLBeasd,
  ordersPoint,
  ProductsPoint,
} from "../../../../constant/Const";
import { useNavigate } from "react-router-dom";

interface Userinfo{
City: string
Email:string 
FirstName:string 
Id: string
ImageUrl:string
LastName: string
PhoneNumber: string
}
export default function ManagementUser() {
  const { userData }: any = useContext(AuthContext);
  const [orders, setOrders] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<
    "orders" | "payments" | "messages" | null
  >(null);
  const navigate = useNavigate();
  const handletonavigate = (path: string) => {
    navigate(path);
  };
  const getallmessages = async () => {
    try {
      const response = await axios.get(
        contactMessagesPoint.ContactMessagesUserId(userData?.userId),
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}` },
        }
      );
      setMessages(response.data);
    } catch (errors) {
      setMessages([]);
    }
  };
const [userinfo,setuserinfo]=useState<Userinfo>()
  const getuserbyuserid = async () => {
    try {
      const response = await axios.get(authEndPoint.GetUserByUserId, {
        params: {
          UserId: userData?.userId,
        },
        headers: { Authorization: `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}` },
      });
      console.log(response.data.Data);
      setuserinfo(response.data.Data)
    } catch (errors) {
      console.log(errors);
    }
  };
  const getallorders = async () => {
    try {
      const response = await axios.get(ordersPoint.GetOrdersUser, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}`,
        },
      });
      setOrders(response.data);
    } catch (errors) {
      console.log(errors);
    }
  };

  // Helper to format date as يوم/شهر - ساعة:دقيقة AM/PM
  const formatOrderDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const isPM = hours >= 12;
    let displayHours = hours % 12;
    if (displayHours === 0) displayHours = 12;
    const ampm = isPM ? "م" : "ص";
    return `${day}/${month} - ${String(displayHours).padStart(
      2,
      "0"
    )}:${minutes} ${ampm}`;
  };

  // Popup render logic
  const renderModalContent = () => {
    if (modalType === "orders") {
      return (
        <div className={Styles.modalContentBox}>
          <h3 className={Styles.modalTitle}>تفاصيل الطلبات</h3>
          <div className={Styles.ordersList}>
            {orders.length === 0 && <div>لا يوجد طلبات</div>}
            {orders.map((order) => (
              <div key={order.Id} className={Styles.orderCard}>
                <div>
                  <b>رقم الطلب:</b> {order.Id}
                </div>
                <div>
                  <b>تاريخ الطلب:</b> {formatOrderDate(order.OrderDate)}
                </div>
                <div>
                  <b>حالة الدفع:</b> {order.PaymentStatus}
                </div>
                <div>
                  <b>إجمالي السعر:</b> {order.TotalPrice} جنيه
                </div>
                <div>
                  <b>إجمالي الكمية:</b> {order.TotalQuantity}
                </div>
                <div className={Styles.orderItemsBox}>
                  <b>المنتجات:</b>
                  <ul>
                    {order.OrderItems.map((item: any, idx: number) => (
                      <li key={idx} className={Styles.orderItemRow}>
                        <span>
                          {productNames[item.ProductId]
                            ? productNames[item.ProductId]
                            : `جاري التحميل... (${item.ProductId})`}
                        </span>
                        <span>الكمية: {item.Quantity}</span>
                        <span>السعر: {item.Price}</span>
                        <span>الإجمالي: {item.TotalPrice}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    } else if (modalType === "payments") {
      return (
        <div className={Styles.modalContentBox}>
          <h3 className={Styles.modalTitle}>مدفوعاتك</h3>
          <div className={Styles.ordersList}>
            {orders.length === 0 && <div>لا يوجد مدفوعات</div>}
            {orders.map((order) => (
              <div key={order.Id} className={Styles.orderCard}>
                <div>
                  <b>رقم الطلب:</b> {order.Id}
                </div>
                <div>
                  <b>تاريخ الطلب:</b> {formatOrderDate(order.OrderDate)}
                </div>
                <div>
                  <b>إجمالي المدفوع:</b> {order.TotalPrice} جنيه
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    } else if (modalType === "messages") {
      return (
        <div className={Styles.modalContentBox}>
          <h3 className={Styles.modalTitle}>رسائلك</h3>
          <div className={Styles.ordersList}>
            {messages.length === 0 && <div>لا يوجد رسائل</div>}
            {messages.map((msg: any) => (
              <div key={msg.Id} className={Styles.orderCard}>
                <div>
                  <b>الاسم:</b> {msg.Name}
                </div>
                <div>
                  <b>الرسالة:</b> {msg.Message}
                </div>
                <div>
                  <b>الوقت:</b> {formatOrderDate(msg.SentAt)}
                </div>
                <div>
                  <b>الحالة:</b>{" "}
                  <span
                    style={{
                      color: msg.IsRead ? "#009247" : "#d9534f",
                      fontWeight: "bold",
                    }}
                  >
                    {msg.IsRead ? "مقروءة" : "غير مقروءة"}
                  </span>
                </div>
                <div>
                  <b>نوع المستخدم:</b> {msg.User_type}
                </div>
                <div>
                  <b>نوع الخدمة:</b> {msg.Service_type}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };
  // كاش أسماء المنتجات
  const [productNames, setProductNames] = useState<{ [id: number]: string }>(
    {}
  );
  // جلب اسم منتج واحد وتخزينه في الكاش
  const fetchProductName = async (productId: number) => {
    if (productNames[productId]) return; // موجود بالفعل
    try {
      const response = await axios.get(ProductsPoint.GetProductId(productId), {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}`,
        },
      });
      setProductNames((prev) => ({ ...prev, [productId]: response.data.Name }));
    } catch (errors) {
      setProductNames((prev) => ({
        ...prev,
        [productId]: `منتج رقم ${productId}`,
      }));
    }
  };
  // عند فتح مودال الطلبات: جلب كل أسماء المنتجات الفريدة
  useEffect(() => {
    if (showModal && modalType === "orders" && orders.length > 0) {
      // استخرج كل ProductId فريد من جميع الطلبات
      const ids = new Set<number>();
      orders.forEach((order) => {
        order.OrderItems.forEach((item: any) => ids.add(item.ProductId));
      });
      // جلب الأسماء غير الموجودة في الكاش
      Array.from(ids).forEach((id) => {
        if (!productNames[id]) fetchProductName(id);
      });
    }
    // eslint-disable-next-line
  }, [showModal, modalType, orders]);
  useEffect(() => {
    getallorders();
    getallmessages();
    getuserbyuserid(); 
  }, []);

  return (
    <div className={Styles.managementUser}>
      <div className={Styles.mainGrid}>
        {/* بيانات المستخدم */}
        
        <div key={userinfo?.Id} className={Styles.userInfoCard}>
          <div className={Styles.userInfoHeader}>
            <span className={Styles.userId}>
              <FontAwesomeIcon icon={faIdBadge} />
              {userinfo?.FirstName } {userinfo?.LastName}
            </span>
            <img
              src={
                `${ImgURLBeasd}/${userinfo?.ImageUrl}`
              }
              alt="user"
              className={Styles.userAvatar}
            />
          </div>
          <div className={Styles.userInfoBody}>
            <div className={Styles.userInfoRow}>
              <FontAwesomeIcon icon={faEnvelope} />
              <span>{userinfo?.Email}</span>
            </div>
            <div className={Styles.userInfoRow}>
              <FontAwesomeIcon icon={faPhone} />
              <span>{userinfo?.PhoneNumber || "---"}</span>
            </div>
            <div className={Styles.userInfoRow}>
              <FontAwesomeIcon icon={faMapMarkerAlt} />
              <span>{userinfo?.City}</span>
            </div>
          </div>
        </div>
       
      </div>
      {/* شبكة الخدمات */}
      <div className={Styles.servicesGrid}>
        <div
          className={Styles.serviceCard}
          onClick={() => {
            setModalType("payments");
            setShowModal(true);
          }}
        >
          <span className={Styles.serviceIcon}>
            <FontAwesomeIcon icon={faListAlt} />
          </span>
          <span>مدفوعاتك</span>
        </div>
        <div
          className={Styles.serviceCard}
          onClick={() => {
            setModalType("orders");
            setShowModal(true);
          }}
        >
          <span className={Styles.serviceIcon}>
            <FontAwesomeIcon icon={faBoxOpen} />
          </span>
          <span>طلباتك</span>
        </div>
        <div className={Styles.serviceCard}>
          <span className={Styles.serviceIcon}>
            <FontAwesomeIcon icon={faLock} />
          </span>
          <span>تسجيل الدخول والأمان</span>
        </div>
        <div
          className={Styles.serviceCard}
          onClick={() => handletonavigate("/contact-us")}
        >
          <span className={Styles.serviceIcon}>
            <FontAwesomeIcon icon={faHeadset} />
          </span>
          <span>اتصل بنا</span>
        </div>
        <div
          className={Styles.serviceCard}
          onClick={async () => {
            await getallmessages();
            setModalType("messages");
            setShowModal(true);
          }}
        >
          <span className={Styles.serviceIcon}>
            <FontAwesomeIcon icon={faComments} />
          </span>
          <span>رسائلك</span>
        </div>
        <div
          className={Styles.serviceCard}
          onClick={() => handletonavigate("/favorites")}
        >
          <span className={Styles.serviceIcon}>
            <FontAwesomeIcon icon={faHeart} />
          </span>
          <span>المفضلات</span>
        </div>
      </div>
      {/* Popup Modal */}
      {showModal && (
        <div
          className={Styles.modalOverlay}
          onClick={() => setShowModal(false)}
        >
          <div className={Styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <button
              className={Styles.closeModalBtn}
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>
            {renderModalContent()}
          </div>
        </div>
      )}
    </div>
  );
}
