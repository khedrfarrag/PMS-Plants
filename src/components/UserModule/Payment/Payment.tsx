import React, { useContext, useEffect, useState, useCallback } from "react";
import { AuthContext } from "../../../context/Context";
import { CartshopContext } from "../../../context/CartshopContext";
import Style from "./style/Style.module.css";
import { useForm } from "react-hook-form";
import axios from "axios";
import {
  authEndPoint,
  cartShopPoint,
  ImgURLBeasd,
  siteFeedbackPoint,
} from "../../../constant/Const";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSpinner,
  faStar,
  faTrash,
  faMinus,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import image from "../../../assets/svg/userimg.svg";
import { useArabicNumbers } from "../../../context/ArabicNumbersContext";

// Interface for pending checkout data
interface PendingCheckout {
  transactionId: string;
  paymentUrl: string;
  totalPrice: number;
  createdAt: string;
  userId?: string | number;
  sessionId?: string;
  firstName: string;
  lastName: string;
  mobileNumber: string;
  address: string;
  governorate: string;
  paymentMethod: string;
  cartItems: any[];
  totalQuantity: number;
}

interface FormData {
  IsGuestOrder: boolean;
  FirstName: string;
  LastName: string;
  MobileNumber: string;
  Address: string;
  Governorate: string;
  PaymentMethod: string;
}

interface UserProfile {
  Data: {
    Id: number;
    FirstName: string;
    LastName: string;
    PhoneNumber: string;
    City: string;
    Email: string;
    ImageUrl: string;
  };
}

type CartItem = {
  CartItems: {
    Id: number;
    ProductId: number;
    ProductName: string;
    Price: number;
    Quantity: number;
    TotalPrice: number;
    ImageUrl: string;
    AverageRate: number;
    Description: string;
  }[];
  Id: number;
  UserId: string;
  TotalQuantity: number;
  TotalPrice: number;
};

