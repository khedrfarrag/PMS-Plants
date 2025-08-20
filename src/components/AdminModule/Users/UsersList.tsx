import Style from "../Home/Dashboard.module.css";
import { PieChart } from '@mui/x-charts/PieChart';
import userlogo from "../../../assets/svg/dashsvg/userimg.svg";
import resteimg from "../../../assets/svg/dashsvg/reate.svg";
import { motion } from "framer-motion";
import Cards from "../../shared/utils/Cards";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { authEndPoint, ordersPoint, siteFeedbackPoint } from "../../../constant/Const";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faFilter } from "@fortawesome/free-solid-svg-icons";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { ShimmerTable } from "react-shimmer-effects";
import Stack from "@mui/material/Stack";
import Pagination from "@mui/material/Pagination";

// تسجيل الـ scales والعناصر المطلوبة
ChartJS.register(CategoryScale, LinearScale, ArcElement, Tooltip, Legend);
const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
    tooltip: {
      animation: {
        duration: 200,
      },
      callbacks: {
        label: (context: any) => `$${context.raw}`,
      },
    },
  },
  scales: {
    x: {
      ticks: { font: { size: 14 } },
    },
    y: {
      ticks: {
        font: { size: 14 },
        callback: (value: any) => `${value}`,
      },
    },
  },
};
interface User{
  Id:string;
  FirstName:string;
  LastName:string;
  Email:string;
  City:string;
  PhoneNumber:string;
}
interface Order{
  Id:string;
  UserId:string;
  TotalPrice:number;
  OrderDate:string;
  PaymentStatus:string;
  TotalQuantity:number;
  OrderItems:any[];
}
interface Pagination{
  CurrentPage:number;
  PageSize:number;
  TotalCount:number;
  TotalPages:number;
}

