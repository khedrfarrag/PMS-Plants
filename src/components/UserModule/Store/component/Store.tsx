import { useCallback, useContext, useEffect, useState, useMemo } from "react";
import Style from "./style/style.module.css";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faExclamationTriangle,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import {
  faArrowAltCircleRight,
  faEye,
  faHeart,
  faMinus,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  cartShopPoint,
  CategoryPoint,
  ImgURLBeasd,
  ProductsPoint,
} from "../../../../constant/Const";
import {
  Getallproducts,
  Addcartapi,
  fetchCategories,
  filterProducts,
  searchProduct,
} from "../Controller/Controle.tsx";
import SidebarFillter from "./productdetails/SidebarFillter.js";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../../../../context/Context.tsx";
import { CartshopContext } from "../../../../context/CartshopContext";
import axios from "axios";
import imgiuser from "../../../../assets/svg/userimg.svg";
import { ShimmerSimpleGallery, ShimmerPostItem } from "react-shimmer-effects";
import Stack from "@mui/material/Stack";
import Pagination from "@mui/material/Pagination";
import { Helmet } from "react-helmet-async";

// Define types for card data
interface data {
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
  ProductFeedbacks: any[]; // Optional user reviews property
}
type card = data[];

// Pagination type
interface pagenation {
  CurrentPage: number;
  PageSize: number;
  TotalCount: number;
  TotalPages: number;
}

