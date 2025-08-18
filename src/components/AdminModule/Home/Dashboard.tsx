import Style from "./Dashboard.module.css";
import dashLogo1 from "../../../assets/svg/dashsvg/Dash1.svg";
import Logoacceptcart from "../../../assets/svg/dashsvg/Logoacceptcart.svg";
import userimg from "../../../assets/svg/dashsvg/userimg.svg";
import imgproduct from "../../../assets/svg/dashsvg/image-product.svg";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Cards from "../../shared/utils/Cards";
import axios from "axios";
import { ImgURLBeasd, ordersPoint, ProductsPoint, authEndPoint, pagenation } from "../../../constant/Const";
import ChartsModel from "./Chartsmodel/Charts";
import { useNavigate } from "react-router-dom";
import { ShimmerSimpleGallery, ShimmerPostItem, ShimmerTable } from "react-shimmer-effects";


interface userinfo {
 data:{
   Id: number;
   FirstName: string;
   City: string;
  LastName: string;
  Email: string;
  PhoneNumber: string;
},
  pagination: {
    CurrentPage: number;
    PageSize: number;
    TotalCount: number;
    TotalPages: number;
  };
}

// إضافة interface للطلبات الأخيرة مع بيانات المستخدم
interface RecentOrderWithUser {
  Id: string;
  UserId: string;
  OrderDate: string;
  TotalPrice: number;
  PaymentStatus: "Paid" | "Pending" | "Cancelled";
  User: {
    Id: number;
    FirstName: string;
    LastName: string;
    Email: string;
    PhoneNumber: string;
  };
}

// إضافة interface للمنتجات المدفوعة مع معلومات المنتج
interface PaidProduct {
  Id: number;
  Name: string;
  Price: number;
  DiscountedPrice: number;
  ImageUrl: string;
  TotalQuantity: number;
  TotalRevenue: number;
}


const getallOrdersPaid = async () => {
  try {
    let allPaidOrders: any[] = [];
    let pageNumber = 1;
    const pageSize = 50;
    let totalPages = 1;
    do {
      const response = await axios.get(ordersPoint.GetAllOrders, {
        params: { pageNumber, pageSize },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}`,
        },
      });
      if (!response.data || !response.data.data) break;
      // فلترة الطلبات المدفوعة فقط
      const paidOrders = response.data.data.filter((order: any) => 
        order.PaymentStatus === "Paid" && order.OrderItems && order.OrderItems.length > 0
      );
      allPaidOrders = allPaidOrders.concat(paidOrders);
      // pagination info
      totalPages = response.data.pagination?.TotalPages || 1;
      pageNumber++;
    } while (pageNumber <= totalPages);

    console.log("ALL PAID ORDERS:", allPaidOrders);

    if (allPaidOrders.length === 0) {
      return [];
    }

    // تجميع المنتجات المدفوعة مع حساب الإيرادات
    const paidProductsMap = new Map<number, PaidProduct>();
    allPaidOrders.forEach((order: any) => {
      order.OrderItems.forEach((item: any) => {
        if (item.ProductId && item.Quantity && item.TotalPrice) {
          if (paidProductsMap.has(item.ProductId)) {
            const existing = paidProductsMap.get(item.ProductId)!;
            existing.TotalQuantity += item.Quantity;
            existing.TotalRevenue += item.TotalPrice;
          } else {
            paidProductsMap.set(item.ProductId, {
              Id: item.ProductId,
              Name: "", // سيتم ملؤها لاحقاً
              Price: item.Price || 0,
              DiscountedPrice: item.Price || 0,
              ImageUrl: "", // سيتم ملؤها لاحقاً
              TotalQuantity: item.Quantity,
              TotalRevenue: item.TotalPrice,
            });
          }
        }
      });
    });

    // جلب معلومات المنتجات
    const productIds = Array.from(paidProductsMap.keys());
    let allProducts: any[] = [];
    if (productIds.length > 0) {
      try {
        // جلب كل المنتجات من جميع الصفحات
        let productPage = 1;
        const productPageSize = 5000;
        let productTotalPages = 1;
        do {
          const productsResponse = await axios.get(ProductsPoint.GetAllProducts, {
            params: { pageNumber: productPage, pageSize: productPageSize },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}`,
            },
          });
          const pageProducts = productsResponse.data.data || productsResponse.data;
          if (Array.isArray(pageProducts)) {
            allProducts = allProducts.concat(pageProducts);
          }
          productTotalPages = productsResponse.data.pagination?.TotalPages || 1;
          productPage++;
        } while (productPage <= productTotalPages);
        console.log("All Products:", allProducts);
        // ملء معلومات المنتجات
        productIds.forEach(productId => {
          const product = allProducts.find((p: any) => p.Id === productId);
          if (product && paidProductsMap.has(productId)) {
            const paidProduct = paidProductsMap.get(productId)!;
            paidProduct.Name = product.Name || "منتج غير معروف";
            paidProduct.ImageUrl = product.ImageUrl || "";
            paidProduct.DiscountedPrice = product.DiscountedPrice || product.Price || paidProduct.Price;
          } else if (paidProductsMap.has(productId)) {
            console.log("ProductId not found:", productId);
          }
        });
      } catch (productError) {
        console.error("Error fetching product details:", productError);
        // إذا فشل جلب تفاصيل المنتجات، استخدم البيانات الأساسية
        productIds.forEach(productId => {
          if (paidProductsMap.has(productId)) {
            const paidProduct = paidProductsMap.get(productId)!;
            paidProduct.Name = `منتج ${productId}`;
          }
        });
      }
    }

    const topPaidProducts = Array.from(paidProductsMap.values())
      .filter(product => product.Name && product.TotalRevenue > 0)
      .sort((a, b) => b.TotalRevenue - a.TotalRevenue)
      .slice(0,6);

    console.log("Top Paid Products:", topPaidProducts);

    return topPaidProducts;
  } catch (errors) {
    console.error("Error in getallOrdersPaid:", errors);
    return [];
  }
};

