import React, { useContext, useEffect, useState } from "react";
import Styles from "../Style.module.css";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowAltCircleLeft,
  faArrowAltCircleRight,
  faEye,
  faHeart,
  faMinus,
  faPlus,
  faStar,
  faSpinner,
  faCheckCircle,
  faExclamationTriangle,
  faClock,
  faShoppingBag,
  faHeartBroken,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  card,
  pagenation,
  ImgURLBeasd,
  ProductsPoint,
} from "../../../../constant/Const";
import { cartShopPoint } from "../../../../constant/Const";
import { AuthContext, AuthContextType } from "../../../../context/Context";
import { CartshopContext } from "../../../../context/CartshopContext";
import { motion, AnimatePresence } from "framer-motion";
import image from "../../../../assets/svg/userimg.svg";
import { useArabicNumbers } from "../../../../context/ArabicNumbersContext";

export default function Popular() {
  interface pagenation {
    CurrentPage: number;
    PageSize: number;
    TotalCount: number;
    TotalPages: number;
  }

  const [count, setCount] = useState(1);
  const [getpopular, setpopular] = useState<card>([]);
  const [pagination, setPagination] = useState<pagenation>();
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [loadingStates, setLoadingStates] = useState<{
    [key: number]: boolean;
    popular?: boolean;
  }>({});
  const [addingToCart, setAddingToCart] = useState<{
    [productId: number]: boolean;
  }>({});
  const itemsPerPage = 10;
  const [counter, setCounter] = useState<{ [productId: number]: number }>({});
  const [cartProductIds, setCartProductIds] = useState<number[]>([]);
  const [cartItems, setCartItems] = useState<any[]>([]);

  // Get user ID from useContext
  const authContext = useContext(AuthContext) as AuthContextType | null;
  const { fetchCart } = useContext(CartshopContext) || {};
  const { formatArabicNumber, formatArabicPrice, formatArabicPercentage } = useArabicNumbers();
  const userId = authContext?.userData?.userId;
  const sessionExpired = authContext?.sessionExpired;
  const getallpopuler = async ({
    pageNumber,
    pageSize,
  }: {
    pageNumber: number;
    pageSize: number;
  }) => {
    setLoadingStates((prev) => ({ ...prev, popular: true }));
    try {
      const response = await axios.get(
        ProductsPoint.GetPopular(pageNumber, pageSize),
        {
          headers: {
            Authorization: `Bearer ${
              localStorage.getItem("token") || sessionStorage.getItem("token")
            }`,
          },
        }
      );

      if (response.data && response.data.data) {
        setpopular(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (errors) {
      console.log("Error fetching popular products:", errors);
    } finally {
      setLoadingStates((prev) => ({ ...prev, popular: false }));
    }
  };

  // Get user favorites
  const getFavorites = async () => {
    if (!userId) {
      return;
    }
    try {
      const response = await axios.get(
        ProductsPoint.GetFavorites(userId, 1, 100), // Get first 100 favorites
        {
          headers: {
            Authorization: `Bearer ${
              localStorage.getItem("token") || sessionStorage.getItem("token")
            }`,
          },
        }
      );

      if (response.data && response.data.data) {
        const favoriteIds = response.data.data.map(
          (item: any) => item.productId || item.Id
        );
        setFavorites(favoriteIds);
        console.log("User Favorites:", favoriteIds);
      }
    } catch (error) {
      console.log("Error fetching favorites:", error);
    }
  };

  // Add to favorites
  const addToFavorites = async (productId: number) => {
    if (!userId) {
      toast.error("يجب تسجيل الدخول لإضافة المنتج إلى المفضلة");
      return;
    }
    setLoadingStates((prev) => ({ ...prev, [productId]: true }));
    try {
      const response = await axios.post(
        ProductsPoint.AddFavorites(userId, productId),
        {},
        {
          headers: {
            Authorization: `Bearer ${
              localStorage.getItem("token") || sessionStorage.getItem("token")
            }`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        setFavorites((prev) => [...prev, productId]);
        toast.success("تم إضافة المنتج إلى المفضلة");
        console.log("Added to favorites:", productId);
      }
    } catch (error) {
      console.log("Error adding to favorites:", error);
      toast.error("حدث خطأ في إضافة المنتج إلى المفضلة");
    } finally {
      setLoadingStates((prev) => ({ ...prev, [productId]: false }));
    }
  };

  // Remove from favorites
  const removeFromFavorites = async (productId: number) => {
    if (!userId) {
      toast.error("لا يوجد مستخدم مسجل الدخول");
      return;
    }
    setLoadingStates((prev) => ({ ...prev, [productId]: true }));
    try {
      const response = await axios.delete(
        `${ProductsPoint.DeleteFavorites}?userId=${userId}&productId=${productId}`,
        {
          headers: {
            Authorization: `Bearer ${
              localStorage.getItem("token") || sessionStorage.getItem("token")
            }`,
          },
        }
      );

      if (response.status === 200) {
        setFavorites((prev) => prev.filter((id) => id !== productId));
        toast.success("تم إزالة المنتج من المفضلة");
        console.log("Removed from favorites:", productId);
      }
    } catch (error) {
      console.log("Error removing from favorites:", error);
      toast.error("حدث خطأ في إزالة المنتج من المفضلة");
    } finally {
      setLoadingStates((prev) => ({ ...prev, [productId]: false }));
    }
  };

  // Toggle favorites
  const toggleFavorite = async (productId: number) => {
    if (loadingStates[productId]) return; // Prevent multiple clicks

    if (favorites.includes(productId)) {
      await removeFromFavorites(productId);
    } else {
      await addToFavorites(productId);
    }
  };

  // Check if product is in favorites
  const isInFavorites = (productId: number) => {
    return favorites.includes(productId);
  };

  // Counter handlers (min value is 1)
  const incrementHandler = (productId: number) => {
    setCounter((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 1) + 1,
    }));
  };

  const decrementHandler = (productId: number) => {
    setCounter((prev) => ({
      ...prev,
      [productId]:
        prev[productId] && prev[productId] > 1 ? prev[productId] - 1 : 1,
    }));
  };

  // Add to cart function
  const addToCart = async (productId: number) => {
    if (addingToCart[productId]) return;
    setAddingToCart((prev) => ({ ...prev, [productId]: true }));

    try {
      const quantity = counter[productId] || 1;

      // Check if product is already in cart
      const existingCartItem = cartItems.find(
        (item) => item.ProductId === productId
      );

      if (existingCartItem) {
        // Product exists in cart, use PUT to update quantity
        const response = await axios.put(
          cartShopPoint.Put(existingCartItem.Id),
          {
            ProductId: productId,
            Quantity: quantity,
          },
          {
            headers: {
              Authorization: `Bearer ${
                localStorage.getItem("token") || sessionStorage.getItem("token")
              }`,
            },
          }
        );
        if (response.status === 200 || response.status === 201) {
          toast.success("تم تحديث الكمية في السلة بنجاح");
          // Refresh cart items to get updated data
          getCartItems();
        }
      } else {
        // Product doesn't exist in cart, use POST to add new item
        const body = {
          CartItems: [
            {
              ProductId: productId,
              Quantity: quantity,
            },
          ],
        };
        const sessionId = sessionStorage.getItem("session-Id");
        if (!sessionId) {
          const newSessionId = `session-${Date.now()}`;
          sessionStorage.setItem("session-Id", newSessionId);
        }
        const headers: any = {
          "session-Id": sessionId, // استخدام نفس التسمية المستخدمة في Shoppingcart
          Authorization: `Bearer ${
            localStorage.getItem("token") || sessionStorage.getItem("token")
          }`,
        };
        const response = await axios.post(cartShopPoint.Post, body, {
          headers,
        });
        if (response.status === 200 || response.status === 201) {
          toast.success("تم إضافة المنتج إلى السلة بنجاح");
          
          // بدلاً من window.location.reload() - تحديث السلة من الـ context
          if (fetchCart) {
            await fetchCart();
          }
          
          getCartItems();
        }
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء إضافة المنتج للسلة");
    } finally {
      setAddingToCart((prev) => ({ ...prev, [productId]: false }));
    }
  };

  // Fetch cart items on mount
  const getCartItems = async () => {
    try {
      const sessionId = sessionStorage.getItem("session-Id");
      const response = await axios.get(cartShopPoint.GetAllCartShop, {
        headers: {
          "session-Id": sessionId, // إضافة session-Id للهيدر
          Authorization: `Bearer ${
            localStorage.getItem("token") || sessionStorage.getItem("token")
          }`,
        },
      });

      if (response.data && response.data.CartItems) {
        setCartItems(response.data.CartItems);
        // Extract ProductId from each cart item
        const productIds = response.data.CartItems.map(
          (item: any) => item.ProductId
        );
        setCartProductIds(productIds);
      }
    } catch (error) {
      console.log("Error fetching cart items:", error);
    }
  };

  // عرض التقييم بالنجوم
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <FontAwesomeIcon
            key={i}
            icon={faStar}
            className={Styles.starFilled}
          />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <FontAwesomeIcon key={i} icon={faStar} className={Styles.starHalf} />
        );
      } else {
        stars.push(
          <FontAwesomeIcon key={i} icon={faStar} className={Styles.starEmpty} />
        );
      }
    }
    return stars;
  };

  useEffect(() => {
    getallpopuler({ pageNumber: currentPage, pageSize: itemsPerPage });
    getFavorites();
    getCartItems(); // Fetch cart items on mount
  }, [currentPage]);

  const handleNextPage = () => {
    if (pagination && currentPage < pagination.TotalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (loadingStates.popular) {
    return (
      <div className={Styles.loadingContainer}>
        <FontAwesomeIcon
          icon={faSpinner}
          spin
          size="3x"
          style={{ color: "#009247" }}
        />
        <p>جاري تحميل المنتجات الشائعة...</p>
      </div>
    );
  }

  return (
    <div className={Styles.popularContainer}>
      <motion.div
        className={Styles.popularCaption}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-center">
          <FontAwesomeIcon
            icon={faStar}
            style={{ color: "#ffc107", marginLeft: "10px" }}
          />
          منتجات الشهر
        </h1>
        <p className="text-center">اكتر المنتجات طلبا لي هذا الشهر</p>
      </motion.div>

      <AnimatePresence>
        <motion.div
          className={Styles.popularCards}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {getpopular.map((popcard, index) => (
            <motion.div
              key={popcard.Id}
              className={`${Styles.popularCard} shadow`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{
                y: -5,
                boxShadow: "0 8px 25px rgba(0, 146, 71, 0.15)",
              }}
            >
              {/* صورة المنتج */}
              <div className={Styles.popularCardImage}>
                <img
                  src={`${ImgURLBeasd}${popcard.ImageUrl}`}
                  alt={popcard.Name}
                  onError={(e) => {
                    e.currentTarget.src = image;
                  }}
                />
                {addingToCart[popcard.Id] && (
                  <div className={Styles.imageOverlay}>
                    <FontAwesomeIcon icon={faSpinner} spin />
                  </div>
                )}
              </div>

              {/* الشارات */}
              <div className={Styles.badges}>
                {popcard.DiscountPercentage > 0 && (
                  <span className={Styles.discountBadge}>
                    -{formatArabicPercentage(popcard.DiscountPercentage)}
                  </span>
                )}
              </div>

              {/* الإجراءات السريعة */}
              <div className={Styles.quickActions}>
                <button
                  className={`${Styles.actionBtn} ${Styles.favoriteBtn} ${
                    isInFavorites(popcard.Id) ? Styles.active : ""
                  }`}
                  onClick={() => toggleFavorite(popcard.Id)}
                  disabled={loadingStates[popcard.Id]}
                  title={
                    isInFavorites(popcard.Id)
                      ? "إزالة من المفضلة"
                      : "إضافة للمفضلة"
                  }
                >
                  <FontAwesomeIcon
                    icon={
                      loadingStates[popcard.Id]
                        ? faSpinner
                        : isInFavorites(popcard.Id)
                        ? faHeartBroken
                        : faHeart
                    }
                    spin={loadingStates[popcard.Id]}
                  />
                </button>

                <Link
                  to={`/store/product/${popcard.Id}`}
                  state={{ data: popcard }}
                  className={`${Styles.actionBtn} ${Styles.viewBtn}`}
                  title="عرض التفاصيل"
                >
                  <FontAwesomeIcon icon={faEye} />
                </Link>
              </div>

              {/* محتوى الكارد */}
              <div className={Styles.popularCardContent}>
                {/* العنوان والتقييم */}
                <div className={Styles.productHeader}>
                  <h4 className={Styles.productTitle}>{popcard.Name}</h4>
                  <div className={Styles.rating}>
                    <div className={Styles.stars}>
                      {renderStars(popcard.Rate)}
                    </div>
                    <span className={Styles.ratingText}>
                      {formatArabicNumber(parseFloat(popcard.Rate.toFixed(1)))} من 5
                    </span>
                  </div>
                </div>

                {/* الوصف */}
                <p className={Styles.productDescription}>
                  {popcard.Description}
                </p>

                {/* السعر */}
                <div className={Styles.priceSection}>
                  <div className={Styles.priceInfo}>
                    <span className={Styles.currentPrice}>
                      {formatArabicPrice(popcard.DiscountedPrice)}
                    </span>
                    {popcard.DiscountedPrice !== popcard.Price && (
                      <span className={Styles.originalPrice}>
                        {formatArabicPrice(popcard.Price)}
                      </span>
                    )}
                  </div>
                  {popcard.DiscountedPrice !== popcard.Price && (
                    <span className={Styles.savings}>
                      وفر {formatArabicPrice(popcard.Price - popcard.DiscountedPrice)}
                    </span>
                  )}
                </div>

                {/* التحكم في الكمية وإضافة للسلة */}
                <div className={Styles.cartSection}>
                  {cartProductIds.includes(popcard.Id) ? (
                    <div className={Styles.inCartText}>
                      <FontAwesomeIcon icon={faCheckCircle} />
                      موجود في السلة
                    </div>
                  ) : (
                    <div className={Styles.addToCartControls}>
                      {/* التحكم في الكمية */}
                      <div className={Styles.quantityControl}>
                        <button
                          className={`${Styles.quantityBtn} ${Styles.decrease}`}
                          onClick={() => decrementHandler(popcard.Id)}
                          disabled={addingToCart[popcard.Id]}
                        >
                          <FontAwesomeIcon icon={faMinus} />
                        </button>
                        <span className={Styles.quantityValue}>
                          {formatArabicNumber(counter[popcard.Id] || 1)}
                        </span>
                        <button
                          className={`${Styles.quantityBtn} ${Styles.increase}`}
                          onClick={() => incrementHandler(popcard.Id)}
                          disabled={addingToCart[popcard.Id]}
                        >
                          <FontAwesomeIcon icon={faPlus} />
                        </button>
                      </div>

                      {/* زر إضافة للسلة */}
                      <button
                        className={`${Styles.addToCartBtn} ${
                          addingToCart[popcard.Id] ? Styles.loading : ""
                        }`}
                        onClick={() => addToCart(popcard.Id)}
                        disabled={addingToCart[popcard.Id]}
                      >
                        {addingToCart[popcard.Id] ? (
                          <>
                            <FontAwesomeIcon icon={faSpinner} spin />
                            جاري الإضافة...
                          </>
                        ) : (
                          <>
                            <FontAwesomeIcon icon={faPlus} />
                            أضف للسلة
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Pagination */}
      {pagination && pagination.TotalPages >= 1 && (
        <motion.div
          className={Styles.popularPagination}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <button
            className={`${Styles.paginationBtn} ${
              currentPage > 1 ? Styles.active : Styles.disabled
            }`}
            onClick={handlePrevPage}
            disabled={currentPage <= 1}
          >
            <FontAwesomeIcon icon={faArrowAltCircleRight} />
          </button>

          <span className={Styles.pageInfo}>
            {formatArabicNumber(pagination.TotalPages)} / <span>{formatArabicNumber(currentPage)}</span>
          </span>

          <button
            className={`${Styles.paginationBtn} ${
              currentPage < pagination.TotalPages
                ? Styles.active
                : Styles.disabled
            }`}
            onClick={handleNextPage}
            disabled={currentPage >= pagination.TotalPages}
          >
            <FontAwesomeIcon icon={faArrowAltCircleLeft} />
          </button>
        </motion.div>
      )}
    </div>
  );
}
