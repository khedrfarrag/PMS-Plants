import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowAltCircleRight,
  faSpinner,
  faStar,
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faUser,
  faShoppingCart,
  faHeart,
  faComments,
  faStar as faStarSolid,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import {
  authEndPoint,
  ordersPoint,
  ProductsPoint,
  contactMessagesPoint,
  siteFeedbackPoint,
  ImgURLBeasd,
} from "../../../../constant/Const";
import { motion } from "framer-motion";
import imgiuser from "../../../../assets/svg/userimg.svg";
// Replaced shimmer components with simple placeholders for compatibility
import { useMediaQuery } from "@mui/material";

interface User {
  Id: string;
  FirstName: string;
  LastName: string;
  Email: string;
  City: string;
  PhoneNumber: string;
}

interface Order {
  Id: string;
  UserId: string;
  TotalPrice: number;
  OrderDate: string;
  PaymentStatus: string;
  TotalQuantity: number;
  OrderItems: any[];
}

interface Favorite {
  Id: number;
  Name: string;
  Price: number;
  ImageUrl: string;
  DiscountPercentage: number;
}

interface Message {
  Id: number;
  Name: string;
  Email: string;
  Subject: string;
  Message: string;
  CreatedAt: string;
}

interface Feedback {
  Id: number;
  UserName: string;
  UserId: string;
  Rating: number;
  Comment: string;
  CreatedAt: string;
}
// أضف الواجهات في الأعلى
interface ProductFeedback {
  FeedBackId: number;
  UserId: string;
  Rate: number;
  Comment: string;
  CreatedAt: string;
}

interface Product {
  Id: number;
  Name: string;
  Description: string;
  StockStatuses: string;
  StockQuantity: number;
  Price: number;
  Rate: number;
  SubCategoryId: number | null;
  CategoryId: number;
  DiscountPercentage: number;
  DiscountedPrice: number;
  ImageUrl: string;
  Title1: string;
  Body1: string;
  Title2: string;
  Body2: string;
  ProductFeedbacks: ProductFeedback[];
}