function UsersList() {
  const navigate = useNavigate();
  const [users,setUsers] = useState<User[]>([]);
  const [orders,setOrders] = useState<Order[]>([]);
  const [allOrders,setAllOrders] = useState<Order[]>([]); // جميع الطلبات لربطها بالمستخدمين
  const [loading,setLoading] = useState(false);
  const [loadingOrders,setLoadingOrders] = useState(false); // حالة تحميل الطلبات
  const [pagination,setPagination] = useState<Pagination>({
    CurrentPage:1,
    PageSize:10,
    TotalCount:0,
    TotalPages:0
  });
  const [currentUsersPage,setCurrentUsersPage] = useState(1); // الصفحة الحالية للمستخدمين
  const [searchTerm, setSearchTerm] = useState(""); // البحث
  const [searchType, setSearchType] = useState("الاسم"); // نوع البحث المختار
  const [userCount, setUserCount] = useState(0);
  const [showSearchMobile, setShowSearchMobile] = useState(false);
  const [showFilterMobile, setShowFilterMobile] = useState(false);
  const controlsRef = useRef<HTMLDivElement>(null);

  const getUserCount = async () => {
    const response = await axios.get(authEndPoint.GetUserCount, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}` }
    });
    setUserCount(response.data);
  };

  // دالة جلب جميع الطلبات
const getAllOrder = async ({pageNumber,pageSize}:{pageNumber:number,pageSize:number}) => {
  try {
    const response = await axios.get(ordersPoint.GetAllOrders,{
      headers:{
        Authorization:`Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}`
      },
      params:{
        pageNumber,
        pageSize
      }
    });
    setOrders(response.data.data);
    // تم حذف setPagination(response.data.pagination) هنا حتى لا يؤثر على باجينيشن المستخدمين
    console.log(response.data.pagination);
    console.log(response.data.data);
  } catch (error) {
    console.error("Error fetching orders:", error);
  }
};

// دالة جلب جميع الطلبات بدون pagination لربطها بالمستخدمين
const getAllOrdersForUsers = async () => {
  setLoadingOrders(true);
  try {
    let allOrdersData: Order[] = [];
    let currentPage = 1;
    let hasMoreData = true;
    
    // جلب الطلبات على دفعات حتى نتمكن من جلب جميع الطلبات
    while (hasMoreData) {
      const response = await axios.get(ordersPoint.GetAllOrders,{
        headers:{
          Authorization:`Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}`
        },
        params:{
          pageNumber: currentPage,
          pageSize: 1000 // عدد كبير لكل دفعة
        }
      });
      
      const ordersData = response.data.data;
      const paginationData = response.data.pagination;
      
      // إضافة الطلبات للقائمة
      allOrdersData = [...allOrdersData, ...ordersData];
      
      // التحقق من وجود صفحات أخرى
      if (currentPage >= paginationData.TotalPages || ordersData.length === 0) {
        hasMoreData = false;
      } else {
        currentPage++;
      }
    }
    
    setAllOrders(allOrdersData);
    console.log(`تم جلب ${allOrdersData.length} طلب بنجاح`);
    return allOrdersData;
  } catch (error) {
    console.error("Error fetching all orders:", error);
    return [];
  } finally {
    setLoadingOrders(false);
  }
};
  const getAllUsers = async ({pageNumber,pageSize}:{pageNumber:number,pageSize:number}) => {
    setLoading(true);
    try {
      const response = await axios.get(authEndPoint.GetAllUsers,{
        headers:{
          Authorization:`Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}`
        },
        params:{
          pageNumber,
          pageSize
        }
      });
      setUsers(response.data.data);
      setPagination(response.data.pagination);
      setCurrentUsersPage(pageNumber); // تحديث الصفحة الحالية
      console.log(response.data.pagination);
      console.log(response.data.data);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
const getFeedbacks = async (pageNumber:number,pageSize:number) => {
  const response = await axios.get(siteFeedbackPoint.Get,{
    headers:{
      Authorization:`Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}`
    },
    params:{
      pageNumber,
      pageSize
    }
  });
  setFeedbacks(response.data.data);
}
  useEffect(() => {
    getUserCount();
    getFeedbacks(1,1000);
  }, []);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (controlsRef.current && !controlsRef.current.contains(e.target as Node)) {
        setShowSearchMobile(false);
        setShowFilterMobile(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const normalizedRatings = feedbacks.map(f => Math.min(Number(f.Rating), 5));
  const totalFeedbacks = feedbacks.length;
  const averageRating = totalFeedbacks > 0
    ? (normalizedRatings.reduce((a, b) => a + b, 0) / totalFeedbacks).toFixed(2)
    : 0;

  useEffect(()=>{
    getAllUsers({pageNumber:1,pageSize:10});
    getAllOrder({pageNumber:1,pageSize:10});
    // جلب جميع الطلبات لربطها بالمستخدمين
    getAllOrdersForUsers();
  },[]);

  // دالة تغيير صفحة المستخدمين مع إعادة جلب الطلبات
  const changeUsersPage = async (newPage: number) => {
    await getAllUsers({pageNumber: newPage, pageSize: pagination.PageSize});
    // إعادة جلب جميع الطلبات لربطها بالمستخدمين الجدد
    await getAllOrdersForUsers();
  };
  
  // دالة البحث بناءً على النوع المختار
  const filteredUsers = () => {
    // بناء كائن عداد للطلبات حسب UserId
    const orderCountByUser: Record<string, number> = {};
    allOrders.forEach((order) => {
      orderCountByUser[order.UserId] = (orderCountByUser[order.UserId] || 0) + 1;
    });

    let filtered = users.map((user) => ({
      ...user,
      orderCount: orderCountByUser[user.Id] || 0,
    }));

    console.log("Users from API:", users.length);
    console.log("All Orders:", allOrders.length);
    console.log("Filtered Users:", filtered.length);

    if (searchTerm) {
      switch (searchType) {
        case "الاسم":
          filtered = filtered.filter((user) =>
            user.FirstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.LastName.toLowerCase().includes(searchTerm.toLowerCase())
          );
          break;
        case "العنوان":
          filtered = filtered.filter((user) =>
            user.City.toLowerCase().includes(searchTerm.toLowerCase())
          );
          break;
        case "عدد العمليات":
          const searchNumber = parseInt(searchTerm);
          if (!isNaN(searchNumber)) {
            filtered = filtered.filter((user) => user.orderCount === searchNumber);
          }
          break;
        default:
          // البحث في كل الحقول
          filtered = filtered.filter((user) =>
            user.FirstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.LastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.Email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.PhoneNumber.includes(searchTerm) ||
            user.City.toLowerCase().includes(searchTerm.toLowerCase())
          );
      }
    }

    return filtered;
  };

  const usersToDisplay = filteredUsers();

  // بناء كائن عداد للطلبات حسب UserId (للعرض المباشر)
  const orderCountByUser: Record<string, number> = {};
  allOrders.forEach((order) => {
    orderCountByUser[order.UserId] = (orderCountByUser[order.UserId] || 0) + 1;
  });

  // تجهيز بيانات المحافظات المتصدرة للرسم البياني
  const cityCount: Record<string, number> = {};
  usersToDisplay.forEach(user => {
    if (user.City) {
      cityCount[user.City] = (cityCount[user.City] || 0) + 1;
    }
  });
  const sortedCities = Object.entries(cityCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  // بيانات PieChart لـ MUI
  const pieChartData = sortedCities.map(([city, count]) => ({
    id: city,
    value: count,
    label: city,
  }));


 

  // دالة الانتقال لصفحة تفاصيل المستخدم
  const handleUserClick = (userId: string) => {
    console.log('=== UsersList Debug ===');
    console.log('Clicking user with ID:', userId);
    console.log('typeof userId:', typeof userId);
    console.log('Navigating to:', `/admin/users-list/${userId}`);
    console.log('======================');
    navigate(`/admin/users-list/${userId}`);
  };

  return (
    <motion.div
      className="container-fluid"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="row">
        <div className="col-lg-3 col-md-12 mt-2">
          <Cards
            Title="عدد المستخدمين"
            Value={userCount.toString()}
            color="#009247"
            background="#3BFF9A"
            imgPath={userlogo}
            key={userCount}
            rate={""}
          />
          <Cards
            Title="تقييم المستخدمين"
            Value={`${averageRating}`}
            rate="18"
            color="#FFA000"
            background="#FFF8E1"
            imgPath={resteimg}
          />
          <motion.div
            className="piechart-card shadow-lg card p-4 text-center w-100"
            style={{ margin: "auto", background: "#fff", borderRadius: "18px" }}
            initial={{ opacity: 0, transform: "translate(100% )" }}
            animate={{ opacity: 1, transform: "translate(0 )" }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h5 style={{fontWeight:700, color:'#009247', textAlign:'center', marginBottom: '1rem', letterSpacing: '1px'}}>المحافظات الأكثر تواجداً للمستخدمين</h5>
            <hr />

            <div style={{
              width: "100%",
              maxWidth: 400,
              minWidth: 220,
              aspectRatio: "1/1",
              margin: "auto",
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}>
              <PieChart
                series={[
                  {
                    data: pieChartData,
                    innerRadius: 60,
                    outerRadius: 100,
                    paddingAngle: 3,
                    cornerRadius: 6,
                  },
                ]}
                width={typeof window !== 'undefined' && window.innerWidth < 600 ? 220 : 350}
                height={typeof window !== 'undefined' && window.innerWidth < 600 ? 220 : 350}
                slotProps={{
                  legend: {
                    position: {
                      vertical: typeof window !== 'undefined' && window.innerWidth < 600 ? 'bottom' : 'middle',
                      horizontal: typeof window !== 'undefined' && window.innerWidth < 600 ? 'center' : 'end',
                    },
                    direction: (typeof window !== 'undefined' && window.innerWidth >= 600 ? 'column' : 'row') as any,
                  },
                }}
                colors={["#3D5AFE", "#D1C4E9", "#FF9800", "#E53935", "#4CAF50", "#F44336", "#00BCD4", "#FFC107"]}
              />
            </div>
          </motion.div>
        </div>
        <div className="col-lg-9 col-md-12 d-flex flex-column gap-5">
          <motion.div
            className="shadow-lg card shadow-sm mt-2"
            style={{ borderRadius: "12px" }}
            initial={{ opacity: 0, transform: "translate(-100% )" }}
            animate={{
              opacity: 1,
              transform: "translate(0 )",
            }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {/* شيمر أثناء التحميل */}
            {loading ? (
              <div className="p-4">
                <ShimmerTable row={8} col={5} />
              </div>
            ) : (
              <>
                <div className={`d-flex justify-content-between align-items-center mb-2 ${Style.lastOrdersControls}`} ref={controlsRef}>
                  <h5 className="fw-bold m-2">المستخدمون</h5>
                  <div className="d-none d-md-flex gap-5 flex-md-row-reverse w-75">
                    <select
                      className={`${Style.heroSelect} ${Style.usersSelect} form-select m-2`}
                      style={{ maxWidth: "120px" }}
                      value={searchType}
                      onChange={(e) => setSearchType(e.target.value)}
                    >
                      <option value="الاسم">الاسم</option>
                      <option value="العنوان">العنوان</option>
                      <option value="عدد العمليات">عدد العمليات</option>
                    </select>
                    <input
                      type="text"
                      className={`${Style.heroSearch} ${Style.usersSearchBox} form-control border m-2`}
                      placeholder={`ابحث بـ ${searchType}...`}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  {/* Mobile icon controls */}
                  <div className="d-flex d-md-none align-items-center gap-2 position-relative">
                    <button
                      className={Style.iconButton}
                      onClick={() => { setShowSearchMobile((p)=>!p); setShowFilterMobile(false); }}
                      aria-label="فتح البحث"
                    >
                      <FontAwesomeIcon icon={faSearch} />
                    </button>
                    <button
                      className={Style.iconButton}
                      onClick={() => { setShowFilterMobile((p)=>!p); setShowSearchMobile(false); }}
                      aria-label="تحديد نوع البحث"
                    >
                      <FontAwesomeIcon icon={faFilter} />
                    </button>

                    {showSearchMobile && (
                      <div className={Style.mobilePopover} style={{ width: '84vw' }}>
                        <input
                          type="text"
                          className={`${Style.heroSearch} form-control`}
                          placeholder={`ابحث بـ ${searchType}...`}
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          autoFocus
                        />
                      </div>
                    )}

                    {showFilterMobile && (
                      <div className={Style.mobilePopover} style={{ width: '70vw' }}>
                        <div className={Style.popoverList}>
                          {['الاسم','العنوان','عدد العمليات'].map((opt) => (
                            <button key={opt} className={Style.popoverItem} onClick={() => { setSearchType(opt); setShowFilterMobile(false); }}>
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="table-responsive">
                  <table className={`table table-striped table-hover align-middle text-center ${Style.usersTable}`}>
                    <thead className="table-light">
                      <tr>
                        <th>الاسم</th>
                        <th>رقم الهاتف</th>
                        <th>البريدالالكتروني</th>
                        <th>عنوان المنزل </th>
                        <th>عدد العمليات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usersToDisplay.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center py-4">
                            <div className="text-muted">
                              {searchTerm ?
                                `لا توجد نتائج تطابق البحث بـ ${searchType}` :
                                "لا توجد مستخدمين"
                              }
                            </div>
                          </td>
                        </tr>
                      ) : (
                        usersToDisplay.map((user) => (
                          <tr
                            key={user.Id}
                            onClick={() => handleUserClick(user.Id)}
                            style={{
                              cursor: 'pointer',
                              transition: 'background-color 0.2s',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#f8f9fa';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = '';
                            }}
                          >
                            <td>
                              {user.FirstName} {user.LastName}{" "}
                              <span role="img" aria-label="user">
                                🧑🏻
                              </span>
                            </td>
                            <td>{user.PhoneNumber}</td>
                            <td>
                              <span
                                className={` `}
                                style={{
                                  padding: "6px 12px",
                                  borderRadius: "8px",
                                }}
                              >
                                {user.Email}
                              </span>
                            </td>
                            <td>{user.City}</td>
                            <td>
                              {loadingOrders ? (
                                <span className="text-muted">
                                  <div className="spinner-border spinner-border-sm me-1" role="status">
                                    <span className="visually-hidden">جاري التحميل...</span>
                                  </div>
                                  جاري التحميل...
                                </span>
                              ) : (
                                <span className={`badge ${user.orderCount < 1 ? 'bg-danger' : 'bg-success'}`}>
                                  {user.orderCount} عمليات
                                </span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="d-flex justify-content-center align-items-center mt-2">
                  <Stack spacing={2}>
                    <Pagination count={pagination.TotalPages} variant="outlined" shape="rounded" onChange={(e,value)=>setPagination((prev)=>({...prev,currentPage:value}))} />
                  </Stack>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default UsersList;