function Dashboard() {
  
  const [userData, setUserData] = useState<userinfo[]>([]);
const fetchUserData = async ({CurrentPage, PageSize}:{CurrentPage:number, PageSize:number}) => {
 try{
  const response = await axios.get<userinfo[]>(authEndPoint.GetAllUsers, {
    params: { CurrentPage, PageSize },
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}`,
    },
  });
  setUserData(response.data);
 }catch(error){
  console.error("Error fetching user data:", error);
 }
}
console.log(userData)
useEffect(() => {
  fetchUserData({CurrentPage:1, PageSize:5});

}, []);


  // إضافة state للمنتجات المدفوعة
  const [paidProducts, setPaidProducts] = useState<PaidProduct[]>([]);
  const [loadingPaidProducts, setLoadingPaidProducts] = useState(false);
  
  // إضافة state للطلبات الأخيرة
  const [recentOrders, setRecentOrders] = useState<RecentOrderWithUser[]>([]);
  const [loadingRecentOrders, setLoadingRecentOrders] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalCount, setTotalCount] = useState(0);

  // دالة تحويل حالة الدفع إلى نص عربي
  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case "Paid":
        return "مكتمل";
      case "Pending":
        return "قيد المعالجة";
      case "Cancelled":
        return "فشل";
      default:
        return status;
    }
  };

  // دالة تحويل حالة الدفع إلى كلاس CSS
  const getPaymentStatusClass = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-success text-white";
      case "Pending":
        return "bg-warning text-dark";
      case "Cancelled":
        return "bg-danger text-white";
      default:
        return "bg-secondary text-white";
    }
  };
  

  // تحديث دالة جلب الطلبات الأخيرة مع بيانات المستخدمين لدعم pagination
  const fetchRecentOrdersWithUsers = async (page = 1, size = 10) => {
    setLoadingRecentOrders(true);
    try {
      // جلب الطلبات
      const ordersResponse = await axios.get(ordersPoint.GetAllOrders, {
        params: { pageNumber: page, pageSize: size },
        headers: { Authorization: `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}` }
      });
      setTotalCount(ordersResponse.data.pagination?.TotalCount || 0);

      // جلب المستخدمين
      const usersResponse = await axios.get(authEndPoint.GetAllUsers, {
        params: { CurrentPage: 1, PageSize: 100 },
        headers: { Authorization: `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}` }
      });

      // ترتيب الطلبات حسب التاريخ (الأحدث أولاً) وربطها مع المستخدمين
      const recentOrdersWithUsers = ordersResponse.data.data
        .sort((a: any, b: any) => new Date(b.OrderDate).getTime() - new Date(a.OrderDate).getTime())
        .map((order: any) => {
          const user = usersResponse.data.data.find((user: any) => user.Id === order.UserId);
          return {
            ...order,
            User: user || { 
              Id: 0, 
              FirstName: "غير معروف", 
              LastName: "", 
              Email: "", 
              PhoneNumber: "" 
            }
          };
        });
      setRecentOrders(recentOrdersWithUsers);
    } catch (error) {
      console.error("Error fetching recent orders with users:", error);
    } finally {
      setLoadingRecentOrders(false);
    }
  };
  
  // دالة جلب المنتجات المدفوعة
  const fetchPaidProducts = async () => {
    setLoadingPaidProducts(true);
    try {
      const topProducts = await getallOrdersPaid();
      console.log("API Response (Paid Products):", topProducts);
      setPaidProducts(topProducts);
      console.log("State used in UI (paidProducts):", topProducts);
    } catch (error) {
      console.error("Error fetching paid products:", error);
    } finally {
      setLoadingPaidProducts(false);
    }
  };
  
  // get Total cachback
  const [totalCashback, setTotalCashback] = useState(0);

  const fetchTotalCashback = async () => {
    const response = await axios.get(ordersPoint.GetTotalPaidPrice, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}`,
      },
    });
    setTotalCashback(response.data);
  };
  // get Total orders count
  const [totalOrders, setTotalOrders] = useState(0);
  const fetchTotalOrders = async () => {
    const response = await axios.get(ordersPoint.GetTotalOrders, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}`,
      },
    });
    setTotalOrders(response.data);
  };
  // git user count
  const [userCount, setUserCount] = useState(0);
  const fetchUserCount = async () => {
    const response = await axios.get(authEndPoint.GetUserCount, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}`,
      },
    });
    setUserCount(response.data);
  };

  useEffect(() => {
    console.log("Calling fetchPaidProducts in main useEffect");
    fetchUserCount();
    fetchTotalCashback();
    fetchTotalOrders();
    fetchPaidProducts(); // Call the new function here
    fetchRecentOrdersWithUsers(currentPage, pageSize); // جلب الطلبات الأخيرة مع بيانات المستخدمين
  }, []);

  // تحديث useEffect ليعيد الجلب عند تغيير الصفحة أو حجم الصفحة
  useEffect(() => {
    fetchRecentOrdersWithUsers(currentPage, pageSize);
  }, [currentPage, pageSize]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  useEffect(() => {
    getallOrdersPaid();
  }, []);


  const navigate = useNavigate();
  const toalloreder = () => {
    navigate("/admin/orders");
  }
  return (
    <>
      {loading ? (
        <div className="container-fluid py-5">
          <div className="row">
            {/* شيمر المنتجات المتصدرة */}
            <div className="col-xl-3 col-md-12 mb-xl-0 mb-sm-2">
              <div className="shadow-lg card p-3 mb-4" style={{ minHeight: 320, borderRadius: 18 }}>
                <div style={{ marginBottom: 16 }}>
                  <ShimmerPostItem hasImage={false} title cta />
                </div>
                <ShimmerSimpleGallery row={2} col={3} imageHeight={54} />
              </div>
            </div>
            {/* شيمر الكروت العلوية */}
            <div className="col-xl-9 col-md-12 d-flex flex-column gap-4">
              <div className="row">
                <div className="col-lg-4 col-md-6 mb-3">
                  <ShimmerPostItem hasImage={false} title cta />
                </div>
                <div className="col-lg-4 col-md-6 mb-3">
                  <ShimmerPostItem hasImage={false} title cta />
                </div>
                <div className="col-lg-4 col-md-6 mb-3">
                  <ShimmerPostItem hasImage={false} title cta />
                </div>
              </div>
              {/* شيمر الرسم البياني */}
              <div className="row">
                <div className="col-12">
                  <div className="shadow-lg card p-4 mb-4" style={{ borderRadius: 18 }}>
                    <ShimmerPostItem hasImage={false} title cta />
                  </div>
                </div>
              </div>
            </div>
            {/* شيمر جدول الطلبات الأخيرة */}
            <div className="col-12">
              <div className="shadow-lg card shadow-sm mt-2 p-4" style={{ borderRadius: 12 }}>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div style={{ width: 180, height: 32, borderRadius: 8, background: '#e0e0e0' }} />
                  <div style={{ width: 320, height: 32, borderRadius: 8, background: '#e0e0e0' }} />
                </div>
                <div style={{ width: '100%', overflowX: 'auto' }}>
                  <ShimmerTable row={5} col={5} />
                </div>
                <div className="d-flex justify-content-center align-items-center mt-3 mb-5 ">
                  <div style={{ width: 120, height: 40, borderRadius: 8, background: '#e0e0e0' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <motion.div
          className="container-fluid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="row">
            <div className="col-xl-3 col-md-12 mb-xl-0 mb-sm-2">
              {/* في كارد المنتجات المتصدرة: */}
              <motion.div
                className="shadow-lg card p-3"
                style={{
                  direction: "rtl",
                  borderRadius: 18,
                  boxShadow: "0 4px 24px rgba(1,143,44,0.13)",
                  background: "#fff",
                  marginBottom: 24,
                  minHeight: 320,
                  maxWidth: 420,
                  margin: "auto",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between"
                }}
                whileHover={{ scale: 1.03 }}
              >
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 style={{ fontWeight: 900, fontSize: 20, color: "#018f2c", letterSpacing: 1 }}>
                      المنتجات المتصدرة
                    </h5>
                  </div>
                  <p className="text-secondary" style={{ fontSize: 15, marginBottom: 18 }}>
                    {paidProducts.length > 0
                      ? `${paidProducts.reduce((sum, product) => sum + product.TotalRevenue, 0).toFixed(2)} ج إجمالي الإيرادات`
                      : `${totalCashback.toFixed(2)} ج مشتريات`
                    }
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 16,
                      justifyContent: 'center',
                      alignItems: 'stretch',
                      marginBottom: 8
                    }}
                  >
                    {paidProducts.map((product, index) => (
                      <div
                        key={index}
                        style={{
                          background: '#f6fff9',
                          borderRadius: 14,
                          boxShadow: '0 2px 8px rgba(1,143,44,0.07)',
                          padding: '14px 12px',
                          minWidth: 140,
                          maxWidth: 160,
                          flex: '1 1 140px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          transition: 'box-shadow 0.2s, transform 0.2s',
                          cursor: 'pointer',
                          position: 'relative',
                          marginBottom: 8
                        }}
                        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(1,143,44,0.13)'}
                        onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(1,143,44,0.07)'}
                      >
                        <img
                          src={`${ImgURLBeasd}${product.ImageUrl}` || imgproduct}
                          alt={product.Name}
                          style={{
                            width: 54,
                            height: 54,
                            borderRadius: 10,
                            objectFit: 'cover',
                            marginBottom: 8,
                            border: '2px solid #e9ecef',
                            boxShadow: '0 1px 4px rgba(1,143,44,0.07)'
                          }}
                          onError={e => { (e.target as HTMLImageElement).src = imgproduct; }}
                        />
                        <div style={{ fontWeight: 800, color: '#018f2c', fontSize: 15, textAlign: 'center', marginBottom: 2 }}>{product.Name}</div>
                        <div style={{ fontSize: 13, color: '#888', marginBottom: 2, textAlign: 'center' }}>
                          {product.TotalQuantity} قطعة
                        </div>
                        <div style={{ fontWeight: 700, color: '#009247', fontSize: 15, textAlign: 'center' }}>
                          {product.DiscountedPrice.toFixed(2)} ج
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
               
              </motion.div>
       
            </div>
            <div className=" col-xl-9 col-md-12 d-flex flex-column gap-4">
              <div className="row ">
                <div className="col-lg-4 col-md-6 mb-3">
             
                  <Cards
                    imgPath={dashLogo1}
                    Title=" العائد الكلي "
                    Value={`$${totalCashback}`}
                    rate="40"
                    color="#009247"
                    background="#3BFF9A"
                  />
               
                </div>
                <div className="col-lg-4 col-md-6 mb-3">
                  <Cards
                    imgPath={userimg}
                    Title="  المستخدمون "
                    Value={userCount.toString()}
                    rate="50"
                    color="#009247"
                    background="#3BFF9A"
                  />
                </div>
                <div className="col-lg-4 col-md-6 mb-3">
                  <Cards
                    imgPath={Logoacceptcart}
                    Title="الطلبات المكتمله"
                    Value={totalOrders.toString()}
                    rate="15"
                    color="#009247"
                    background="#3BFF9A"
                  />
                </div>
              </div>
              <div className="row">
                <div className={`col-12 `}>
                  <motion.div
                    className={`${Style.chartsLastRequiest} shadow-lg card p-4`}
                    style={{ direction: "rtl", height: "100%" }}
                    whileHover={{ scale: 1.05 }}
                    initial={{ opacity: 0, transform: "translateX(100%)" }}
                    animate={{ opacity: 1, transform: "translateX(0)" }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                   
                  
                    <div style={{ width: "100%", height: "80%", overflowX: "hidden", boxSizing: "border-box" }}>
                      <ChartsModel />
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
            <div className=" col-12  ">
              <motion.div
                className={`shadow-lg card shadow-sm mt-2`}
                style={{ borderRadius: "12px" }}
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, transform: "translateX(100%)" }}
                animate={{ opacity: 1, transform: "translateX(0)" }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <div
                  className={`  d-flex justify-content-between align-items-center mb-2 `}
                >
                  <h5 className="fw-bold m-2">الطلبات الأخيرة</h5>
                  <div className="d-flex gap-5 flex-md-row-reverse w-75">
                    <select
                      className={`${Style.heroSelect} form-select m-2`}
                      style={{ maxWidth: "120px" }}
                    >
                      <option>الاسم</option>
                      <option>التعقب</option>
                      <option>المعرف</option>
                    </select>
                    <input
                      type="text"
                      className={`${Style.heroSearch} form-control border m-2`}
                      placeholder="ابحث..."
                    />
                  </div>
                </div>
                <div style={{ width: '100%', overflowX: 'auto' }}>
                  <table className="table align-middle text-center  ">
                    <thead>
                      <tr>
                        <th>معرف المستخدم</th>
                        <th>الاسم</th>
                        <th>التاريخ</th>
                        <th>التعقب</th>
                        <th>المبلغ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loadingRecentOrders ? (
                        <tr>
                          <td colSpan={5} className="text-center py-4">
                            <div className="spinner-border spinner-border-sm text-primary" role="status">
                              <span className="visually-hidden">جاري التحميل...</span>
                            </div>
                          </td>
                        </tr>
                      ) : recentOrders.length > 0 ? (
                        recentOrders.map((order, index) => (
                          <tr key={index}>
                            <td>{order.User.Id}</td>
                            <td>
                              {order.User.FirstName} 
                              <span role="img" aria-label="user">
                                🧑🏻
                              </span>
                            </td>
                            <td>{new Date(order.OrderDate).toLocaleDateString()}</td>
                            <td>
                              <span
                                className={`badge ${getPaymentStatusClass(order.PaymentStatus)}`}
                                style={{
                                  padding: "6px 12px",
                                  borderRadius: "8px",
                                }}
                              >
                                {getPaymentStatusText(order.PaymentStatus)}
                              </span>
                            </td>
                            <td>{order.TotalPrice.toFixed(2)}ج</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="text-center py-4 text-muted">
                            لا توجد طلبات حديثة
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="d-flex justify-content-center align-items-center mt-3 mb-5 ">
                  <button className={`${Style.herobttn} btn btn-outline-success p-3`}
                  onClick={toalloreder}
                  >عرض الكل</button>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}

export default Dashboard;