function UserInfo() {
  const { id } = useParams<{ id: string }>();
  const userId = id; // استخدام id من الـ route parameter
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:768px)');
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("orders");
  const [userProductFeedbacks, setUserProductFeedbacks] = useState<any[]>([]);

  console.log('=== UserInfo Debug ===');
  console.log('id from useParams:', id);
  console.log('userId after assignment:', userId);
  console.log('typeof userId:', typeof userId);
  console.log('window.location.pathname:', window.location.pathname);
  console.log('=====================');

  // جلب بيانات المستخدم
  const getUserData = async () => {
    if (!userId) return;
    
    try {
      console.log('Fetching user data for userId:', userId);
      const response = await axios.get(`${authEndPoint.GetAllUsers}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}` },
        params: { pageNumber: 1, pageSize: 1000 }
      });
      console.log('All users response:', response.data);
      
      const userData = response.data.data.find((u: User) => u.Id === userId);
      console.log('Found user data:', userData);
      setUser(userData || null);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // جلب طلبات المستخدم
  const getUserOrders = async () => {
    if (!userId) return;
    
    try {
      console.log('Fetching orders for userId:', userId);
      const response = await axios.get(ordersPoint.GetAllOrders, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}` },
        params: { pageNumber: 1, pageSize: 1000 }
      });
      console.log('All orders response:', response.data);
      
      const userOrders = response.data.data.filter((order: Order) => order.UserId === userId);
      console.log('User orders:', userOrders);
      setOrders(userOrders);
    } catch (error) {
      console.error("Error fetching user orders:", error);
    }
  };

  // جلب المنتجات المفضلة
  const getUserFavorites = async () => {
    if (!userId) return;
    
    try {
      console.log('Fetching favorites for userId:', userId);
      const response = await axios.get(ProductsPoint.GetFavorites(userId, 1, 100), {
        headers: { Authorization: `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}` }
      });
      console.log('Favorites response:', response.data);
      setFavorites(response.data.data || []);
    } catch (error) {
      console.error("Error fetching user favorites:", error);
      setFavorites([]);
    }
  };

  // جلب رسائل المستخدم - استخدام الـ endpoint الصحيح
  const getUserMessages = async () => {
    if (!userId) return;
    
    try {
      console.log('Fetching messages for userId:', userId);
      // استخدام الـ endpoint المخصص لجلب رسائل المستخدم
      const response = await axios.get(contactMessagesPoint.ContactMessagesUserId(userId), {
        headers: { Authorization: `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}` }
      });
      console.log('User messages response:', response.data);
      setMessages(response.data || []);
    } catch (error) {
      console.error("Error fetching user messages:", error);
      setMessages([]);
    }
  };

  // جلب تعليقات المستخدم
  const getUserFeedbacks = async () => {
    if (!userId) return;
    
    try {
      console.log('Fetching feedbacks for userId:', userId);
      const response = await axios.get(siteFeedbackPoint.Get, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}` },
        params: { pageNumber: 1, pageSize: 1000 }
      });
      console.log('All feedbacks response:', response.data);
      
      const userFeedbacks = response.data.data.filter((fb: Feedback) => fb.UserId === userId);
      console.log('User feedbacks:', userFeedbacks);
      setFeedbacks(userFeedbacks);
    } catch (error) {
      console.error("Error fetching user feedbacks:", error);
      setFeedbacks([]);
    }
  };

  // دالة لجلب كل المنتجات وجمع تعليقات المستخدم
  const getAllProductsAndUserFeedbacks = async () => {
    if (!userId) return;
    try {
      // استبدل هذا الرابط بالـ endpoint الصحيح لجلب كل المنتجات
      const response = await axios.get(ProductsPoint.GetAllProducts, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}` }
      });
      const products: Product[] = response.data.data || [];
      const feedbacks = products.flatMap(product =>
        (product.ProductFeedbacks || [])
          .filter(feedback => feedback.UserId === userId)
          .map(feedback => ({
            ...feedback,
            ProductName: product.Name,
            ProductId: product.Id,
            ProductImage: product.ImageUrl
          }))
      );
      setUserProductFeedbacks(feedbacks);
    } catch (error) {
      setUserProductFeedbacks([]);
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      if (!userId) {
        console.log('No userId provided');
        setLoading(false);
        return;
        }
      setLoading(true);
      console.log('Starting to fetch all data for userId:', userId);
      try {
        await Promise.all([
          getUserData(),
          getUserOrders(),
          getUserFavorites(),
          getUserMessages(),
          getUserFeedbacks(),
        ]);
        // جلب تعليقات المستخدم على المنتجات
        await getAllProductsAndUserFeedbacks();
      } catch (error) {
        console.error('Error in fetchAllData:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, [userId]);

  // إزالة useEffect الثاني لأننا لا نحتاجه بعد الآن

  // عرض النجوم
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FontAwesomeIcon
          key={i}
          icon={i <= rating ? faStarSolid : faStar}
          style={{
            color: i <= rating ? "#FFD700" : "#e0e0e0",
            fontSize: "16px"
          }}
        />
      );
    }
    return stars;
  };

  // تنسيق التاريخ
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // حالة الطلب
  const getOrderStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return { bg: "#d4edda", color: "#155724", text: "تم الدفع" };
      case "pending":
        return { bg: "#fff3cd", color: "#856404", text: "في الانتظار" };
      case "failed":
        return { bg: "#f8d7da", color: "#721c24", text: "فشل" };
      default:
        return { bg: "#e2e3e5", color: "#383d41", text: status };
    }
  };

  if (!userId) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          backgroundColor: '#f8f9fa',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '40px',
          color: '#ccc'
        }}>
          ⚠️
        </div>
        <p style={{ color: '#666', fontSize: '18px', fontWeight: '500' }}>
          لم يتم تحديد المستخدم
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ padding: isMobile ? '12px' : '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <div className="placeholder-glow" style={{ marginBottom: 24 }}>
          <span className="placeholder col-6" style={{ height: 28 }}></span>
        </div>
        <div className="row g-2" style={{ marginBottom: 16 }}>
          {Array.from({ length: isMobile ? 2 : 4 }).map((_, i) => (
            <div key={i} className={isMobile ? 'col-6' : 'col-3'}>
              <div className="placeholder d-block w-100" style={{ height: 60, borderRadius: 12 }}></div>
            </div>
          ))}
        </div>
        <div className="row g-2" style={{ marginBottom: 16 }}>
          {Array.from({ length: isMobile ? 2 : 4 }).map((_, i) => (
            <div key={i} className={isMobile ? 'col-6' : 'col-3'}>
              <div className="placeholder d-block w-100" style={{ height: 36, borderRadius: 10 }}></div>
            </div>
          ))}
        </div>
        <div className="placeholder-glow" style={{ minHeight: 200 }}>
          <span className="placeholder col-12" style={{ height: 120 }}></span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          backgroundColor: '#f8f9fa',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '40px',
          color: '#ccc'
        }}>
          👤
        </div>
        <p style={{ color: '#666', fontSize: '18px', fontWeight: '500' }}>
          لم يتم العثور على المستخدم
        </p>
        <p style={{ color: '#999', fontSize: '14px' }}>
          userId: {userId}
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: isMobile ? '12px' : '20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <motion.div
        style={{
          width: '100%',
          background: '#fff',
          borderRadius: '18px',
          boxShadow: '0 2px 12px rgba(1,143,44,0.06)',
          padding: isMobile ? '16px 16px 12px 16px' : '24px 32px 18px 32px',
          margin: '0 auto 32px auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          minHeight: 70,
          flexDirection: 'row-reverse',
        }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2
          style={{
            fontWeight: 900,
            fontSize: isMobile ? 24 : 32,
            color: '#222',
            margin: 0,
            letterSpacing: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <span style={{ color: '#018f2c', fontSize: isMobile ? 28 : 34 }}>👤</span>
        </h2>
        <button
          onClick={() => navigate("/admin/users-list")}
          style={{
            background: '#fff',
            color: '#018f2c',
            border: '1.5px solid #018f2c',
            borderRadius: 12,
            padding: isMobile ? '6px 18px' : '8px 28px',
            fontWeight: 700,
            fontSize: isMobile ? 14 : 18,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(1,143,44,0.06)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            transition: 'background 0.2s, color 0.2s',
          }}
          aria-label="رجوع"
        >
          <FontAwesomeIcon icon={faArrowAltCircleRight} style={{ fontSize: isMobile ? 18 : 22, marginLeft: 0 }} />
        </button>
      </motion.div>

      {/* User Basic Info */}
      <motion.div
        style={{
          background: '#fff',
          borderRadius: '16px',
          padding: isMobile ? '16px' : '24px',
          marginBottom: '24px',
          boxShadow: '0 4px 20px rgba(0, 146, 71, 0.08)',
          border: '1px solid #f0f0f0'
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h3 style={{ color: '#009247', marginBottom: '20px', fontWeight: 700, fontSize: isMobile ? 18 : 20 }}>
          <FontAwesomeIcon icon={faUser} style={{ marginLeft: 8, fontSize: isMobile ? 16 : 18 }} />
          البيانات الأساسية
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(auto-fit, minmax(${isMobile ? 180 : 250}px, 1fr))`,
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <FontAwesomeIcon icon={faUser} style={{ color: '#009247', fontSize: isMobile ? 16 : 18 }} />
            <div>
              <p style={{ margin: 0, color: '#666', fontSize: isMobile ? 12 : 14 }}>الاسم</p>
              <p style={{ margin: 0, fontWeight: 600, color: '#222', fontSize: isMobile ? 14 : 16 }}>
                {user.FirstName} {user.LastName}
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <FontAwesomeIcon icon={faEnvelope} style={{ color: '#009247', fontSize: isMobile ? 16 : 18 }} />
            <div>
              <p style={{ margin: 0, color: '#666', fontSize: isMobile ? 12 : 14 }}>البريد الإلكتروني</p>
              <p style={{ margin: 0, fontWeight: 600, color: '#222', fontSize: isMobile ? 14 : 16, overflowWrap: 'anywhere', wordBreak: 'break-word' }}>{user.Email}</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <FontAwesomeIcon icon={faPhone} style={{ color: '#009247', fontSize: isMobile ? 16 : 18 }} />
            <div>
              <p style={{ margin: 0, color: '#666', fontSize: isMobile ? 12 : 14 }}>رقم الهاتف</p>
              <p style={{ margin: 0, fontWeight: 600, color: '#222', fontSize: isMobile ? 14 : 16 }}>{user.PhoneNumber}</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <FontAwesomeIcon icon={faMapMarkerAlt} style={{ color: '#009247', fontSize: isMobile ? 16 : 18 }} />
            <div>
              <p style={{ margin: 0, color: '#666', fontSize: isMobile ? 12 : 14 }}>العنوان</p>
              <p style={{ margin: 0, fontWeight: 600, color: '#222', fontSize: isMobile ? 14 : 16 }}>{user.City}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        style={{
          background: '#fff',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 4px 20px rgba(0, 146, 71, 0.08)',
          border: '1px solid #f0f0f0'
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: isMobile ? '16px' : '24px',
          flexWrap: 'wrap'
        }}>
          {[
            { id: "orders", label: "الطلبات", icon: faShoppingCart, count: orders.length },
            { id: "favorites", label: "المفضلة", icon: faHeart, count: favorites.length },
            { id: "messages", label: "الرسائل", icon: faEnvelope, count: messages.length },
            { id: "feedbacks", label: "تعليقات الموقع", icon: faComments, count: feedbacks.length },
            { id: "productFeedbacks", label: "تعليقات المنتجات", icon: faComments, count: userProductFeedbacks.length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: activeTab === tab.id ? '#009247' : '#f8f9fa',
                color: activeTab === tab.id ? '#fff' : '#666',
                border: 'none',
                borderRadius: '12px',
                padding: isMobile ? '10px 14px' : '12px 20px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: isMobile ? 13 : 14,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                transition: 'all 0.2s',
                minWidth: isMobile ? '100px' : '120px',
                justifyContent: 'center'
              }}
            >
              <FontAwesomeIcon icon={tab.icon} />
              {tab.label}
              <span style={{
                background: activeTab === tab.id ? 'rgba(255,255,255,0.2)' : '#e9ecef',
                color: activeTab === tab.id ? '#fff' : '#666',
                borderRadius: '50%',
                width: isMobile ? '18px' : '20px',
                height: isMobile ? '18px' : '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: isMobile ? 11 : 12,
                fontWeight: 700
              }}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{ minHeight: '400px' }}>
          {activeTab === "orders" && (
            <div>
              <h4 style={{ color: '#009247', marginBottom: '20px', fontWeight: 700 }}>
                <FontAwesomeIcon icon={faShoppingCart} style={{ marginLeft: 8 }} />
                طلبات المستخدم ({orders.length})
              </h4>
              {orders.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '40px',
                  color: '#666'
                }}>
                  لا توجد طلبات لهذا المستخدم
                </div>
              ) : (
                <div style={{
                  display: 'grid',
                  gap: '16px'
                }}>
                  {orders.map((order) => (
                    <div
                      key={order.Id}
                      style={{
                        border: '1px solid #e9ecef',
                        borderRadius: '12px',
                        padding: '16px',
                        background: '#fafafa'
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '12px',
                        flexWrap: 'wrap',
                        gap: '8px'
                      }}>
                        <div>
                          <strong>طلب رقم: {order.Id}</strong>
                          <p style={{ margin: '4px 0 0 0', color: '#666', fontSize: 14 }}>
                            {formatDate(order.OrderDate)}
                          </p>
                        </div>
                        <div style={{
                          background: getOrderStatusColor(order.PaymentStatus).bg,
                          color: getOrderStatusColor(order.PaymentStatus).color,
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: 12,
                          fontWeight: 600
                        }}>
                          {getOrderStatusColor(order.PaymentStatus).text}
                        </div>
                        <div style={{ textAlign: 'left' }}>
                          <strong style={{ color: '#009247' }}>
                            ${order.TotalPrice.toFixed(2)}
                          </strong>
                          <p style={{ margin: '4px 0 0 0', color: '#666', fontSize: 14 }}>
                            {order.TotalQuantity} منتج
                          </p>
                        </div>
                      </div>
                      {order.OrderItems && order.OrderItems.length > 0 && (
                        <div style={{
                          borderTop: '1px solid #e9ecef',
                          paddingTop: '12px',
                          marginTop: '12px'
                        }}>
                          <strong style={{ fontSize: 14, color: '#666' }}>المنتجات:</strong>
                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: '8px',
                            marginTop: '8px'
                          }}>
                            {order.OrderItems.map((item, index) => (
                              <div
                                key={index}
                                style={{
                                  background: '#fff',
                                  padding: '8px',
                                  borderRadius: '8px',
                                  border: '1px solid #e9ecef'
                                }}
                              >
                                <div style={{ fontWeight: 600, fontSize: 14 }}>
                                  {item.ProductName || `منتج ${index + 1}`}
                                </div>
                                <div style={{ color: '#666', fontSize: 12 }}>
                                  الكمية: {item.Quantity} | السعر: ${item.Price?.toFixed(2) || '0.00'}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "favorites" && (
            <div>
              <h4 style={{ color: '#009247', marginBottom: '20px', fontWeight: 700 }}>
                <FontAwesomeIcon icon={faHeart} style={{ marginLeft: 8 }} />
                المنتجات المفضلة ({favorites.length})
              </h4>
              {favorites.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '40px',
                  color: '#666'
                }}>
                  لا توجد منتجات مفضلة لهذا المستخدم
                </div>
              ) : (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                  gap: '16px'
                }}>
                  {favorites.map((product) => (
                    <div
                      key={product.Id}
                      style={{
                        border: '1px solid #e9ecef',
                        borderRadius: '12px',
                        padding: '16px',
                        background: '#fff',
                        transition: 'transform 0.2s, box-shadow 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,146,71,0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                      }}>
                        <img
                          src={product.ImageUrl ? `${ImgURLBeasd}/${product.ImageUrl}` : imgiuser}
                          alt={product.Name}
                          style={{
                            width: '60px',
                            height: '60px',
                            objectFit: 'cover',
                            borderRadius: '8px'
                          }}
                          onError={(e) => {
                            e.currentTarget.src = imgiuser;
                          }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, marginBottom: '4px' }}>
                            {product.Name}
                          </div>
                          <div style={{ color: '#009247', fontWeight: 700 }}>
                            ${product.Price.toFixed(2)}
                          </div>
                          {product.DiscountPercentage > 0 && (
                            <div style={{
                              background: '#ffe6e6',
                              color: '#dc3545',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontSize: 12,
                              fontWeight: 600,
                              display: 'inline-block',
                              marginTop: '4px'
                            }}>
                              خصم {product.DiscountPercentage}%
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "messages" && (
            <div>
              <h4 style={{ color: '#009247', marginBottom: '20px', fontWeight: 700 }}>
                <FontAwesomeIcon icon={faEnvelope} style={{ marginLeft: 8 }} />
                الرسائل ({messages.length})
              </h4>
              {messages.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '40px',
                  color: '#666'
                }}>
                  لا توجد رسائل لهذا المستخدم
                </div>
              ) : (
                <div style={{
                  display: 'grid',
                  gap: '16px'
                }}>
                  {messages.map((message) => (
                    <div
                      key={message.Id}
                      style={{
                        border: '1px solid #e9ecef',
                        borderRadius: '12px',
                        padding: '16px',
                        background: '#fff'
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '12px',
                        flexWrap: 'wrap',
                        gap: '8px'
                      }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, marginBottom: '4px' }}>
                            {message.Subject}
                          </div>
                          <div style={{ color: '#666', fontSize: 14 }}>
                            من: {message.Name} ({message.Email})
                          </div>
                        </div>
                        <div style={{ color: '#666', fontSize: 12 }}>
                          {formatDate(message.CreatedAt)}
                        </div>
                      </div>
                      <div style={{
                        background: '#f8f9fa',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid #e9ecef'
                      }}>
                        {message.Message}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "feedbacks" && (
            <div>
              <h4 style={{ color: '#009247', marginBottom: '20px', fontWeight: 700 }}>
                <FontAwesomeIcon icon={faComments} style={{ marginLeft: 8 }} />
                التعليقات ({feedbacks.length})
              </h4>
              {feedbacks.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '40px',
                  color: '#666'
                }}>
                  لا توجد تعليقات لهذا المستخدم
                </div>
              ) : (
                <div style={{
                  display: 'grid',
                  gap: '16px'
                }}>
                  {feedbacks.map((feedback) => (
                    <div
                      key={feedback.Id}
                      style={{
                        border: '1px solid #e9ecef',
                        borderRadius: '12px',
                        padding: '16px',
                        background: '#fff'
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '12px',
                        flexWrap: 'wrap',
                        gap: '8px'
                      }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, marginBottom: '8px' }}>
                            {feedback.UserName}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {renderStars(feedback.Rating)}
                            <span style={{ color: '#666', fontSize: 14 }}>
                              ({feedback.Rating}/5)
                            </span>
                          </div>
                        </div>
                        <div style={{ color: '#666', fontSize: 12 }}>
                          {formatDate(feedback.CreatedAt)}
                        </div>
                      </div>
                      <div style={{
                        background: '#f8f9fa',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid #e9ecef',
                        lineHeight: 1.5
                      }}>
                        {feedback.Comment}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {activeTab === "productFeedbacks" && (
            <div>
              <h4 style={{ color: '#009247', marginBottom: '20px', fontWeight: 700 }}>
                <FontAwesomeIcon icon={faComments} style={{ marginLeft: 8 }} />
                تعليقات المستخدم على المنتجات ({userProductFeedbacks.length})
              </h4>
              {userProductFeedbacks.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                  لا توجد تعليقات على المنتجات لهذا المستخدم
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '16px' }}>
                  {userProductFeedbacks.map((feedback, idx) => (
                    <div key={idx} style={{
                      border: '1px solid #e9ecef',
                      borderRadius: '12px',
                      padding: '16px',
                      background: '#fff'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                        <img src={feedback.ProductImage} alt={feedback.ProductName} style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover' }} />
                        <div>
                          <div style={{ fontWeight: 700 }}>{feedback.ProductName}</div>
                          <div style={{ color: '#666', fontSize: 13 }}>منتج رقم: {feedback.ProductId}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <span style={{ color: '#FFD700', fontWeight: 700 }}>{'★'.repeat(feedback.Rate)}</span>
                        <span style={{ color: '#666', fontSize: 13 }}>({feedback.Rate}/5)</span>
                      </div>
                      <div style={{ color: '#222', marginBottom: 8 }}>{feedback.Comment}</div>
                      <div style={{ color: '#999', fontSize: 12 }}>{new Date(feedback.CreatedAt).toLocaleString('ar-EG')}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default UserInfo;
