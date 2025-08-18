import Style from "./style/Style.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faHeart,
  faMinus,
  faPlus,
  faSpinner,
  faStar,
  faTrash,
  faShoppingBag,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { useCallback, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import {
  cartShopPoint,
  ImgURLBeasd,
  ProductsPoint,
} from "../../../constant/Const";
import image from "../../../assets/svg/userimg.svg";
import { AuthContext } from "../../../context/Context";
import { CartshopContext } from "../../../context/CartshopContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function Shoppingcart() {
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

  const [cart, setCart] = useState<CartItem>();
  const [isCheckoutLoading, setIsCheckoutLoading] = useState<boolean>(false);
  const [loadingStates, setLoadingStates] = useState<{
    [key: number]: boolean;
    cart?: boolean;
  }>({});
  const [updatingItems, setUpdatingItems] = useState<{
    [key: number]: boolean;
  }>({});
  const navigate = useNavigate();
  const { userData }: null | any = useContext(AuthContext);
  const { fetchCart } = useContext(CartshopContext) || {};
  const UserId = userData?.userId;

  // تعديل الكمية بشكل متفائل (Optimistic UI) مع تحسين UX
  const CheangeQuantity = async (id: number, newQuantity: number) => {
    if (!cart) return;
    if (newQuantity < 1) return;

    // تحديث حالة التحميل للعنصر المحدد
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

    // تحديث السعر الإجمالي
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
      await axios.put(
        `${cartShopPoint.Put(id)}`,
        { Quantity: newQuantity },

        {
          headers: {
            Authorization: `Bearer ${
              localStorage.getItem("token") || sessionStorage.getItem("token")
            }`,
          },
        }
      );
      toast.success("تم تحديث الكمية بنجاح");
      
      // بدلاً من window.location.reload() - تحديث السلة من الـ context
      if (fetchCart) {
        await fetchCart();
      }
    } catch (error: any) {
      setCart(prevCart);
      toast.error(error.message || "حدث خطأ أثناء تعديل الكمية");
    } finally {
      setUpdatingItems((prev) => ({ ...prev, [id]: false }));
    }
  };
  const Getcartitems = useCallback(async () => {
    setLoadingStates((prev) => ({ ...prev, cart: true }));
    try {
      // الحصول على session-Id من sessionStorage
      const sessionId = sessionStorage.getItem("session-Id");

      const headers: any = {
        "session-Id": sessionId, // توحيد التسمية مع Addcartapi
        Authorization: `Bearer ${
          localStorage.getItem("token") || sessionStorage.getItem("token")
        }`,
      };

      const response = await axios.get<CartItem>(cartShopPoint.GetAllCartShop, {
        headers,
      });
      setCart(response?.data);
      console.log("Cart items fetched successfully:", response?.data);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      toast.error("فشل في جلب عناصر السلة");
    } finally {
      setLoadingStates((prev) => ({ ...prev, cart: false }));
    }
  }, []);

  const [favorites, setfavorits] = useState<number[]>([]);
  const Getallfavoret = useCallback(
    async (
      UserId = cart?.UserId,
      pageNumber: number = 1,
      pageSize: number = 10
    ) => {
      try {
        const response = await axios.get(
          ProductsPoint.GetFavorites(UserId, pageNumber, pageSize),
          {
            headers: {
              Authorization: `Bearer ${
                localStorage.getItem("token") || sessionStorage.getItem("token")
              }`,
            },
          }
        );
        setfavorits(response.data.data.map((fav: any) => fav.Id));
      } catch (errors) {
        console.error("Error fetching favorites:", errors);
      }
    },
    [cart?.UserId]
  );

  const handlefavorit = async (userId: string, productId: number) => {
    setLoadingStates((prev) => ({ ...prev, [productId]: true }));
    try {
      if (!UserId) return;
      if (favorites && favorites.includes(productId)) {
        await axios.delete(
          `${ProductsPoint.DeleteFavorites}?userId=${UserId}&productId=${productId}`,
          {
            headers: {
              Authorization: `Bearer ${
                localStorage.getItem("token") || sessionStorage.getItem("token")
              }`,
            },
          }
        );
        toast.success("تمت إزالة المنتج من المفضلة");
      } else {
        await axios.post(
          `${ProductsPoint.AddFavorites(userId, productId)}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${
                localStorage.getItem("token") || sessionStorage.getItem("token")
              }`,
            },
          }
        );
        toast.success("تمت إضافة المنتج إلى المفضلة");
      }
      await Getallfavoret(UserId);
    } catch (error) {
      toast.error("حدث خطأ أثناء تحديث المفضلة");
    } finally {
      setLoadingStates((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const handleDelete = async (productId: number) => {
    setLoadingStates((prev) => ({ ...prev, [productId]: true }));
    try {
      await axios.delete(cartShopPoint.Delete(productId), {
        headers: {
          Authorization: `Bearer ${
            localStorage.getItem("token") || sessionStorage.getItem("token")
          }`,
        },
      });
      await Getcartitems();
      toast.success("تمت إزالة المنتج من السلة بنجاح");
      
      // بدلاً من window.location.reload() - تحديث السلة من الـ context
      if (fetchCart) {
        await fetchCart();
      }
    } catch (errors) {
      console.log(errors);
      toast.error("حدث خطأ أثناء حذف المنتج");
    } finally {
      setLoadingStates((prev) => ({ ...prev, [productId]: false }));
    }
  };

  // دالة الدفع (checkout) - محسنة
  const handleCheckout = async () => {
    navigate("/payment", { state: { fromCart: true } });
 
  };

  useEffect(() => {
    const sessionId = sessionStorage.getItem("session-Id");
    if (UserId || sessionId) {
      Getcartitems();
      Getallfavoret(UserId);
    }
  }, [UserId, Getcartitems, Getallfavoret]);

  // عرض التقييم بالنجوم
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

  if (loadingStates.cart) {
    return (
      <div className={Style.loadingContainer}>
        <FontAwesomeIcon
          icon={faSpinner}
          spin
          size="3x"
          style={{ color: "#009247" }}
        />
        <p>جاري تحميل السلة...</p>
      </div>
    );
  }

  return (
    <div className={Style.shoppingCart}>
      {/* Header */}
      <motion.header
        className={Style.header}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className={Style.headerContent}>
          <button className={Style.backButton} onClick={() => navigate(-1)}>
            <FontAwesomeIcon icon={faArrowLeft} />
            رجوع
          </button>
          <div className={Style.headerInfo}>
            <h1>
              <FontAwesomeIcon icon={faShoppingBag} />
              سلة المشتريات
            </h1>
            <p>{cart?.TotalQuantity || 0} عناصر</p>
          </div>
        </div>
      </motion.header>

      {/* Cart Items */}
      <AnimatePresence>
        {cart?.CartItems && cart.CartItems.length > 0 ? (
          <motion.section
            className={Style.cartItems}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {cart.CartItems.map((item, index) => (
              <motion.div
                className={Style.cartItem}
                key={item.Id}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{
                  y: -2,
                  boxShadow: "0 8px 25px rgba(0, 146, 71, 0.15)",
                }}
              >
                {/* صورة المنتج */}
                <div className={Style.cartItemImage}>
                  <img
                    src={`${ImgURLBeasd}/${item?.ImageUrl}`}
                    alt={item.ProductName}
                    className={Style.image}
                    onError={(e) => {
                      e.currentTarget.src = image;
                    }}
                  />
                  {updatingItems[item.Id] && (
                    <div className={Style.imageOverlay}>
                      <FontAwesomeIcon icon={faSpinner} spin />
                    </div>
                  )}
                </div>

                {/* تفاصيل المنتج */}
                <div className={Style.cartItemDetails}>
                  <div className={Style.productInfo}>
                    <h2>{item.ProductName}</h2>
                    <p>{item.Description}</p>

                    {/* التقييم */}
                    <div className={Style.rating}>
                      <div className={Style.stars}>
                        {renderStars(item.AverageRate)}
                      </div>
                      <span className={Style.ratingText}>
                        {item.AverageRate.toFixed(1)} من 5
                      </span>
                    </div>
                  </div>

                  {/* التحكم في الكمية */}
                  <div className={Style.quantityControl}>
                    <span className={Style.quantityLabel}>الكمية:</span>
                    <div className={Style.quantity}>
                      <button
                        className={`${Style.quantityBtn} ${Style.decrease}`}
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
                          item.Quantity
                        )}
                      </span>
                      <button
                        className={`${Style.quantityBtn} ${Style.increase}`}
                        onClick={() =>
                          CheangeQuantity(item.Id, item.Quantity + 1)
                        }
                        disabled={updatingItems[item.Id]}
                      >
                        <FontAwesomeIcon icon={faPlus} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* الإجراءات والسعر */}
                <div className={Style.cartItemActions}>
                  {/* الإجراءات */}
                  <div className={Style.actions}>
                    <button
                      className={`${Style.actionBtn} ${Style.favoriteBtn} ${
                        favorites?.includes(item.ProductId) ? Style.active : ""
                      }`}
                      onClick={() => handlefavorit(UserId, item.ProductId)}
                      disabled={loadingStates[item.ProductId]}
                      title={
                        favorites?.includes(item.ProductId)
                          ? "إزالة من المفضلة"
                          : "إضافة للمفضلة"
                      }
                    >
                      <FontAwesomeIcon
                        icon={
                          loadingStates[item.ProductId] ? faSpinner : faHeart
                        }
                        spin={loadingStates[item.ProductId]}
                      />
                    </button>

                    <button
                      className={`${Style.actionBtn} ${Style.deleteBtn}`}
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

                  {/* السعر */}
                  <div className={Style.priceInfo}>
                    <div className={Style.price}>
                      <span className={Style.currentPrice}>
                        ${item.TotalPrice.toFixed(2)}
                      </span>
                      {item.TotalPrice !== item.Price && (
                        <span className={Style.originalPrice}>
                          ${item.Price.toFixed(2)}
                        </span>
                      )}
                    </div>
                    {item.TotalPrice !== item.Price && (
                      <span className={Style.savings}>
                        وفر ${(item.Price - item.TotalPrice).toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.section>
        ) : (
          <motion.div
            className={Style.emptyCart}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <FontAwesomeIcon icon={faShoppingBag} size="4x" />
            <h2>السلة فارغة</h2>
            <p>لم تقم بإضافة أي منتجات إلى السلة بعد</p>
            <button
              className={Style.continueShopping}
              onClick={() => navigate("/store")}
            >
              متابعة التسوق
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Summary Section */}
      {cart?.CartItems && cart.CartItems.length > 0 && (
        <motion.footer
          className={Style.summary}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className={Style.summaryDetails}>
            <div className={Style.summaryRow}>
              <span>العدد الإجمالي:</span>
              <span className={Style.totalItems}>{cart?.TotalQuantity}</span>
            </div>
            <div className={Style.summaryRow}>
              <span>السعر الكلي:</span>
              <span className={Style.totalPrice}>
                ${cart?.TotalPrice?.toFixed(2)}
              </span>
            </div>
            <button
              className={`${Style.payNowButton} ${
                isCheckoutLoading ? Style.loading : ""
              }`}
              onClick={handleCheckout}
              disabled={isCheckoutLoading}
            >
              <FontAwesomeIcon
                icon={isCheckoutLoading ? faSpinner : faCartShopping}
                className={`${Style.checkout} ${
                  isCheckoutLoading ? Style.spinning : ""
                }`}
              />
              {isCheckoutLoading ? "جاري المعالجة..." : "إتمام الشراء"}
            </button>
          </div>
        </motion.footer>
      )}
    </div>
  );
}