function Store() {
  const { userData }: null | any = useContext(AuthContext);
  const { fetchCart } = useContext(CartshopContext) || {};
  const UserId = userData?.userId;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // تحسين: استخدام useMemo لحساب السعر المخصوم
  const calculateDiscountedPrice = useMemo(() => {
    return (price: number, discount: number) => {
      return discount > 0
        ? (price - (price * discount) / 100).toFixed(2)
        : price.toFixed(2);
    };
  }, []);

  // Helper function to get stock status
  const getStockStatus = (quantity: number) => {
    if (quantity === 0) {
      return { status: "outOfStock", text: "نفذ المخزون" };
    } else if (quantity <= 10) {
      return { status: "lowStock", text: "مخزون منخفض" };
    } else if (quantity === 1) {
      return { status: "lastPiece", text: "اخر قطعة" };
    } else {
      return { status: "inStock", text: "متوفر" };
    }
  };

  const [Cards, setCards] = useState<card>([]);
  const [pagination, setPagination] = useState<pagenation>({
    CurrentPage: 1,
    PageSize: 8,
    TotalCount: 0,
    TotalPages: 1,
  });
  const [loading, setLoading] = useState(false);
  const [counts, setCounts] = useState<{ [id: number]: number }>({});
  const [showSidebar, setShowSidebar] = useState(false);
  // لإضافة أنيميشن سلس للفتح والإغلاق
  const [sidebarAnimated, setSidebarAnimated] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [categories, setCategories] = useState<any[]>([]); // عدلت النوع ليكون any[] لدعم الفروع
  // State للفلاتر
  const [filters, setFilters] = useState({
    CategoryId: undefined as number | undefined,
    SubCategoryId: undefined as number | undefined,
    HasDiscount: undefined as boolean | undefined,
    MinPrice: undefined as number | undefined,
    MaxPrice: undefined as number | undefined,
    FeedbackScore: undefined as number | undefined,
  });
  const [favorites, setFavorites] = useState<number[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<
    number | undefined
  >(undefined);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<
    number | null
  >(null);
  const [hasDiscount, setHasDiscount] = useState<boolean | undefined>(
    undefined
  );
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [feedbackScore, setFeedbackScore] = useState<number | undefined>(
    undefined
  );
  const [feedbackScoreTo, setFeedbackScoreTo] = useState<number | undefined>(
    undefined
  );

  // جلب المنتجات المفضلة عند تحميل الصفحة أو تغيير المستخدم
  const GetFavoritesIds = useCallback(async () => {
    if (!UserId) return;
    try {
      const response = await axios.get(
        ProductsPoint.GetFavorites(UserId, 1, 100),
        {
          headers: {
            Authorization: `Bearer ${
              localStorage.getItem("token") || sessionStorage.getItem("token")
            }`,
          },
        }
      );
      setFavorites(response.data.data.map((fav: any) => fav.Id));
    } catch (error) {
      setFavorites([]);
    }
  }, [UserId]);

  useEffect(() => {
    GetFavoritesIds();
    // جلب الفئات عند تحميل الصفحة
    fetchCategories(CategoryPoint, setCategories, toast);
  }, []);

  // استخدم useCallback لدوال جلب المنتجات
  const getAllProductsCallback = useCallback(() => {
    Getallproducts(
      ProductsPoint,
      pagination.CurrentPage,
      pagination.PageSize,
      setCards,
      setPagination,
      setLoading
    );
  }, [ProductsPoint, pagination.CurrentPage, pagination.PageSize]);

  const filterProductsCallback = useCallback(() => {
    filterProducts(
      ProductsPoint,
      {
        ...filters,
        pageNumber: pagination.CurrentPage,
        pageSize: pagination.PageSize,
      },
      (data) => setCards(Array.isArray(data) ? data : []),
      setPagination,
      setLoading,
      toast
    );
  }, [
    ProductsPoint,
    filters,
    pagination.CurrentPage,
    pagination.PageSize,
    toast,
  ]);

  // useEffect منفصل لقراءة categoryId من URL وتطبيق الفلترة
  useEffect(() => {
    const categoryIdFromURL = searchParams.get("categoryId");
    const subCategoryIdFromURL = searchParams.get("subCategoryId");

    // تطبيق الفلترة
    if (categoryIdFromURL) {
      setFilters((prev) => ({
        ...prev,
        CategoryId: parseInt(categoryIdFromURL, 10),
        SubCategoryId: subCategoryIdFromURL
          ? parseInt(subCategoryIdFromURL, 10)
          : undefined,
      }));
      setSelectedCategoryId(parseInt(categoryIdFromURL, 10));
      setSelectedSubCategoryId(
        subCategoryIdFromURL ? parseInt(subCategoryIdFromURL, 10) : null
      );
    }
  }, [searchParams, categories]);

  // useEffect لجلب المنتجات
  useEffect(() => {
    const allFiltersEmpty = Object.values(filters).every(
      (v) => v === undefined || v === null
    );
    if (allFiltersEmpty) {
      getAllProductsCallback();
    } else {
      filterProductsCallback();
    }
  }, [
    filters,
    pagination.CurrentPage,
    pagination.PageSize,
    getAllProductsCallback,
    filterProductsCallback,
  ]);

  // تحسين: استخدام useCallback لتحسين الأداء
  const addcarthandel = useCallback(
    (id: number): void => {
      const count = counts[id] || 1;
      Addcartapi(
        cartShopPoint,
        { ProductId: id, Quantity: count },
        setCounts,
        toast,
        fetchCart
      );
    },
    [counts, cartShopPoint, fetchCart]
  );

  // تحسين: استخدام useCallback لـ toggle favorite
  const toggleFavorite = useCallback(
    async (id: number): Promise<void> => {
      if (!UserId) {
        toast.error("يجب تسجيل الدخول لإضافة للمفضلة");
        return;
      }

      const isFavorite = favorites.includes(id);
      const endpoint = isFavorite
        ? `${ProductsPoint.DeleteFavorites}?userId=${UserId}&productId=${id}`
        : `${ProductsPoint.AddFavorites(UserId, id)}`;

      try {
        if (isFavorite) {
          await axios.delete(endpoint, {
            headers: {
              Authorization: `Bearer ${
                localStorage.getItem("token") || sessionStorage.getItem("token")
              }`,
            },
          });
          setFavorites((prev) => prev.filter((fid) => fid !== id));
          toast.success("تمت إزالة المنتج من المفضلة");
        } else {
          await axios.post(
            endpoint,
            {},
            {
              headers: {
                Authorization: `Bearer ${
                  localStorage.getItem("token") ||
                  sessionStorage.getItem("token")
                }`,
              },
            }
          );
          setFavorites((prev) => [...prev, id]);
          toast.success("تمت إضافة المنتج إلى المفضلة");
        }
      } catch (error) {
        toast.error(
          `حدث خطأ أثناء ${isFavorite ? "إزالة" : "إضافة"} المنتج من المفضلة`
        );
      }
    },
    [UserId, favorites, ProductsPoint]
  );

  // تحسين: استخدام useCallback للـ increment/decrement
  const incrementHandler = useCallback((Id: number): void => {
    setCounts((prev) => ({
      ...prev,
      [Id]: (prev[Id] || 1) + 1,
    }));
  }, []);

  const decrementHandler = useCallback((Id: number): void => {
    setCounts((prev) => ({
      ...prev,
      [Id]: (prev[Id] || 1) > 1 ? (prev[Id] || 1) - 1 : 1,
    }));
  }, []);

  // Responsive: show sidebar on desktop, modal on mobile
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 991);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // إغلاق الفلاتر عند الضغط خارجها (overlay)
  useEffect(() => {
    if (!showSidebar) return;
    const handleClick = (e: MouseEvent) => {
      const sidebar = document.getElementById("sidebar-filter");
      if (sidebar && !sidebar.contains(e.target as Node)) {
        setShowSidebar(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showSidebar]);

  // أنيميشن فتح/إغلاق
  useEffect(() => {
    if (showSidebar) {
      setSidebarAnimated(true);
    } else {
      // بعد انتهاء الأنيميشن (مثلاً 300ms) نخفي العنصر
      const timeout = setTimeout(() => setSidebarAnimated(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [showSidebar]);

  return (
    <>
      <Helmet>
        <title>المتجر - الشركة الخليجية للمبيدات والكيماويات</title>
        <meta
          name="description"
          content="تسوق من مجموعة واسعة من المنتجات الزراعية والمبيدات والكيماويات."
        />
      </Helmet>
      <div className={Style.contanerseller} style={{ position: "relative" }}>
        {/* Header section - نفس ديزاين cartshop */}
        {loading ? (
          <div style={{ marginBottom: 32 }}>
            <ShimmerPostItem title cta />
          </div>
        ) : (
          <div
            style={{
              width: "100%",
              background: "#fff",
              borderRadius: "18px",
              boxShadow: "0 2px 12px rgba(1,143,44,0.06)",
              padding: "24px 32px 18px 32px",
              margin: "0 auto 32px auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexDirection: "row-reverse",
              position: "relative",
              minHeight: 70,
            }}
          >
            <h2
              style={{
                fontWeight: 900,
                fontSize: 32,
                color: "#222",
                margin: 0,
                letterSpacing: 1,
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <span style={{ color: "#018f2c", fontSize: 34 }}>🛒</span>
              المتجر
            </h2>
            <button
              onClick={() => navigate("/")}
              style={{
                background: "#fff",
                color: "#018f2c",
                border: "1.5px solid #018f2c",
                borderRadius: 12,
                padding: "8px 28px",
                fontWeight: 700,
                fontSize: 18,
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(1,143,44,0.06)",
                display: "flex",
                alignItems: "center",
                gap: 8,
                transition: "background 0.2s, color 0.2s",
              }}
            >
              <FontAwesomeIcon
                icon={faArrowAltCircleRight}
                style={{ fontSize: 22, marginLeft: 6 }}
              />
              رجوع
            </button>
          </div>
        )}
        {/* أيقونة الفلتر ثابتة أعلى اليمين */}
        {!showSidebar && !loading && (
          <button
            className={`${Style.filterSidebarBtn} ${Style.fixedFilterIcon}`}
            onClick={() => setShowSidebar(true)}
            aria-label="عرض الفلاتر"
          >
            <FontAwesomeIcon icon={faBars} size="lg" />
          </button>
        )}
        {/* الفلتر الجانبي مع overlay وأنيميشن */}
        {(showSidebar || sidebarAnimated) && (
          <>
            {/* Overlay */}
            <div
              className={Style.filterSidebarOverlay}
              style={{
                opacity: showSidebar ? 1 : 0,
                pointerEvents: showSidebar ? "auto" : "none",
              }}
            />
            {/* Sidebar */}
            <div
              id="sidebar-filter"
              className={`${Style.herofillteration} ${
                isMobile ? Style.mobileSidebar : Style.desktopSidebar
              } ${showSidebar ? Style.show : Style.hide}`}
            >
              {loading ? (
                <div style={{ padding: 24 }}>
                  <ShimmerSimpleGallery row={6} col={1} />
                </div>
              ) : (
                <SidebarFillter
                  show={showSidebar}
                  onClose={() => setShowSidebar(false)}
                  isMobile={isMobile}
                  categories={categories}
                  onFilterChange={setFilters}
                  onSearchName={(name) =>
                    searchProduct(
                      ProductsPoint,
                      name,
                      setCards,
                      setPagination,
                      setLoading,
                      toast
                    )
                  }
                  selectedCategoryId={selectedCategoryId}
                  setSelectedCategoryId={setSelectedCategoryId}
                  selectedSubCategoryId={selectedSubCategoryId}
                  setSelectedSubCategoryId={setSelectedSubCategoryId}
                  hasDiscount={hasDiscount}
                  setHasDiscount={setHasDiscount}
                  minPrice={minPrice}
                  setMinPrice={setMinPrice}
                  maxPrice={maxPrice}
                  setMaxPrice={setMaxPrice}
                  feedbackScore={feedbackScore}
                  setFeedbackScore={setFeedbackScore}
                  feedbackScoreTo={feedbackScoreTo}
                  setFeedbackScoreTo={setFeedbackScoreTo}
                />
              )}
            </div>
          </>
        )}
        {/* المنتجات مع الـ pagination في صف كامل */}
        <div className="row w-100 m-0 p-0">
          <div className="col-12 p-0">
            <div className={Style.herocardsseller} style={{ flex: 1 }}>
              {loading ? (
                <ShimmerSimpleGallery row={2} col={4} gap={24} />
              ) : Cards.length === 0 ? (
                // Empty State
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "400px",
                    width: "100%",
                    flexDirection: "column",
                    gap: "20px",
                  }}
                >
                  <div
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "50%",
                      backgroundColor: "#f8f9fa",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "40px",
                      color: "#ccc",
                    }}
                  >
                    📦
                  </div>
                  <p
                    style={{
                      color: "#666",
                      fontSize: "18px",
                      fontWeight: "500",
                      margin: 0,
                      textAlign: "center",
                    }}
                  >
                    لا توجد منتجات متاحة حالياً
                  </p>
                </div>
              ) : (
                // Products Grid
                (Array.isArray(Cards) ? Cards : []).map((card) => (
                  <div key={card.Id} className={`${Style.cardsseller} shadow`}>
                    {/* ...existing code... */}
                    {/* كل تفاصيل الكارت كما هي */}
                    <div className={Style.hedcard}>
                      <span
                        className={Style.favoritProducts}
                        onClick={() => toggleFavorite(card?.Id)}
                      >
                        <FontAwesomeIcon
                          icon={faHeart}
                          style={{
                            color: favorites.includes(card?.Id)
                              ? "red"
                              : "white",
                            border: "1px solid white",
                            borderRadius: "50px",
                            padding: "8px",
                            backgroundColor: "gainsboro",
                            cursor: "pointer",
                            transition: "color 0.2s",
                          }}
                          className={Style.harticon}
                        />
                      </span>

                      {getStockStatus(card.StockQuantity).status ===
                        "lastPiece" && (
                        <span className={Style.lastPieceBadge && Style.stock}>
                          <FontAwesomeIcon
                            icon={faExclamationTriangle}
                            style={{ color: "#FFD700" }}
                          />
                          اخر قطعة
                        </span>
                      )}
                      {getStockStatus(card.StockQuantity).status ===
                        "lowStock" && (
                        <span className={Style.lowStockBadge || Style.stock}>
                          <FontAwesomeIcon
                            icon={faExclamationTriangle}
                            style={{ color: "#FFD700" }}
                          />
                          {card.StockQuantity} قطع
                        </span>
                      )}
                      {getStockStatus(card.StockQuantity).status ===
                        "outOfStock" && (
                        <span className={Style.outOfStockBadge || Style.stock}>
                          <FontAwesomeIcon
                            icon={faExclamationTriangle}
                            style={{ color: "red" }}
                          />
                          نفذ المخزون
                        </span>
                      )}
                      {getStockStatus(card.StockQuantity).status ===
                        "inStock" && (
                        <span className={Style.inStockBadge || Style.stock}>
                          <FontAwesomeIcon
                            icon={faCheckCircle}
                            style={{
                              color: "green",
                            }}
                          />
                          متوفر
                        </span>
                      )}
                      {card?.DiscountPercentage > 0 && (
                        <span className={Style.sealeproducts}>
                          {card?.DiscountPercentage}%
                        </span>
                      )}
                    </div>
                    <div className={Style.cardbody}>
                      {card.ImageUrl !== null ? (
                        <img
                          src={`${ImgURLBeasd}/${card?.ImageUrl}`}
                          alt="img-product"
                        />
                      ) : (
                        <img
                          src={imgiuser}
                          alt="صورة غير معروفه"
                          style={{
                            width: "40%",
                            height: "40%",
                            objectFit: "contain",
                            borderRadius: "10px",
                          }}
                        ></img>
                      )}
                      <div className={Style.cardtext}>
                        <Link
                          to="#"
                          className={`${Style.viewProducts} text-center`}
                          onClick={() => navigate(`product/${card.Id}`)}
                          state={{ data: card }}
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </Link>
                      </div>
                      <div
                        className={`${Style.captitlecard} d-flex justify-content-between p-2 align-items-center`}
                      >
                        <h4 className="fw-bolder  ">{card.Name}</h4>
                        <span>
                          <FontAwesomeIcon
                            icon={faStar}
                            style={{ color: "#FFD700" }}
                          />
                          <span style={{ fontSize: "20px", fontWeight: "800" }}>
                            {(() => {
                              const feedbacks = card.ProductFeedbacks || [];
                              const count = feedbacks.length;
                              if (count === 0) return "لا يوجد تقييمات";
                              const total = feedbacks.reduce(
                                (acc: number, f: { Rate?: number }) => {
                                  let rate = f.Rate || 0;
                                  if (rate < 0) rate = 0;
                                  if (rate > 5) rate = 5;
                                  return acc + rate;
                                },
                                0
                              );
                              const avg = total / count;
                              const roundedAvg = Math.min(
                                Math.round(avg * 10) / 10,
                                5
                              );
                              return `${roundedAvg} `;
                            })()}
                          </span>
                        </span>
                      </div>
                      <p>
                        وصف المنتج:{" "}
                        {card.Description
                          ? card.Description.length > 50
                            ? card.Description.slice(0, 50) + "..."
                            : card.Description
                          : "لا يوجد وصف للمنتج"}
                      </p>
                      <div
                        className={`${Style.pricecardshoping} d-flex  justify-content-between`}
                      >
                        <div className={Style.cardshoping}>
                          <span
                            className={`${Style.addcart} d-flex justify-content-center align-items-center rounded shadow-lg text-center ms-1`}
                            style={{
                              backgroundColor: "#018f2c",
                              fontSize: "20px",
                              color: "white",
                            }}
                            onClick={() => addcarthandel(card.Id)}
                          >
                            <FontAwesomeIcon icon={faPlus} />
                          </span>
                          <span
                            className="d-flex justify-content-around align-items-center gap-2"
                            style={{ fontSize: "25px" }}
                          >
                            <FontAwesomeIcon
                              icon={faPlus}
                              style={{
                                cursor: "pointer",
                                backgroundColor: "white",
                                borderRadius: "5px",
                                padding: "2px",
                              }}
                              onClick={() => incrementHandler(card.Id)}
                            />
                            {counts[card.Id] || 1}
                            <FontAwesomeIcon
                              icon={faMinus}
                              style={{
                                cursor:
                                  (counts[card.Id] || 1) > 1
                                    ? "pointer"
                                    : "not-allowed",
                                backgroundColor:
                                  (counts[card.Id] || 1) > 1 ? "white" : "red",
                                color:
                                  (counts[card.Id] || 1) > 1
                                    ? undefined
                                    : "white",
                                borderRadius: "5px",
                                padding: "2px",
                                marginLeft: "10px",
                              }}
                              onClick={() => decrementHandler(card.Id)}
                            />
                          </span>
                        </div>
                        <span className={Style.price}>
                          <span
                            style={{ fontSize: "21px", fontWeight: "bold" }}
                          >
                            <span style={{ color: "#009247" }}>$</span>
                            {calculateDiscountedPrice(
                              card.Price,
                              card.DiscountPercentage ?? 0
                            )}
                          </span>
                          {(card.DiscountPercentage ?? 0) > 0 && (
                            <span
                              style={{
                                fontSize: "16px",
                                color: "gray",
                                textDecoration: "line-through",
                              }}
                            >
                              ${card.Price.toFixed(2)}
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          {/* <div className="col-12 d-flex justify-content-center align-items-center"> */}
          <div className={Style.heroPagenation} style={{ marginTop: 30 }}>
            <Stack spacing={2}>
              <Pagination
                count={pagination.TotalPages}
                variant="outlined"
                shape="rounded"
                onChange={(e, value) =>
                  setPagination((prev) => ({ ...prev, CurrentPage: value }))
                }
              />
            </Stack>
          </div>
          {/* </div> */}
        </div>
      </div>
    </>
  );
}

export default Store;