function Payment() {
  const governoratesList = [
    { id: 1, name: "Cairo" },
    { id: 2, name: "Giza" },
    { id: 3, name: "Alexandria" },
    { id: 4, name: "Dakahlia" },
    { id: 5, name: "RedSea" },
    { id: 6, name: "Beheira" },
    { id: 7, name: "Fayoum" },
    { id: 8, name: "Gharbia" },
    { id: 9, name: "Ismailia" },
    { id: 10, name: "Menoufia" },
    { id: 11, name: "Minya" },
    { id: 12, name: "Qaliubiya" },
    { id: 13, name: "NewValley" },
    { id: 14, name: "Suez" },
    { id: 15, name: "Aswan" },
    { id: 16, name: "Assiut" },
    { id: 17, name: "BeniSuef" },
    { id: 18, name: "PortSaid" },
    { id: 19, name: "Damietta" },
    { id: 20, name: "Sharqia" },
    { id: 21, name: "SouthSinai" },
    { id: 22, name: "KafrElSheikh" },
    { id: 23, name: "Matrouh" },
    { id: 24, name: "Luxor" },
    { id: 25, name: "Qena" },
    { id: 26, name: "NorthSinai" },
    { id: 27, name: "Sohag" },
  ];
  const { userData }: any | null = useContext(AuthContext);
  const { fetchCart } = useContext(CartshopContext) || {};
  const { formatArabicNumber, formatArabicPrice } = useArabicNumbers();
  const UserId = userData?.userId;
  const [submitLoading, setSubmitLoading] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [cart, setCart] = useState<CartItem>();
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submittingRating, setSubmittingRating] = useState(false);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const [loadingStates, setLoadingStates] = useState<{
    [key: number]: boolean;
    cart?: boolean;
  }>({});
  const [updatingItems, setUpdatingItems] = useState<{
    [key: number]: boolean;
  }>({});

  const navigate = useNavigate();
  const location = useLocation();
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      IsGuestOrder: !UserId ? true : false,
      FirstName: "",
      LastName: "",
      MobileNumber: "",
      Address: "",
      Governorate: "",
      PaymentMethod: "CashOnDelivery",
    },
    mode: "onBlur",
  });

  // Helper functions for pending checkout
  const createPendingCheckout = (orderData: PendingCheckout) => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    try {
      if (token && UserId) {
        // مستخدم مسجل: استخدم localStorage
        localStorage.setItem("pendingCheckout", JSON.stringify(orderData));
      } else {
        // ضيف: استخدم sessionStorage
        sessionStorage.setItem("pendingCheckout", JSON.stringify(orderData));
      }
    } catch (error) {
      console.error("Error saving pending checkout:", error);
      toast.error("حدث خطأ في حفظ بيانات الطلب");
    }
  };

  const checkPendingCheckout = (): PendingCheckout | null => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    if (token && UserId) {
      // فحص localStorage للمستخدمين المسجلين
      const localPending = localStorage.getItem("pendingCheckout");
      if (localPending) {
        try {
          const pendingData = JSON.parse(localPending);
          // تحقق من أن البيانات تخص المستخدم الحالي
          if (pendingData.userId === UserId) {
            return pendingData;
          } else {
            // إذا كان المستخدم مختلف، احذف البيانات القديمة
            localStorage.removeItem("pendingCheckout");
          }
        } catch (error) {
          console.error("Error parsing localStorage pendingCheckout:", error);
          localStorage.removeItem("pendingCheckout");
        }
      }
    } else {
      // فحص sessionStorage للضيوف
      const sessionPending = sessionStorage.getItem("pendingCheckout");
      if (sessionPending) {
        try {
          const pendingData = JSON.parse(sessionPending);
          return pendingData;
        } catch (error) {
          console.error("Error parsing sessionStorage pendingCheckout:", error);
          sessionStorage.removeItem("pendingCheckout");
        }
      }
    }

    return null;
  };

  const clearPendingCheckout = () => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    try {
      if (token && UserId) {
        localStorage.removeItem("pendingCheckout");
      } else {
        sessionStorage.removeItem("pendingCheckout");
      }
    } catch (error) {
      console.error("Error clearing pending checkout:", error);
    }
  };

  const onSubmit = async (data: FormData) => {
    setSubmitLoading(true);
    try {
      const isGuestOrder = !UserId;
      const sessionId = sessionStorage.getItem("session-Id");

      const fd = new FormData();
      fd.append("IsGuestOrder", String(isGuestOrder));
      fd.append("FirstName", data.FirstName);
      fd.append("LastName", data.LastName);
      fd.append("MobileNumber", data.MobileNumber);
      fd.append("Address", data.Address);
      fd.append("Governorate", data.Governorate);
      fd.append("PaymentMethod", data.PaymentMethod);

      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const headers: any = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;
      if (sessionId) headers["session-Id"] = sessionId; // إرسال دائم إن وُجد

      const response = await axios.post(cartShopPoint.CheckoutToPay, fd, {
        headers,
      });

      if (response.data.Succeeded) {
        const paymentUrl = response.data.Data?.PaymentUrl;
        const transactionId = response.data.Data?.TransactionId;

        // تحديث السلة في الناف بار بعد إرسال الطلب بنجاح
        if (fetchCart) {
          await fetchCart();
        }

        if (paymentUrl) {
          toast.success("تم إنشاء رابط الدفع بنجاح");

          // إنشاء pendingCheckout
          const orderData: PendingCheckout = {
            transactionId,
            paymentUrl,
            createdAt: new Date().toISOString(),
            totalPrice: cart?.TotalPrice || 0,
            userId: UserId || undefined,
            sessionId: sessionId || undefined,
            firstName: data.FirstName,
            lastName: data.LastName,
            mobileNumber: data.MobileNumber,
            address: data.Address,
            governorate: data.Governorate,
            paymentMethod: data.PaymentMethod,
            cartItems: cart?.CartItems || [],
            totalQuantity: cart?.TotalQuantity || 0,
          };

          createPendingCheckout(orderData);

          // عرض شاشة التأكيد
          setOrderConfirmed(true);
          setOrderDetails(orderData);
          setSubmitLoading(false);

          // افتح صفحة الدفع في تبويب جديد
          window.open(paymentUrl, "_blank", "width=800,height=600");
        } else {
          // الدفع عند الاستلام - عرض صفحة التأكيد
          const orderData: PendingCheckout = {
            transactionId,
            paymentUrl: "",
            createdAt: new Date().toISOString(),
            totalPrice: cart?.TotalPrice || 0,
            userId: UserId || undefined,
            sessionId: sessionId || undefined,
            firstName: data.FirstName,
            lastName: data.LastName,
            mobileNumber: data.MobileNumber,
            address: data.Address,
            governorate: data.Governorate,
            paymentMethod: data.PaymentMethod,
            cartItems: cart?.CartItems || [],
            totalQuantity: cart?.TotalQuantity || 0,
          };

          setOrderDetails(orderData);
          setOrderCompleted(true);
          setSubmitLoading(false);
        }
      } else {
        toast.error(response.data.Message || "حدث خطأ أثناء إرسال الطلب");
        setSubmitLoading(false);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.Errors[0]);
      setSubmitLoading(false);
    }
  };

  const Getcartitems = useCallback(async () => {
    setLoadingStates((prev) => ({ ...prev, cart: true }));
    try {
      const sessionId = sessionStorage.getItem("session-Id");
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      const headers: any = {};
      if (sessionId) {
        headers["session-Id"] = sessionId;
      }
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await axios.get<CartItem>(cartShopPoint.GetAllCartShop, {
        headers,
      });

      if (response?.data) {
        if (response.data.CartItems && Array.isArray(response.data.CartItems)) {
          setCart(response.data);
        } else {
          setCart(undefined);
        }
      } else {
        setCart(undefined);
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        setCart(undefined);
      } else if (error.response?.status !== 401) {
        toast.error("فشل في جلب عناصر السلة");
      }
    } finally {
      setLoadingStates((prev) => ({ ...prev, cart: false }));
    }
  }, []);

  const CheangeQuantity = async (id: number, newQuantity: number) => {
    if (!cart) return;
    if (newQuantity < 1) return;

    setUpdatingItems((prev) => ({ ...prev, [id]: true }));

    const prevCart = { ...cart, CartItems: [...cart.CartItems] };
    const updatedCartItems = cart.CartItems.map((item) =>
      item.Id === id
        ? {
            ...item,
            Quantity: newQuantity,
            TotalPrice: item.Price * newQuantity,
          }
        : item
    );

    const newTotalPrice = updatedCartItems.reduce(
      (sum, item) => sum + item.TotalPrice,
      0
    );
    const newTotalQuantity = updatedCartItems.reduce(
      (sum, item) => sum + item.Quantity,
      0
    );

    setCart({
      ...cart,
      CartItems: updatedCartItems,
      TotalPrice: newTotalPrice,
      TotalQuantity: newTotalQuantity,
    });

    try {
      const sessionId = sessionStorage.getItem("session-Id");
      const putHeaders: any = {
        Authorization: `Bearer ${
          localStorage.getItem("token") || sessionStorage.getItem("token")
        }`,
      };
      if (sessionId) putHeaders["session-Id"] = sessionId;

      await axios.put(
        `${cartShopPoint.Put(id)}`,
        { Quantity: newQuantity },
        {
          headers: putHeaders,
        }
      );

      // تحديث السلة في الناف بار بعد تغيير الكمية
      if (fetchCart) {
        await fetchCart();
      }

      toast.success("تم تحديث الكمية بنجاح");
    } catch (error: any) {
      setCart(prevCart);
      toast.error(error.message || "حدث خطأ أثناء تعديل الكمية");
    } finally {
      setUpdatingItems((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleDelete = async (productId: number) => {
    setLoadingStates((prev) => ({ ...prev, [productId]: true }));
    try {
      const sessionId = sessionStorage.getItem("session-Id");
      const delHeaders: any = {
        Authorization: `Bearer ${
          localStorage.getItem("token") || sessionStorage.getItem("token")
        }`,
      };
      if (sessionId) delHeaders["session-Id"] = sessionId;

      await axios.delete(cartShopPoint.Delete(productId), {
        headers: delHeaders,
      });
      await Getcartitems();

      // تحديث السلة في الناف بار بعد حذف المنتج
      if (fetchCart) {
        await fetchCart();
      }

      toast.success("تمت إزالة المنتج من السلة بنجاح");
    } catch (errors: any) {
      toast.error(errors.response?.Data?.message || "حدث خطأ أثناء حذف المنتج");
    } finally {
      setLoadingStates((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const getmyprofile = async () => {
    try {
      const response = await axios.get<UserProfile>(authEndPoint.GetMyProfile, {
        headers: {
          Authorization: `Bearer ${
            localStorage.getItem("token") || sessionStorage.getItem("token")
          }`,
        },
      });
    } catch (error) {
      // Handle error silently
    }
  };

  const handleReset = () => {
    reset();
  };

  // دالة إرسال تقييم الموقع
  const submitSiteRating = async () => {
    if (rating === 0) {
      toast.error("يرجى اختيار تقييم للموقع");
      return;
    }

    setSubmittingRating(true);
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const headers: any = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const ratingData = {
        UserId: UserId || "",
        Rating: rating,
        Comment: comment.trim() || "",
      };

      await axios.post(siteFeedbackPoint.Post, ratingData, { headers });

      toast.success("شكراً لك! تم إرسال تقييمك بنجاح");
      setShowRating(false);
      setRating(0);
      setComment("");
      setRatingSubmitted(true);
    } catch (error: any) {
      console.error("Error submitting rating:", error);
      toast.error("حدث خطأ أثناء إرسال التقييم");
    } finally {
      setSubmittingRating(false);
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <FontAwesomeIcon key={i} icon={faStar} className={Style.starFilled} />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <FontAwesomeIcon key={i} icon={faStar} className={Style.starHalf} />
        );
      } else {
        stars.push(
          <FontAwesomeIcon key={i} icon={faStar} className={Style.starEmpty} />
        );
      }
    }
    return stars;
  };
  // استعادة عملية دفع معلّقة من الجلسة (إن وُجدت)
  useEffect(() => {
    const pendingData = checkPendingCheckout();
    if (pendingData) {
      // تحقق من صلاحية البيانات (ساعة واحدة)
      const TTL_MS = 60 * 60 * 1000;
      const createdAt = new Date(pendingData.createdAt).getTime();
      const now = Date.now();

      if (pendingData.createdAt && now - createdAt <= TTL_MS) {
        setOrderDetails(pendingData);

        // تحديد نوع الطلب بناءً على وجود paymentUrl
        if (pendingData.paymentUrl && pendingData.paymentUrl.trim() !== "") {
          setOrderConfirmed(true);
        } else {
          setOrderCompleted(true);
        }
      } else {
        // البيانات منتهية الصلاحية
        clearPendingCheckout();
      }
    }
  }, [UserId]); // يعمل عند تغيير المستخدم
  useEffect(() => {
    Getcartitems();
  }, []);

  useEffect(() => {
    if (UserId) {
      getmyprofile();
    }
  }, [UserId]);

  // إظهار التقييم تلقائياً بعد إتمام الطلب
  useEffect(() => {
    if ((orderConfirmed || orderCompleted) && !ratingSubmitted && !showRating) {
      // تأخير قليل لإظهار التقييم بعد عرض صفحة التأكيد
      const timer = setTimeout(() => {
        setShowRating(true);
      }, 2000); // 2 ثانية بعد إتمام الطلب

      return () => clearTimeout(timer);
    }
  }, [orderConfirmed, orderCompleted, ratingSubmitted, showRating]);

  useEffect(() => {
    const hasPending = !!sessionStorage.getItem("pendingCheckout");
    const fromCart = !!location.state?.fromCart;
    const cartEmpty = !cart || (cart && cart.CartItems.length === 0);
    // اذا جاء من صفحة الكارت، لا تعيد توجيهه حتى لو السلة فاضية، اتركه يملأ النموذج
    if (
      !loadingStates.cart &&
      cartEmpty &&
      !hasPending &&
      !fromCart &&
      !orderConfirmed &&
      !orderCompleted
    ) {
      navigate("/store/productcart");
    }
  }, [
    cart,
    loadingStates.cart,
    navigate,
    location.state,
    orderConfirmed,
    orderCompleted,
  ]);

  if (loadingStates.cart) {
    return (
      <div className={Style.loadingContainer}>
        <FontAwesomeIcon
          icon={faSpinner}
          spin
          size="3x"
          style={{ color: "#009247" }}
        />
        <p>جاري تحميل تفاصيل الطلب...</p>
      </div>
    );
  }

  // صفحة تأكيد الطلب للدفع الإلكتروني
  if (orderConfirmed && orderDetails) {
    return (
      <div className={Style.paymentContainer}>
        <div className={Style.headerSection}>
          <div className={Style.headerCard}>
            <h1 className={Style.headerTitle}>
              <span>✅</span>
              تم تأكيد الطلب بنجاح
              <span>✅</span>
            </h1>
            <p className={Style.headerSubtitle}>
              رقم المعاملة: {orderDetails.transactionId}
            </p>
          </div>
        </div>
        <div className={Style.orderSummarySection}>
          <div className={Style.summaryHeader}>
            <h2 className={Style.summaryTitle}>
              <span>📋</span>
              تفاصيل الطلب
            </h2>
          </div>

          <div className={Style.orderDetails}>
            <div className={Style.detailRow}>
              <span>الاسم:</span>
              <span>
                {orderDetails.orderData?.FirstName ??
                  orderDetails.firstName ??
                  ""}{" "}
                {orderDetails.orderData?.LastName ??
                  orderDetails.lastName ??
                  ""}
              </span>
            </div>
            <div className={Style.detailRow}>
              <span>رقم الهاتف:</span>
              <span>
                {orderDetails.orderData?.MobileNumber ??
                  orderDetails.mobileNumber ??
                  "-"}
              </span>
            </div>
            <div className={Style.detailRow}>
              <span>العنوان:</span>
              <span>
                {orderDetails.orderData?.Address ?? orderDetails.address ?? "-"}
                {orderDetails.orderData?.Governorate || orderDetails.governorate
                  ? `, ${
                      orderDetails.orderData?.Governorate ??
                      orderDetails.governorate
                    }`
                  : ""}
              </span>
            </div>
            <div className={Style.detailRow}>
              <span>طريقة الدفع:</span>
              <span>
                {(orderDetails.orderData?.PaymentMethod ??
                  orderDetails.paymentMethod) === "CashOnDelivery"
                  ? "الدفع عند الاستلام"
                  : "بطاقة أو محفظة إلكترونية"}
              </span>
            </div>
            <div className={Style.detailRow}>
              <span>المجموع:</span>
              <span className={Style.finalTotal}>
                {formatArabicPrice(orderDetails.totalPrice || 0)}
              </span>
            </div>
          </div>

          <div className={Style.paymentActions}>
            <button
              className={Style.primaryButton}
              onClick={async () => {
                // تحديث السلة في الناف بار قبل فتح صفحة الدفع
                if (fetchCart) {
                  await fetchCart();
                }

                window.open(
                  orderDetails.paymentUrl,
                  "_blank",
                  "width=800,height=600"
                );
              }}
            >
              <span>💳</span>
              إتمام الدفع الآن
            </button>

            <button
              className={Style.cancelButton}
              onClick={async () => {
                clearPendingCheckout();
                setOrderConfirmed(false);
                setOrderDetails(null);

                // تحديث السلة في الناف بار بعد إلغاء الطلب
                if (fetchCart) {
                  await fetchCart();
                }

                toast.success("تم إلغاء الطلب بنجاح");
                navigate("/store/productcart");
              }}
            >
              <span>❌</span>
              إلغاء الطلب
            </button>

            <button
              className={Style.secondaryButton}
              onClick={async () => {
                setOrderConfirmed(false);
                setOrderDetails(null);
                reset();

                // تحديث السلة في الناف بار
                if (fetchCart) {
                  await fetchCart();
                }

                navigate("/");
              }}
            >
              <span>🏠</span>
              العودة للصفحة الرئيسية
            </button>
          </div>

          {/* قسم تقييم الموقع */}
          {!showRating && (
            <div className={Style.ratingSection}>
              <div className={Style.ratingCard}>
                <h3 className={Style.ratingTitle}>
                  <span>⭐</span>
                  كيف تقيّم تجربتك معنا؟
                </h3>
                <p className={Style.ratingSubtitle}>
                  آراؤكم مهمة لنا لتحسين خدماتنا
                </p>
                <button
                  className={Style.ratingButton}
                  onClick={() => setShowRating(true)}
                >
                  <span>💬</span>
                  تقييم الموقع
                </button>
              </div>
            </div>
          )}

          {showRating && (
            <div className={Style.ratingForm}>
              <div className={Style.ratingFormCard}>
                <h3 className={Style.ratingFormTitle}>
                  <span>⭐</span>
                  تقييم الموقع
                </h3>

                <div className={Style.starsContainer}>
                  <label className={Style.starsLabel}>التقييم:</label>
                  <div className={Style.starsGroup}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className={Style.starButton}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setRating(star)}
                        onMouseLeave={() => setRating(rating)}
                      >
                        <FontAwesomeIcon
                          icon={faStar}
                          className={
                            star <= rating ? Style.starFilled : Style.starEmpty
                          }
                        />
                      </button>
                    ))}
                  </div>
                  <span className={Style.ratingText}>
                    {rating > 0 ? `${formatArabicNumber(rating)} من 5` : "اختر التقييم"}
                  </span>
                </div>

                <div className={Style.commentContainer}>
                  <label className={Style.commentLabel}>
                    تعليقك (اختياري):
                  </label>
                  <textarea
                    className={Style.commentInput}
                    placeholder="اكتب تعليقك هنا..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={3}
                    maxLength={500}
                  />
                  <span className={Style.commentCounter}>
                    {formatArabicNumber(comment.length)}/500
                  </span>
                </div>

                <div className={Style.ratingActions}>
                  <button
                    type="button"
                    className={Style.submitRatingButton}
                    onClick={submitSiteRating}
                    disabled={submittingRating || rating === 0}
                  >
                    {submittingRating ? (
                      <>
                        <FontAwesomeIcon icon={faSpinner} spin />
                        جاري الإرسال...
                      </>
                    ) : (
                      <>
                        <span>📤</span>
                        إرسال التقييم
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    className={Style.cancelRatingButton}
                    onClick={() => {
                      setShowRating(false);
                      setRating(0);
                      setComment("");
                    }}
                    disabled={submittingRating}
                  >
                    <span>❌</span>
                    إلغاء
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className={Style.paymentInfo}>
            <h3>معلومات مهمة:</h3>
            <ul>
              <li>سيتم التواصل معك قريباً لتأكيد الطلب</li>
              <li>يمكنك متابعة حالة الطلب من خلال رقم المعاملة</li>
              <li>
                في حالة الدفع الإلكتروني، سيتم إرسال رابط الدفع عبر البريد
                الإلكتروني
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // صفحة تأكيد الطلب للدفع عند الاستلام
  if (orderCompleted && orderDetails) {
    return (
      <div className={Style.paymentContainer}>
        <div className={Style.headerSection}>
          <div className={Style.headerCard}>
            <h1 className={Style.headerTitle}>
              <span>✅</span>
              تم إرسال طلبك بنجاح
              <span>✅</span>
            </h1>
            {orderDetails.sessionId && (
              <p className={Style.headerSubtitle}>
                رقم الطلب: {orderDetails.sessionId}
              </p>
            )}
            <p
              className={Style.headerSubtitle}
              style={{ color: "#666", fontSize: "16px", marginTop: "8px" }}
            >
              سيتم التواصل معك قريباً لتأكيد الطلب والتوصيل
            </p>
          </div>
        </div>

        <div className={Style.orderSummarySection}>
          <div className={Style.summaryHeader}>
            <h2 className={Style.summaryTitle}>
              <span>📋</span>
              تفاصيل الطلب
            </h2>
          </div>

          <div className={Style.orderDetails}>
            <div className={Style.detailRow}>
              <span>الاسم:</span>
              <span>
                {orderDetails.orderData?.FirstName ??
                  orderDetails.firstName ??
                  ""}{" "}
                {orderDetails.orderData?.LastName ??
                  orderDetails.lastName ??
                  ""}
              </span>
            </div>
            <div className={Style.detailRow}>
              <span>رقم الهاتف:</span>
              <span>
                {orderDetails.orderData?.MobileNumber ??
                  orderDetails.mobileNumber ??
                  "-"}
              </span>
            </div>
            <div className={Style.detailRow}>
              <span>العنوان:</span>
              <span>
                {orderDetails.orderData?.Address ?? orderDetails.address ?? "-"}
                {orderDetails.orderData?.Governorate || orderDetails.governorate
                  ? `, ${
                      orderDetails.orderData?.Governorate ??
                      orderDetails.governorate
                    }`
                  : ""}
              </span>
            </div>
            <div className={Style.detailRow}>
              <span>طريقة الدفع:</span>
              <span>الدفع عند الاستلام</span>
            </div>
            <div className={Style.detailRow}>
              <span>المجموع:</span>
              <span className={Style.finalTotal}>
                {formatArabicPrice(orderDetails.totalPrice || 0)}
              </span>
            </div>
          </div>

          <div className={Style.paymentActions}>
            <button
              className={Style.primaryButton}
              onClick={async () => {
                setOrderCompleted(false);
                setOrderDetails(null);
                reset();

                // تحديث السلة في الناف بار
                if (fetchCart) {
                  await fetchCart();
                }

                navigate("/");
              }}
            >
              <span>🏠</span>
              العودة للصفحة الرئيسية
            </button>

            <button
              className={Style.secondaryButton}
              onClick={async () => {
                setOrderCompleted(false);
                setOrderDetails(null);
                reset();

                // تحديث السلة في الناف بار
                if (fetchCart) {
                  await fetchCart();
                }

                navigate("/store");
              }}
            >
              <span>🛒</span>
              متابعة التسوق
            </button>
          </div>

          {/* قسم تقييم الموقع */}
          {!showRating && (
            <div className={Style.ratingSection}>
              <div className={Style.ratingCard}>
                <h3 className={Style.ratingTitle}>
                  <span>⭐</span>
                  كيف تقيّم تجربتك معنا؟
                </h3>
                <p className={Style.ratingSubtitle}>
                  آراؤكم مهمة لنا لتحسين خدماتنا
                </p>
                <button
                  className={Style.ratingButton}
                  onClick={() => setShowRating(true)}
                >
                  <span>💬</span>
                  تقييم الموقع
                </button>
              </div>
            </div>
          )}

          {showRating && (
            <div className={Style.ratingForm}>
              <div className={Style.ratingFormCard}>
                <h3 className={Style.ratingFormTitle}>
                  <span>⭐</span>
                  تقييم الموقع
                </h3>

                <div className={Style.starsContainer}>
                  <label className={Style.starsLabel}>التقييم:</label>
                  <div className={Style.starsGroup}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className={Style.starButton}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setRating(star)}
                        onMouseLeave={() => setRating(rating)}
                      >
                        <FontAwesomeIcon
                          icon={faStar}
                          className={
                            star <= rating ? Style.starFilled : Style.starEmpty
                          }
                        />
                      </button>
                    ))}
                  </div>
                  <span className={Style.ratingText}>
                    {rating > 0 ? `${formatArabicNumber(rating)} من 5` : "اختر التقييم"}
                  </span>
                </div>

                <div className={Style.commentContainer}>
                  <label className={Style.commentLabel}>
                    تعليقك (اختياري):
                  </label>
                  <textarea
                    className={Style.commentInput}
                    placeholder="اكتب تعليقك هنا..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={3}
                    maxLength={500}
                  />
                  <span className={Style.commentCounter}>
                    {formatArabicNumber(comment.length)}/500
                  </span>
                </div>

                <div className={Style.ratingActions}>
                  <button
                    type="button"
                    className={Style.submitRatingButton}
                    onClick={submitSiteRating}
                    disabled={submittingRating || rating === 0}
                  >
                    {submittingRating ? (
                      <>
                        <FontAwesomeIcon icon={faSpinner} spin />
                        جاري الإرسال...
                      </>
                    ) : (
                      <>
                        <span>📤</span>
                        إرسال التقييم
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    className={Style.cancelRatingButton}
                    onClick={() => {
                      setShowRating(false);
                      setRating(0);
                      setComment("");
                    }}
                    disabled={submittingRating}
                  >
                    <span>❌</span>
                    إلغاء
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className={Style.paymentInfo}>
            <h3>معلومات مهمة:</h3>
            <ul>
              <li>سيتم التواصل معك قريباً لتأكيد الطلب</li>
              <li>يمكنك متابعة حالة الطلب من خلال رقم الطلب</li>
              <li>سيتم التوصيل خلال 2-3 أيام عمل</li>
              <li>الدفع عند استلام المنتجات</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={Style.paymentContainer}>
      <div className={Style.headerSection}>
        <div className={Style.headerCard}>
          <h1 className={Style.headerTitle}>
            <span>🌾</span>
            إتمام الطلب
            <span>🌾</span>
          </h1>
          <p className={Style.headerSubtitle}>
            {userData
              ? `مرحباً ${userData.name || "المستخدم"}`
              : "إتمام الطلب كضيف"}
          </p>
        </div>
      </div>

      {cart && cart.CartItems && cart.CartItems.length > 0 ? (
        <div className={Style.orderSummarySection}>
          <div className={Style.summaryHeader}>
            <h2 className={Style.summaryTitle}>
              <span>🛒</span>
              ملخص الطلب
            </h2>
            <div className={Style.summaryStats}>
              <span className={Style.itemsCount}>
                {formatArabicNumber(cart.TotalQuantity)} عنصر
              </span>
              <span className={Style.totalAmount}>
                {formatArabicPrice(cart.TotalPrice)}
              </span>
            </div>
          </div>

          <div className={Style.productsList}>
            {cart.CartItems.map((item) => (
              <div key={item.Id} className={Style.productItem}>
                <div className={Style.productImage}>
                  <img
                    src={`${ImgURLBeasd}/${item?.ImageUrl}`}
                    alt={item.ProductName}
                    onError={(e) => {
                      e.currentTarget.src = image;
                    }}
                  />
                </div>

                <div className={Style.productDetails}>
                  <h3 className={Style.productName}>{item.ProductName}</h3>
                  {/* <p className={Style.productDescription}>{item.Description}</p> */}

                  <div className={Style.productRating}>
                    <div className={Style.stars}>
                      {renderStars(item.AverageRate)}
                    </div>
                    <span className={Style.ratingText}>
                      {formatArabicNumber(parseFloat(item.AverageRate.toFixed(1)))} من 5
                    </span>
                  </div>

                  <div className={Style.productPrice}>
                    <span className={Style.unitPrice}>
                      {formatArabicPrice(item.Price)} للقطعة
                    </span>
                  </div>
                </div>

                <div className={Style.productActions}>
                  <div className={Style.quantityControl}>
                    <button
                      className={Style.quantityBtn}
                      onClick={() =>
                        CheangeQuantity(item.Id, item.Quantity - 1)
                      }
                      disabled={item.Quantity <= 1 || updatingItems[item.Id]}
                    >
                      <FontAwesomeIcon icon={faMinus} />
                    </button>
                    <span className={Style.quantityValue}>
                      {updatingItems[item.Id] ? (
                        <FontAwesomeIcon icon={faSpinner} spin />
                      ) : (
                        formatArabicNumber(item.Quantity)
                      )}
                    </span>
                    <button
                      className={Style.quantityBtn}
                      onClick={() =>
                        CheangeQuantity(item.Id, item.Quantity + 1)
                      }
                      disabled={updatingItems[item.Id]}
                    >
                      <FontAwesomeIcon icon={faPlus} />
                    </button>
                  </div>

                  <div className={Style.productTotal}>
                    <span className={Style.totalPrice}>
                      {formatArabicPrice(item.TotalPrice)}
                    </span>
                  </div>

                  <button
                    className={Style.removeBtn}
                    onClick={() => handleDelete(item.Id)}
                    disabled={loadingStates[item.Id]}
                    title="حذف من السلة"
                  >
                    <FontAwesomeIcon
                      icon={loadingStates[item.Id] ? faSpinner : faTrash}
                      spin={loadingStates[item.Id]}
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className={Style.orderTotal}>
            <div className={Style.totalRow}>
              <span>عدد العناصر:</span>
              <span>{formatArabicNumber(cart.TotalQuantity)}</span>
            </div>
            <div className={Style.totalRow}>
              <span>المجموع الكلي:</span>
              <span className={Style.finalTotal}>
                {formatArabicPrice(cart.TotalPrice)}
              </span>
            </div>
          </div>
        </div>
      ) : (
        !loadingStates.cart && (
          <div className={Style.emptyCartMessage}>
            <p>لا توجد منتجات في السلة</p>
            <button
              onClick={() => navigate("/store/productcart")}
              className={Style.goToCartButton}
            >
              الذهاب إلى السلة
            </button>
          </div>
        )
      )}

      <form onSubmit={handleSubmit(onSubmit)} className={Style.formSection}>
        <div className={Style.statusCard}>
          <label className={Style.statusLabel}>
            <input
              type="checkbox"
              disabled={userData !== null}
              className={Style.statusCheckbox}
              checked={userData !== null}
              readOnly
            />
            <span className={Style.statusText}>
              {userData ? (
                <>عضو مسجل - {userData.name}</>
              ) : (
                <>
                  <span>👤</span>
                  طلب كضيف
                </>
              )}
            </span>
          </label>
        </div>

        <div className={Style.formGridTwo}>
          <div className={Style.inputGroup}>
            <label className={Style.inputLabel}>
              <span>👤</span>
              الاسم الأول *
            </label>
            <input
              type="text"
              aria-label="FirstName"
              className={Style.inputField}
              placeholder="أدخل الاسم الأول"
              required
              {...register("FirstName", {
                required: "الاسم الأول مطلوب",
                minLength: {
                  value: 2,
                  message: "الاسم الأول يجب أن يكون حرفين على الأقل",
                },
              })}
            />
            {errors.FirstName && (
              <span className={Style.errorMessage}>
                {errors.FirstName?.message}
              </span>
            )}
          </div>

          <div className={Style.inputGroup}>
            <label className={Style.inputLabel}>
              <span>👤</span>
              اسم العائلة *
            </label>
            <input
              type="text"
              aria-label="LastName"
              {...register("LastName", {
                required: "اسم العائلة مطلوب",
                minLength: {
                  value: 2,
                  message: "اسم العائلة يجب أن يكون حرفين على الأقل",
                },
              })}
              className={Style.inputField}
              placeholder="أدخل اسم العائلة"
              required
            />
            {errors.LastName && (
              <span className={Style.errorMessage}>
                {errors.LastName.message}
              </span>
            )}
          </div>
        </div>

        <div className={Style.inputGroup}>
          <label className={Style.inputLabel}>
            <span>📱</span>
            رقم الهاتف *
          </label>
          <input
            type="tel"
            aria-label="MobileNumber"
            className={Style.inputField}
            placeholder="أدخل رقم الهاتف"
            {...register("MobileNumber", {
              required: "رقم الهاتف مطلوب",
              pattern: {
                value: /^01[0-2,5]{1}[0-9]{8}$/,
                message: "رقم الهاتف غير صحيح",
              },
            })}
            required
          />
          {errors.MobileNumber && (
            <span className={Style.errorMessage}>
              {errors.MobileNumber.message}
            </span>
          )}
        </div>

        <div className={Style.inputGroup}>
          <label className={Style.inputLabel}>
            <span>🏠</span>
            العنوان التفصيلي *
          </label>
          <input
            type="text"
            aria-label="Address"
            className={Style.inputField}
            placeholder="أدخل العنوان التفصيلي"
            {...register("Address", {
              required: "العنوان مطلوب",
              minLength: {
                value: 5,
                message: "العنوان يجب أن يكون 5 أحرف على الأقل",
              },
            })}
            required
          />
          {errors.Address && (
            <span className={Style.errorMessage}>{errors.Address.message}</span>
          )}
        </div>

        <div className={Style.inputGroup}>
          <label className={Style.inputLabel}>
            <span>📍</span>
            المحافظة *
          </label>
          <select
            aria-label="Governorate"
            {...register("Governorate", {
              // required: "المحافظة مطلوبة",
            })}
            className={Style.selectField}
            required
          >
            <option value={""} disabled>
                      المدينة
                    </option>
            {governoratesList.map((governorate) => (
                      <option key={governorate.id} value={governorate.name}>
                        {governorate.name}
                      </option>
                    ))}
          </select>

          {errors.Governorate && (
            <span className={Style.errorMessage}>
              {errors.Governorate.message}
            </span>
          )}
        </div>

        <div className={Style.inputGroup}>
          <label className={Style.inputLabel}>
            <span>💳</span>
            طريقة الدفع *
          </label>
          <select
            aria-label="PaymentMethod"
            {...register("PaymentMethod")}
            className={Style.selectField}
            required
          >
            <option value="CashOnDelivery">💰 الدفع عند الاستلام</option>
            <option value="CardOrWallet">💳 بطاقة أو محفظة إلكترونية</option>
          </select>
        </div>

        <div className={Style.buttonSection}>
          <div className={Style.buttonGroup}>
            <button
              type="submit"
              className={Style.primaryButton}
              disabled={submitLoading || !cart || cart.CartItems.length === 0}
            >
              {submitLoading ? (
                <>
                  <div className={Style.loadingSpinner}></div>
                  جاري إرسال الطلب...
                </>
              ) : (
                <>
                  <span>🚀</span>
                  إتمام الطلب - {formatArabicPrice(cart?.TotalPrice || 0)}
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleReset}
              className={Style.secondaryButton}
              disabled={submitLoading}
            >
              <span>🔄</span>
              إعادة تعيين
            </button>
          </div>
        </div>
      </form>

      <div className={Style.footer}>
        <p className={Style.footerText}>
          🌱 الشركة الخليجية شريك نجاح - جودة وثقة منذ سنوات 🌱
        </p>
      </div>
    </div>
  );
}

export default Payment;
