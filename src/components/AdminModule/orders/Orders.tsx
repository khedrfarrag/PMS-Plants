import React, { useState, useEffect, useContext } from "react";
import Style from "./style/style.module.css";
import { motion } from "framer-motion";
import Modal from "react-bootstrap/Modal";
import { AuthContext } from "../../../context/Context";
import axios from "axios";
import { ordersPoint, authEndPoint, ProductsPoint } from "../../../constant/Const";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import Stack from "@mui/material/Stack";
import Pagination from "@mui/material/Pagination";

function Orders() {
  interface OrderItem {
    ProductId: number;
    Quantity: number;
    Price: number;
    TotalPrice: number;
  }
  interface OrderData {
    Id: number;
    UserId: string;
    IsGuestOrder: boolean;
    FirstName: string;
    LastName: string;
    MobileNumber: string;
    Address: string;
    Governorate: string;
    PaymentMethod: string;
    OrderDate: string;
    TotalPrice: number;
    TotalQuantity: number;
    PaymentStatus: string;
    OrderItems: OrderItem[];
  }
  interface UserData {
    Id: string;
    FirstName: string;
    LastName: string;
    Email: string;
    City: string;
    PhoneNumber: string;
  }
  interface ProductData {
    Id: number;
    Name: string;
    Price: number;
    // ... باقي بيانات المنتج
  }
  interface pagination {
    CurrentPage: number;
    PageSize: number;
    TotalCount: number;
    TotalPages: number;
  }
  const [loading, setLoading] = useState(true);
  const { userData }: any = useContext(AuthContext);
  const [Orders, setOrders] = useState<OrderData[]>([]);
  const [users, setUsers] = useState<UserData[]>([]);
  const [products, setProducts] = useState<ProductData[]>([]);
  const [pagination, setPagination] = useState({
    CurrentPage: 1,
    PageSize: 10,
    TotalCount: 0,
    TotalPages: 1,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("الاسم");
  const [editOrder, setEditOrder] = useState<any | null>(null);
  const [newProductId, setNewProductId] = useState<number | null>(null);
  const [newProductQty, setNewProductQty] = useState<number>(1);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('edit');
  const [addOrder, setAddOrder] = useState<any | null>(null);
console.log(userData.role)
  const getAllOrders = async (page = 1) => {
    try {
      const response = await axios.get<any>(ordersPoint.GetAllOrders + `?pageNumber=${page}&pageSize=${pagination.PageSize}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}`,
        },
      });
      setOrders(response.data.data);
      setPagination(response.data.pagination);
    } catch (errors) {
      console.log(errors);
    }
  };

  const getAllUsers = async () => {
    try {
      const response = await axios.get<any>(authEndPoint.GetAllUsers, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}`,
        },
      });
      setUsers(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllProducts = async () => {
    try {
      // جلب كل المنتجات ببارامترات كبيرة جداً
      const response = await axios.get<any>(ProductsPoint.GetAllProducts + `?pageNumber=1&pageSize=999999`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}`,
        },
      });
      setProducts(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteOrder = async (orderId: number) => {
    try {
      if (userData.role !== "SuperAdmin") {
        toast.error("ليس لديك الصلاحية لتنفيذ هذا الإجراء");
        return;
      }
      await axios.delete(`${ordersPoint.Delete(orderId)}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}`,
        },
      });
      // إعادة تحميل قائمة الطلبات بعد الحذف
      getAllOrders(currentPage);
      setShow(false); // إغلاق المودال
      toast.success("تم حذف الطلب بنجاح");
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("حدث خطأ أثناء حذف الطلب");
    }
  };

  // دالة للحصول على اسم المستخدم من UserId
  const getUserName = (userId: string) => {
    const user = users.find(u => u.Id === userId);
    return user ? `${user.FirstName} ${user.LastName}` : userId;
  };

  // دالة للحصول على اسم المنتج من ProductId
  const getProductName = (productId: number) => {
    const product = products.find(p => p.Id === productId);
    console.log('ProductId:', productId, 'Found Product:', product); // للتأكد
    return product ? product.Name : `منتج ${productId}`;
  };

  // دالة لتنسيق التاريخ
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Africa/Cairo'
    });
  };

  useEffect(() => {
    getAllOrders(pagination.CurrentPage);
    getAllUsers();
    getAllProducts(); // إضافة جلب المنتجات
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, [pagination.CurrentPage]);

  // دالة لترجمة الحالة للعربي وإرجاع اللون المناسب
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "Paid":
        return { text: "مدفوع", className: "bg-success" };
      case "Cancelled":
        return { text: "ملغي", className: "bg-danger" };
      case "Pending":
        return { text: "قيد الانتظار", className: "bg-warning text-dark" };
      default:
        return { text: status, className: "bg-secondary" };
    }
  };

  // دالة فلترة الطلبات
  const filteredOrders = Orders.filter((order) => {
    if (!searchTerm) return true;

    const searchLower = searchTerm.toLowerCase();

    switch (searchType) {
      case "الاسم":
        const userName = getUserName(order.UserId).toLowerCase();
        return userName.includes(searchLower);

      case "المنتج":
        return order.OrderItems.some((item) => {
          const productName = getProductName(item.ProductId).toLowerCase();
          return productName.includes(searchLower);
        });

      case "الحالة":
        const statusInfo = getStatusInfo(order.PaymentStatus);
        const statusText = statusInfo.text.toLowerCase();
        return statusText.includes(searchLower);

      default:
        return true;
    }
  });

  
  const [fullscreen, setFullscreen] = useState<string | true | undefined>(true);
  const [show, setShow] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);

  function handleShow(breakpoint: string | true, order?: OrderData) {
    setFullscreen(breakpoint);
    setSelectedOrder(order || null);
    setShow(true);
    if (order) {
      setModalMode('edit'); // إضافة هذا السطر
      setEditOrder({
        UserId: order.UserId,
        IsGuestOrder: order.IsGuestOrder,
        FirstName: order.FirstName,
        LastName: order.LastName,
        MobileNumber: order.MobileNumber,
        Address: order.Address,
        Governorate: order.Governorate,
        PaymentMethod: order.PaymentMethod,
        OrderItems: order.OrderItems.map((item) => ({ ...item })),
        PaymentStatus: order.PaymentStatus,
      });
    }
  }

  // دالة لتعديل الطلب
  const updateOrder = async () => {
    if (!selectedOrder) return;
    
    // Basic validation before submit
    if (!editOrder) return;
    const missing: string[] = [];
    if (!editOrder.IsGuestOrder && !editOrder.UserId) missing.push("المستخدم");
    if (!editOrder.FirstName) missing.push("الاسم الأول");
    if (!editOrder.LastName) missing.push("اسم العائلة");
    if (!editOrder.MobileNumber) missing.push("رقم الهاتف");
    if (!editOrder.Address) missing.push("العنوان");
    if (!editOrder.Governorate) missing.push("المحافظة");
    if (!editOrder.PaymentMethod) missing.push("طريقة الدفع");
    if (!editOrder.OrderItems || editOrder.OrderItems.length === 0) missing.push("منتج واحد على الأقل");
    if (missing.length) {
      toast.error(`من فضلك أكمل الحقول: ${missing.join("، ")}`);
      return;
    }
    
    try {
      // إعداد البيانات للإرسال - إزالة UserId إذا كان guest order
      const orderData = { ...editOrder };
      if (orderData.IsGuestOrder) {
        delete orderData.UserId;
      }
      if (userData.role !== "SuperAdmin") {
        toast.error("ليس لديك الصلاحية لتنفيذ هذا الإجراء");
        return;
      }
      await axios.put(
        `${ordersPoint.Put(selectedOrder.Id)}`,
        orderData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}`,
          },
        }
      );
      getAllOrders(currentPage);
      setShow(false);
      toast.success("تم تعديل الطلب بنجاح");
    } catch (error: unknown) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.[0] || "حدث خطأ أثناء تعديل الطلب");
      } else {
        toast.error("حدث خطأ أثناء تعديل الطلب");
      }
    }
  };

  // دالة إنشاء الطلب
  const createOrder = async () => {
    // Basic validation before submit
    if (!addOrder) return;
    const missing: string[] = [];
    if (!addOrder.IsGuestOrder && !addOrder.UserId) missing.push("المستخدم");
    if (!addOrder.FirstName) missing.push("الاسم الأول");
    if (!addOrder.LastName) missing.push("اسم العائلة");
    if (!addOrder.MobileNumber) missing.push("رقم الهاتف");
    if (!addOrder.Address) missing.push("العنوان");
    if (!addOrder.Governorate) missing.push("المحافظة");
    if (!addOrder.PaymentMethod) missing.push("طريقة الدفع");
    if (!addOrder.OrderItems || addOrder.OrderItems.length === 0) missing.push("منتج واحد على الأقل");
    if (missing.length) {
      toast.error(`من فضلك أكمل الحقول: ${missing.join("، ")}`);
      return;
    }
    
    try {
      // إعداد البيانات للإرسال - إزالة UserId إذا كان guest order
      const orderData = { ...addOrder };
      if (orderData.IsGuestOrder) {
        delete orderData.UserId;
      }
      if (userData.role !== "SuperAdmin") {
        toast.error("ليس لديك الصلاحية لتنفيذ هذا الإجراء");
        return;
      }
      await axios.post(
        ordersPoint.Post,
        orderData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}`,
          },
        }
      );
      
        getAllOrders(currentPage);
      setShow(false);
      toast.success("تم إضافة الطلب بنجاح");
      
    } catch (error: unknown) {
      
      console.log(error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.[0] || "حدث خطأ أثناء إضافة الطلب");
      } else {
        toast.error("حدث خطأ أثناء إضافة الطلب");
      }
    }
  };

  return (
    <motion.div
      className={Style.orderCard}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <header className={Style.orderHeader}>
        إدارة الطلبات
      </header>
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "2rem" }}>
          <motion.div
            className={Style.orderCard}
            initial={{ opacity: 0, transform: "translate(-100% )" }}
            animate={{ opacity: 1, transform: "translate(0 )" }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
              {/* منطقة البحث وزر الإضافة */}
              <div className="d-flex flex-wrap align-items-center gap-3 mb-3" style={{ justifyContent: 'space-between' }}>
                <div className="d-flex align-items-center gap-3 flex-grow-1" style={{ minWidth: 0 }}>
                  <select
                    className={`${Style.heroSelect}`}
                    style={{ maxWidth: "120px" }}
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                  >
                    <option disabled>الفلترة</option>
                    <option>الاسم</option>
                    <option>المنتج</option>
                    <option>الحالة</option>
                  </select>
                  <input
                    type="text"
                    className={`${Style.heroSearch}`}
                    placeholder="ابحث..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ minWidth: 180, flexGrow: 1 }}
                  />
                </div>
                <button
                  className={Style.orderBtnAdd}
                  onClick={() => {
                    setShow(true);
                    setModalMode('add');
                    setAddOrder({
                      UserId: "",
                      IsGuestOrder: false,
                      FirstName: "",
                      LastName: "",
                      MobileNumber: "",
                      Address: "",
                      Governorate: "Cairo",
                      PaymentMethod: "CashOnDelivery",
                      OrderItems: [],
                      PaymentStatus: "Pending",
                    });
                  }}
                  style={{ whiteSpace: 'nowrap' }}
                >
                  <FontAwesomeIcon icon={faCartPlus} /> إضافة طلب
                </button>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table className={Style.orderTable + " align-middle text-center"} style={{ width: "100%" }}>
                  <thead>
                    <tr>
                      <th>الاسم</th>
                      <th>اسم المنتج</th>
                      <th>العدد</th>
                      <th>عدد العناصر</th>
                      <th>المبلغ</th>
                      <th>اجمالي المبلغ</th>
                      <th>التاريخ</th>
                      <th>الحالة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.length > 0 && filteredOrders.map((order) => {
                      const statusInfo = getStatusInfo(order.PaymentStatus);
                      return (
                        <tr key={order.Id} onClick={() => handleShow(true, order)} style={{ cursor: "pointer" }}>
                          <td>{getUserName(order.UserId)}</td>
                          <td>
                            {order.OrderItems.map((item, index) => (
                              <div key={index} className="mb-1">
                                {getProductName(item.ProductId)}
                              </div>
                            ))}
                          </td>
                          <td>
                            {order.OrderItems.map((item, index) => (
                              <div key={index} className="mb-1">
                                {item.Quantity}
                              </div>
                            ))}
                          </td>
                          <td>{order.TotalQuantity}</td>
                          <td>
                            {order.OrderItems.map((item, index) => (
                              <div key={index} className="mb-1">
                                {item.Price} ج.م
                              </div>
                            ))}
                          </td>
                          <td>{order.TotalPrice} ج.م</td>
                          <td>{formatDate(order.OrderDate)}</td>
                          <td>
                            <span
                              className={`badge ${statusInfo.className}`}
                              style={{ padding: "6px 12px", borderRadius: "8px" }}
                            >
                              {statusInfo.text}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <Modal
                show={show}
                onHide={() => setShow(false)}
                centered
                size="lg"
                dialogClassName="modal-dialog-centered"
              >
                <Modal.Header closeButton>
                  <Modal.Title className="d-flex justify-content-between align-items-center w-100">
                    <span style={{ fontSize: '1.1rem', fontWeight: 'normal' }}>تفاصيل الطلب</span>
                    {selectedOrder && (
                      <span
                        className={`badge ${getStatusInfo(selectedOrder.PaymentStatus).className}`}
                        style={{ padding: "6px 12px", borderRadius: "8px", fontSize: '0.9rem', marginLeft: '20px' }}
                      >
                        {getStatusInfo(selectedOrder.PaymentStatus).text}
                      </span>
                    )}
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {modalMode === 'edit' && selectedOrder && editOrder && (
                  <div className="container">
                    <div className="row">
                        {/* المستخدم */}
                        <div className="col-12 mb-3">
                          <label className="mb-1">المستخدم</label>
                          <select
                            className="form-select"
                            value={editOrder.UserId}
                            onChange={e => {
                              const userId = e.target.value;
                              setEditOrder({ 
                                ...editOrder, 
                                UserId: userId,
                                IsGuestOrder: !userId // true إذا لم يختر، false إذا اختار
                              });
                            }}
                            disabled={editOrder.IsGuestOrder}
                          >
                            <option value="">اختر مستخدم</option>
                            {users.map(user => (
                              <option key={user.Id} value={user.Id}>
                                {user.FirstName} {user.LastName}
                              </option>
                            ))}
                          </select>
                          <div className="form-check mt-2">
                            <input
                              id="guestOrderEdit"
                              className="form-check-input"
                              type="checkbox"
                              checked={editOrder.IsGuestOrder}
                              onChange={e => {
                                const isGuest = e.target.checked;
                                setEditOrder({ 
                                  ...editOrder, 
                                  IsGuestOrder: isGuest,
                                  UserId: isGuest ? "" : editOrder.UserId // إذا كان guest، امسح UserId
                                });
                              }}
                            />
                            <label className="form-check-label" htmlFor="guestOrderEdit">
                              طلب ضيف (بدون اختيار مستخدم)
                            </label>
                          </div>
                        </div>
                        {/* بيانات العميل */}
                        <div className="col-md-6 mb-3">
                          <label className="mb-1">الاسم الأول</label>
                          <input
                            type="text"
                            className="form-control"
                            value={editOrder.FirstName}
                            onChange={e => setEditOrder({ ...editOrder, FirstName: e.target.value })}
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="mb-1">اسم العائلة</label>
                          <input
                            type="text"
                            className="form-control"
                            value={editOrder.LastName}
                            onChange={e => setEditOrder({ ...editOrder, LastName: e.target.value })}
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="mb-1">رقم الهاتف</label>
                          <input
                            type="tel"
                            className="form-control"
                            value={editOrder.MobileNumber}
                            onChange={e => setEditOrder({ ...editOrder, MobileNumber: e.target.value })}
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="mb-1">المحافظة</label>
                          <input
                            type="text"
                            className="form-control"
                            value={editOrder.Governorate}
                            onChange={e => setEditOrder({ ...editOrder, Governorate: e.target.value })}
                          />
                        </div>
                        <div className="col-12 mb-3">
                          <label className="mb-1">العنوان</label>
                          <input
                            type="text"
                            className="form-control"
                            value={editOrder.Address}
                            onChange={e => setEditOrder({ ...editOrder, Address: e.target.value })}
                          />
                        </div>
                        {/* طريقة الدفع */}
                        <div className="col-md-6 mb-3">
                          <label className="mb-1">طريقة الدفع</label>
                          <select
                            className="form-select"
                            value={editOrder.PaymentMethod}
                            onChange={e => setEditOrder({ ...editOrder, PaymentMethod: e.target.value })}
                          >
                            <option value="CashOnDelivery">الدفع عند الاستلام</option>
                            <option value="CardOrWallet">محفظة/بطاقة</option>
                          </select>
                        </div>
                        {/* المنتجات */}
                        <div className="col-12 mb-3">
                          <label className="mb-1">المنتجات</label>
                          <table className="table text-center table-hover table-bordered ">
                            <thead>
                              <tr>
                                <th>الاسم</th>
                                <th>الكمية</th>
                                <th>حذف</th>
                              </tr>
                            </thead>
                            <tbody>
                              {editOrder.OrderItems.map((item: any, idx: number) => (
                                <tr key={idx}>
                                  <td>{getProductName(item.ProductId)}</td>
                                  <td>
                                    <input
                                      type="number"
                                      min={1}
                                      className="form-control"
                                      value={item.Quantity}
                                      onChange={e => {
                                        const val = Number(e.target.value);
                                        setEditOrder({
                                          ...editOrder,
                                          OrderItems: editOrder.OrderItems.map((it: any, i: number) =>
                                            i === idx ? { ...it, Quantity: val } : it
                                          ),
                                        });
                                      }}
                                    />
                                  </td>
                                  <td>
                                    <FontAwesomeIcon icon={faTrash}
                                      className="text-danger"
                                      style={{ fontSize: "18px" ,cursor:"pointer" ,transform:"translateY(50%)"}}
                                      onClick={() => {
                                        setEditOrder({
                                          ...editOrder,
                                          OrderItems: editOrder.OrderItems.filter((_: any, i: number) => i !== idx),
                                        });
                                      }}
                                    />
                                    
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          {/* إضافة منتج جديد */}
                          <div className="d-flex align-items-center gap-2 mb-2">
                            <select
                              className="form-select"
                              style={{ maxWidth: 200 }}
                              value={newProductId ?? ""}
                              onChange={e => setNewProductId(Number(e.target.value))}
                            >
                              <option value="">اختر منتج</option>
                              {products.map(prod => (
                                <option key={prod.Id} value={prod.Id}>{prod.Name}</option>
                              ))}
                            </select>
                            <input
                              type="number"
                              min={1}
                              className="form-control"
                              style={{ maxWidth: 100 }}
                              value={newProductQty}
                              onChange={e => setNewProductQty(Number(e.target.value))}
                            />
                            <button
                              className="btn btn-primary"
                              onClick={() => {
                                if (!newProductId) return;
                                // لا تضف المنتج إذا كان موجود بالفعل
                                if (editOrder.OrderItems.some((it: any) => it.ProductId === newProductId)) return;
                                setEditOrder({
                                  ...editOrder,
                                  OrderItems: [
                                    ...editOrder.OrderItems,
                                    { ProductId: newProductId, Quantity: newProductQty, Price: 0 },
                                  ],
                                });
                                setNewProductId(null);
                                setNewProductQty(1);
                              }}
                            >
                              إضافة 
                            </button>
                          </div>
                        </div>
                        {/* الحالة */}
                        <div className="col-12 mb-3">
                          <label className="mb-1">حالة الدفع</label>
                          <select
                            className="form-select"
                            value={editOrder.PaymentStatus}
                            onChange={e => setEditOrder({ ...editOrder, PaymentStatus: e.target.value })}
                          >
                            <option value="Paid">مدفوع</option>
                            <option value="Cancelled">ملغي</option>
                            <option value="Pending">قيد الانتظار</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                  {modalMode === 'add' && addOrder && (
                    <div className="container">
                      <div className="row">
                        {/* المستخدم */}
                        <div className="col-12 mb-3">
                          <label className="mb-1">المستخدم</label>
                          <select
                            className="form-select"
                            value={addOrder.UserId}
                            onChange={e => {
                              const userId = e.target.value;
                              setAddOrder({ 
                                ...addOrder, 
                                UserId: userId,
                                IsGuestOrder: !userId // true إذا لم يختر، false إذا اختار
                              });
                            }}
                            disabled={addOrder.IsGuestOrder}
                          >
                            <option value="">اختر مستخدم</option>
                            {users.map(user => (
                              <option key={user.Id} value={user.Id}>
                                {user.FirstName} {user.LastName}
                              </option>
                            ))}
                          </select>
                          <div className="form-check mt-2">
                            <input
                              id="guestOrder"
                              className="form-check-input"
                              type="checkbox"
                              checked={addOrder.IsGuestOrder}
                              onChange={e => {
                                const isGuest = e.target.checked;
                                setAddOrder({ 
                                  ...addOrder, 
                                  IsGuestOrder: isGuest,
                                  UserId: isGuest ? "" : addOrder.UserId // إذا كان guest، امسح UserId
                                });
                              }}
                            />
                            <label className="form-check-label" htmlFor="guestOrder">
                              طلب ضيف (بدون اختيار مستخدم)
                            </label>
                          </div>
                        </div>
                        {/* بيانات العميل */}
                        <div className="col-md-6 mb-3">
                          <label className="mb-1">الاسم الأول</label>
                          <input
                            type="text"
                            className="form-control"
                            value={addOrder.FirstName}
                            onChange={e => setAddOrder({ ...addOrder, FirstName: e.target.value })}
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="mb-1">اسم العائلة</label>
                          <input
                            type="text"
                            className="form-control"
                            value={addOrder.LastName}
                            onChange={e => setAddOrder({ ...addOrder, LastName: e.target.value })}
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="mb-1">رقم الهاتف</label>
                          <input
                            type="tel"
                            className="form-control"
                            value={addOrder.MobileNumber}
                            onChange={e => setAddOrder({ ...addOrder, MobileNumber: e.target.value })}
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="mb-1">المحافظة</label>
                          <input
                            type="text"
                            className="form-control"
                            value={addOrder.Governorate}
                            onChange={e => setAddOrder({ ...addOrder, Governorate: e.target.value })}
                          />
                        </div>
                        <div className="col-12 mb-3">
                          <label className="mb-1">العنوان</label>
                          <input
                            type="text"
                            className="form-control"
                            value={addOrder.Address}
                            onChange={e => setAddOrder({ ...addOrder, Address: e.target.value })}
                          />
                        </div>
                        {/* طريقة الدفع */}
                        <div className="col-md-6 mb-3">
                          <label className="mb-1">طريقة الدفع</label>
                          <select
                            className="form-select"
                            value={addOrder.PaymentMethod}
                            onChange={e => setAddOrder({ ...addOrder, PaymentMethod: e.target.value })}
                          >
                            <option value="CashOnDelivery">الدفع عند الاستلام</option>
                            <option value="CardOrWallet">محفظة/بطاقة</option>
                          </select>
                        </div>
                        {/* المنتجات */}
                        <div className="col-12 mb-3">
                          <label className="mb-1">المنتجات</label>
                          <table className="table text-center table-hover table-bordered ">
                            <thead>
                              <tr>
                                <th>الاسم</th>
                                <th>الكمية</th>
                                <th>حذف</th>
                              </tr>
                            </thead>
                            <tbody>
                              {addOrder.OrderItems.map((item: any, idx: number) => (
                                <tr key={idx}>
                                  <td>{getProductName(item.ProductId)}</td>
                                  <td>
                                    <input
                                      type="number"
                                      min={1}
                                      className="form-control"
                                      value={item.Quantity}
                                      onChange={e => {
                                        const val = Number(e.target.value);
                                        setAddOrder({
                                          ...addOrder,
                                          OrderItems: addOrder.OrderItems.map((it: any, i: number) =>
                                            i === idx ? { ...it, Quantity: val } : it
                                          ),
                                        });
                                      }}
                                    />
                                  </td>
                                  <td>
                                    <FontAwesomeIcon icon={faTrash}
                                      className="text-danger"
                                      style={{ fontSize: "18px", cursor: "pointer", transform: "translateY(50%)" }}
                                      onClick={() => {
                                        setAddOrder({
                                          ...addOrder,
                                          OrderItems: addOrder.OrderItems.filter((_: any, i: number) => i !== idx),
                                        });
                                      }}
                                    />
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          {/* إضافة منتج جديد */}
                          <div className="d-flex align-items-center gap-2 mb-2">
                            <select
                              className="form-select"
                              style={{ maxWidth: 200 }}
                              value={newProductId ?? ""}
                              onChange={e => setNewProductId(Number(e.target.value))}
                            >
                              <option value="">اختر منتج</option>
                              {products.map(prod => (
                                <option key={prod.Id} value={prod.Id}>{prod.Name}</option>
                              ))}
                            </select>
                            <input
                              type="number"
                              min={1}
                              className="form-control"
                              style={{ maxWidth: 100 }}
                              value={newProductQty}
                              onChange={e => setNewProductQty(Number(e.target.value))}
                            />
                            <button
                              className="btn btn-primary"
                              onClick={() => {
                                if (!newProductId) return;
                                if (addOrder.OrderItems.some((it: any) => it.ProductId === newProductId)) return;
                                setAddOrder({
                                  ...addOrder,
                                  OrderItems: [
                                    ...addOrder.OrderItems,
                                    { ProductId: newProductId, Quantity: newProductQty, Price: 0 },
                                  ],
                                });
                                setNewProductId(null);
                                setNewProductQty(1);
                              }}
                            >
                               إضافة
                            </button>
                          </div>
                        </div>
                        {/* الحالة */}
                        <div className="col-12 mb-3">
                          <label className="mb-1">حالة الدفع</label>
                          <select
                            className="form-select"
                            value={addOrder.PaymentStatus}
                            onChange={e => setAddOrder({ ...addOrder, PaymentStatus: e.target.value })}
                          >
                            <option value="Paid">مدفوع</option>
                            <option value="Cancelled">ملغي</option>
                            <option value="Pending">قيد الانتظار</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                </Modal.Body>
                <Modal.Footer>
                  {modalMode === 'edit' && (
                    <>
                      <button className="btn btn-success w-100" style={{ fontSize: '0.9rem', border: "none" }} onClick={updateOrder}>تعديل الطلب</button>
                      <button
                        className="btn btn-danger w-100"
                        style={{ fontSize: '0.9rem', border: "none", backgroundColor: "#dc3545" }}
                        onClick={() => selectedOrder && deleteOrder(selectedOrder.Id)}
                      >
                        حذف الطلب
                      </button>
                    </>
                  )}
                  {modalMode === 'add' && (
                    <button className="btn btn-success w-100" style={{ fontSize: '0.9rem', border: "none" }} onClick={createOrder}>إضافة الطلب</button>
                  )}
                </Modal.Footer>
              </Modal>
              <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", marginTop: "1.5rem" }}>
                <Stack spacing={2}>
                  <Pagination count={pagination.TotalPages}  page={pagination.CurrentPage} variant="outlined" shape="rounded" onChange={(e,value)=>setPagination((prev)=>({...prev,CurrentPage:value}))} />
                </Stack>
              </div>
            </motion.div>
        </div>
      )}
    </motion.div>
  );
}

export default Orders;
