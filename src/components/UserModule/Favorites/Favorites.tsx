import React, { useCallback, useContext, useEffect, useState } from "react";
import Style from "./style/Style.module.css";
import { AuthContext } from "../../../context/Context";
import axios from "axios";
import {
  ImgURLBeasd,
  ProductsPoint,
  cartShopPoint,
} from "../../../constant/Const";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faStar,
  faTrash,
  faMinus,
  faPlus,
  faSpinner,
  faCheckCircle,
  faExclamationTriangle,
  faClock,
  faShoppingBag,
  faArrowLeft,
  faHeartBroken,
} from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import image from "../../../assets/svg/userimg.svg";

export default function Favorites() {
  type FavoriteProduct = {
    Id: number;
    Name: string;
    Description: string;
    StockStatues: string;
    StockQuantity: number;
    Price: number;
    Rate: number;
    SubCategoryId: number;
    CategoryId: number;
    DiscountPercentage: number;
    DiscountedPrice: number;
    ImageUrl: string;
    Title1: string;
    Body1: string;
    Title2: string;
    Body2: string;
    ProductFeedbacks: [];
  };

  type FavoritesResponse = {
    data: FavoriteProduct[];
    pagination: {
      CurrentPage: number;
      PageSize: number;
      TotalCount: number;
      TotalPages: number;
    };
  };

  type CartItem = {
    Id: number;
    ProductId: number;
    ProductName: string;
    Price: number;
    Quantity: number;
    TotalPrice: number;
  };

  type CartResponse = {
    CartItems: CartItem[];
    Id: number;
    UserId: string;
    TotalQuantity: number;
    TotalPrice: number;
  };

  const [favoritesData, setFavoritesData] = useState<FavoritesResponse>();
  const [favoritesIds, setFavoritesIds] = useState<number[]>([]);
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [addQty, setAddQty] = useState<{ [productId: number]: number }>({});
  const [loadingStates, setLoadingStates] = useState<{
    [key: number]: boolean;
    favorites?: boolean;
  }>({});
  const [addingToCart, setAddingToCart] = useState<{
    [productId: number]: boolean;
  }>({});
  const { userData }: null | any = useContext(AuthContext);
  const UserId = userData?.userId;
  const navigate = useNavigate();

  // Fetch favorites
  const GetAllFavoritesItems = useCallback(
    async (pageNumber: number = 1, pageSize: number = 10) => {
      setLoadingStates((prev) => ({ ...prev, favorites: true }));
      try {
        const response = await axios.get<FavoritesResponse>(
          ProductsPoint.GetFavorites(UserId, pageNumber, pageSize),
          {
            headers: {
              Authorization: `Bearer ${
                localStorage.getItem("token") || sessionStorage.getItem("token")
              }`,
            },
          }
        );
        setFavoritesData(response?.data);
        setFavoritesIds(response.data.data.map((fav: any) => fav.Id));
      } catch (error) {
        console.error("Error fetching favorites items:", error);
        toast.error("فشل في جلب المنتجات المفضلة");
      } finally {
        setLoadingStates((prev) => ({ ...prev, favorites: false }));
      }
    },
    [UserId]
  );

  // Fetch cart
  const GetCartItems = useCallback(async () => {
    try {
      const response = await axios.get<CartResponse>(
        cartShopPoint.GetAllCartShop,
        {
          headers: {
            Authorization: `Bearer ${
              localStorage.getItem("token") || sessionStorage.getItem("token")
            }`,
          },
        }
      );
      setCart(response.data);
    } catch (error) {
      setCart(null);
    }
  }, []);

  // Add to cart
  const handleAddToCart = async (product: FavoriteProduct) => {
    const qty = addQty[product.Id] || 1;
    setAddingToCart((prev) => ({ ...prev, [product.Id]: true }));

    try {
      await axios.post(
        cartShopPoint.Post,
        {
          CartItems: [
            {
              ProductId: product.Id,
              Quantity: qty,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${
              localStorage.getItem("token") || sessionStorage.getItem("token")
            }`,
          },
        }
      );
      toast.success("تمت إضافة المنتج إلى السلة");
      await GetCartItems();
    } catch (error) {
      toast.error("حدث خطأ أثناء إضافة المنتج للسلة");
    } finally {
      setAddingToCart((prev) => ({ ...prev, [product.Id]: false }));
    }
  };

  // Favorite toggle
  const handleFavorite = async (userId: string, productId: number) => {
    setLoadingStates((prev) => ({ ...prev, [productId]: true }));
    try {
      if (!userId) return;
      if (favoritesIds && favoritesIds.includes(productId)) {
        await axios.delete(
          `${ProductsPoint.DeleteFavorites}?userId=${userId}&productId=${productId}`,
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
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        toast.success("تمت إضافة المنتج إلى المفضلة");
      }
      await GetAllFavoritesItems();
    } catch (error) {
      toast.error("حدث خطأ أثناء تحديث المفضلة");
    } finally {
      setLoadingStates((prev) => ({ ...prev, [productId]: false }));
    }
  };

  // Remove from favorites
  const handleRemoveFromFavorites = async (
    userId: string,
    productId: number
  ) => {
    setLoadingStates((prev) => ({ ...prev, [productId]: true }));
    try {
      if (!userId) return;
      await axios.delete(
        `${ProductsPoint.DeleteFavorites}?userId=${userId}&productId=${productId}`,
        {
          headers: {
            Authorization: `Bearer ${
              localStorage.getItem("token") || sessionStorage.getItem("token")
            }`,
          },
        }
      );
      await GetAllFavoritesItems();
      toast.success("تمت إزالة المنتج من المفضلة بنجاح");
    } catch (errors) {
      toast.error("حدث خطأ أثناء إزالة المنتج من المفضلة");
    } finally {
      setLoadingStates((prev) => ({ ...prev, [productId]: false }));
    }
  };

  // Quantity controls
  const handleQtyChange = (productId: number, delta: number) => {
    setAddQty((prev) => {
      const newQty = Math.max(1, (prev[productId] || 1) + delta);
      return { ...prev, [productId]: newQty };
    });
  };

  useEffect(() => {
    if (UserId) {
      GetAllFavoritesItems();
      GetCartItems();
    }
    // eslint-disable-next-line
  }, [UserId]);

  // Helper: check if product is in cart
  const isInCart = (productId: number) => {
    return cart?.CartItems?.some((item) => item.ProductId === productId);
  };

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

  if (loadingStates.favorites) {
    return (
      <div className={Style.loadingContainer}>
        <FontAwesomeIcon
          icon={faSpinner}
          spin
          size="3x"
          style={{ color: "#009247" }}
        />
        <p>جاري تحميل المفضلة...</p>
      </div>
    );
  }

  return (
    <div className={Style.favoritesContainer}>
      {/* Header */}
      <motion.header
        className={Style.favoritesHeader}
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
              <FontAwesomeIcon icon={faHeart} />
              المنتجات المفضلة
            </h1>
            <p>{favoritesData?.pagination?.TotalCount || 0} منتج</p>
          </div>
        </div>
      </motion.header>

      {/* Favorites Items */}
      <AnimatePresence>
        {favoritesData?.data && favoritesData.data.length > 0 ? (
          <motion.section
            className={Style.favoritesItems}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {favoritesData.data.map((item, index) => (
              <motion.div
                className={Style.favoriteItem}
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
                <div className={Style.favoriteItemImage}>
                  <img
                    src={`${ImgURLBeasd}${item.ImageUrl}`}
                    alt={item.Name}
                    className={Style.productImage}
                    onError={(e) => {
                      e.currentTarget.src = image;
                    }}
                  />
                  {addingToCart[item.Id] && (
                    <div className={Style.imageOverlay}>
                      <FontAwesomeIcon icon={faSpinner} spin />
                    </div>
                  )}
                </div>

                {/* تفاصيل المنتج */}
                <div className={Style.favoriteItemDetails}>
                  <div className={Style.productInfo}>
                    <h2>{item.Name}</h2>
                    <p>{item.Description}</p>

                    {/* التقييم */}
                    <div className={Style.rating}>
                      <div className={Style.stars}>
                        {renderStars(item.Rate)}
                      </div>
                      <span className={Style.ratingText}>
                        {item.Rate.toFixed(1)} من 5
                      </span>
                    </div>
                  </div>

                  {/* التحكم في الكمية */}
                  {!isInCart(item.Id) && (
                    <div className={Style.quantityControl}>
                      <span className={Style.quantityLabel}>الكمية:</span>
                      <div className={Style.quantity}>
                        <button
                          className={`${Style.quantityBtn} ${Style.decrease}`}
                          onClick={() => handleQtyChange(item.Id, -1)}
                          disabled={addingToCart[item.Id]}
                        >
                          <FontAwesomeIcon icon={faMinus} />
                        </button>
                        <span className={Style.quantityValue}>
                          {addQty[item.Id] || 1}
                        </span>
                        <button
                          className={`${Style.quantityBtn} ${Style.increase}`}
                          onClick={() => handleQtyChange(item.Id, 1)}
                          disabled={addingToCart[item.Id]}
                        >
                          <FontAwesomeIcon icon={faPlus} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* الإجراءات والسعر */}
                <div className={Style.favoriteItemActions}>
                  {/* الإجراءات */}
                  <div className={Style.actions}>
                    <button
                      className={`${Style.actionBtn} ${Style.favoriteBtn} ${Style.active}`}
                      onClick={() => handleFavorite(UserId, item.Id)}
                      disabled={loadingStates[item.Id]}
                      title="إزالة من المفضلة"
                    >
                      <FontAwesomeIcon
                        icon={
                          loadingStates[item.Id] ? faSpinner : faHeartBroken
                        }
                        spin={loadingStates[item.Id]}
                      />
                    </button>

                    <button
                      className={`${Style.actionBtn} ${Style.deleteBtn}`}
                      onClick={() => handleRemoveFromFavorites(UserId, item.Id)}
                      disabled={loadingStates[item.Id]}
                      title="حذف من المفضلة"
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
                        ${item.DiscountedPrice || item.Price}
                      </span>
                      {item.DiscountedPrice &&
                        item.DiscountedPrice !== item.Price && (
                          <span className={Style.originalPrice}>
                            ${item.Price}
                          </span>
                        )}
                    </div>
                    {item.DiscountedPrice &&
                      item.DiscountedPrice !== item.Price && (
                        <span className={Style.savings}>
                          وفر ${(item.Price - item.DiscountedPrice).toFixed(2)}
                        </span>
                      )}
                  </div>

                  {/* زر إضافة للسلة */}
                  {!isInCart(item.Id) ? (
                    <button
                      className={`${Style.addToCartBtn} ${
                        addingToCart[item.Id] ? Style.loading : ""
                      }`}
                      onClick={() => handleAddToCart(item)}
                      disabled={addingToCart[item.Id]}
                    >
                      {addingToCart[item.Id] ? (
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
                  ) : (
                    <div className={Style.inCartText}>
                      <FontAwesomeIcon icon={faCheckCircle} />
                      موجود في السلة
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.section>
        ) : (
          <motion.div
            className={Style.emptyFavorites}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <FontAwesomeIcon icon={faHeartBroken} size="4x" />
            <h2>المفضلة فارغة</h2>
            <p>لم تقم بإضافة أي منتجات للمفضلة بعد</p>
            <button
              className={Style.continueShopping}
              onClick={() => navigate("/store")}
            >
              تصفح المنتجات
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
