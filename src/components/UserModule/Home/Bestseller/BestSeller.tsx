import {
  faArrowAltCircleLeft,
  faArrowAltCircleRight,
  faEye,
  faHeart,
  faMinus,
  faPlus,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import imgcard from "../svg/صورة_واتساب_بتاريخ_2025-02-07_في_15.11.25_715f02ee-removebg-preview.png";
import Style from "../Style.module.css";
import { useCallback, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  cartShopPoint,
  ImgURLBeasd,
  ProductsPoint,
} from "../../../../constant/Const";
import { AuthContext } from "../../../../context/Context";
import { CartshopContext } from "../../../../context/CartshopContext";
import { useStockContext } from "../../../../context/StockContext";
import { useArabicNumbers } from "../../../../context/ArabicNumbersContext";
import Stack from "@mui/material/Stack";
import Pagination from "@mui/material/Pagination";

export default function BestSeller() {
  // عداد لكل كارت حسب Id المنتج
  const [counts, setCounts] = useState<{ [id: number]: number }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4;
  const { userData }: any = useContext(AuthContext);
  const { fetchCart } = useContext(CartshopContext) || {};
  const { getStockStatus, canAddToCart, getStockMessage } = useStockContext();
  const { formatArabicPrice, formatArabicNumber } = useArabicNumbers();
  const userId = userData?.userId;
  interface TopDiscount {
    data: {
      Id: number;
      Name: string;
      Description: string;
      StockStatues: boolean;
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
    }[];
    pagination: {
      CurrentPage: number;
      PageSize: number;
      TotalCount: number;
      TotalPages: number;
    };
  }

  const [getTopfourDiscount, setGetTopfourDiscount] = useState<TopDiscount>();

  const getDiscount = async (PageSize: number, CurrentPage: number) => {
    try {
      const response = await axios.get<TopDiscount>(
        ProductsPoint.GetTopDiscountedProducts,
        {
          params: {
            CurrentPage,
            PageSize,
          },
          headers: {
            Authorization: `Bearer ${
              localStorage.getItem("token") || sessionStorage.getItem("token")
            }`,
          },
        }
      );
      setGetTopfourDiscount(response.data);
    } catch (errors) {
      console.log(errors);
    }
  };

  useEffect(() => {
    getDiscount(pageSize, currentPage);
  }, [currentPage]);

  const incrementHandler = useCallback(
    (Id: number): void => {
      const product = getTopfourDiscount?.data?.find((p) => p.Id === Id);
      if (!product) return;

      const currentQuantity = counts[Id] || 1;
      const newQuantity = currentQuantity + 1;

      // التحقق من المخزون قبل زيادة الكمية
      if (!canAddToCart(product.Id, newQuantity, [product])) {
        const message = getStockMessage(product.Id, newQuantity, [product]);
        toast.error(message);
        return;
      }

      setCounts((prev) => ({
        ...prev,
        [Id]: newQuantity,
      }));
    },
    [counts, getTopfourDiscount?.data, canAddToCart, getStockMessage]
  );

  const decrementHandler = useCallback((Id: number): void => {
    setCounts((prev) => ({
      ...prev,
      [Id]: (prev[Id] || 1) > 1 ? (prev[Id] || 1) - 1 : 1,
    }));
  }, []);
  interface cartItem {
    CartItems: {
      ProductId: 0;
      Quantity: 0;
    }[];
  }
  const addcarthandel = async (id: number) => {
    try {
      const quantity = counts[id] || 1;

      // التحقق من المخزون قبل الإضافة للسلة
      const product = getTopfourDiscount?.data?.find((p) => p.Id === id);
      if (!product) {
        toast.error("المنتج غير موجود");
        return;
      }

      if (!canAddToCart(product.Id, quantity, [product])) {
        const message = getStockMessage(product.Id, quantity, [product]);
        toast.error(message);
        return;
      }

      const data = {
        CartItems: [
          {
            ProductId: id,
            Quantity: quantity,
          },
        ],
      };
      let sessionId = sessionStorage.getItem("session-Id");
      if (!sessionId) {
        sessionId = Math.random().toString(36).substring(2, 15);
        sessionStorage.setItem("session-Id", sessionId);
      }
      const headers: any = {
        "session-Id": sessionId,
        Authorization: `Bearer ${
          localStorage.getItem("token") || sessionStorage.getItem("token")
        }`,
      };
      const response = await axios.post(cartShopPoint.Post, data, { headers });
      if (response.data) {
        toast.success("تم إضافة المنتج إلى السلة بنجاح");
        setCounts((prev) => ({ ...prev, [id]: 1 })); // Reset count for this product

        // بدلاً من window.location.reload() - تحديث السلة من الـ context
        if (fetchCart) {
          await fetchCart();
        }
      } else {
        toast.error("فشل في إضافة المنتج إلى السلة");
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
  };

  // State to hold favorite product IDs
  const [favorites, setFavorites] = useState<number[]>([]);

  // Get all favorites for the user
  const getAllFavorites = async (
    userId: string,
    pageNumber: number = 1,
    pageSize: number = 20
  ) => {
    try {
      if (!userId) return; // Ensure userId is available
      const response = await axios.get(
        ProductsPoint.GetFavorites(userId, pageNumber, pageSize),
        {
          headers: {
            Authorization: `Bearer ${
              localStorage.getItem("token") || sessionStorage.getItem("token")
            }`,
          },
        }
      );
      setFavorites(response.data.data.map((fav: any) => fav.Id)); // Id is ProductId
    } catch (error) {
      toast.error(error.response.data);
    }
  };

  // Toggle favorite (add/remove)
  const toggleFavorite = async (userId: string, productId: number) => {
    try {
      if (!userId) {
        toast.error("يرجى تسجيل الدخول لإضافة المنتج الي المفضلة");
        return;
      }
      if (favorites.includes(productId)) {
        // Remove from favorites
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
        // Add to favorites
        await axios.post(
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
        toast.success("تمت إضافة المنتج إلى المفضلة");
      }
      // Refresh favorites
      await getAllFavorites(userId);
    } catch (error) {
      toast.error("حدث خطأ أثناء تحديث المفضلة");
    }
  };

  useEffect(() => {
    if (userId) {
      getAllFavorites(userId);
    }
  }, [userId]);

  const totalPages = getTopfourDiscount?.pagination.TotalPages || 1;

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <>
      <div className={`${Style.contanerseller}`}>
        <div className={`${Style.captionseller}`}>
          <h1 className="text-center text-warning"> اكبر الخصومات %</h1>
          <p className="text-center">اكبر الخصومات علي هذه المنتجات</p>
        </div>
        <div className={`${Style.herocardsseller}`}>
          {getTopfourDiscount?.data && getTopfourDiscount.data.length > 0 ? (
            getTopfourDiscount.data.map((product) => (
              <div key={product.Id} className={`${Style.cardsseller} shadow`}>
                <div className={`${Style.hedcard}`}>
                  <span
                    className={Style.favoritProducts}
                    onClick={() => toggleFavorite(userId, product.Id)}
                  >
                    <FontAwesomeIcon
                      icon={faHeart}
                      style={{
                        color: favorites.includes(product.Id) ? "red" : "#bbb",
                        border: "1px solid white",
                        borderRadius: "50px",
                        padding: "8px",
                        backgroundColor: "gainsboro",
                      }}
                      className={Style.harticon}
                    />
                  </span>
                  {/* حالة المخزون */}
                  <div className="d-flex justify-content-center mb-2">
                    {(() => {
                      const stockStatus = getStockStatus(
                        product.StockQuantity,
                        counts[product.Id] || 1
                      );
                      return (
                        <span
                          className="badge"
                          style={{
                            backgroundColor:
                              stockStatus.status === "outOfStock"
                                ? "#f8d7da"
                                : stockStatus.status === "lastPiece"
                                ? "#fff3cd"
                                : stockStatus.status === "lowStock"
                                ? "#ffe8d1"
                                : "#d4edda",
                            color:
                              stockStatus.status === "outOfStock"
                                ? "#721c24"
                                : stockStatus.status === "lastPiece"
                                ? "#856404"
                                : stockStatus.status === "lowStock"
                                ? "#8b4513"
                                : "#155724",
                            border:
                              stockStatus.status === "outOfStock"
                                ? "1px solid #f5c6cb"
                                : stockStatus.status === "lastPiece"
                                ? "1px solid #ffeaa7"
                                : stockStatus.status === "lowStock"
                                ? "1px solid #ffd8a8"
                                : "1px solid #c3e6cb",
                            padding: "4px 8px",
                            borderRadius: "12px",
                            fontSize: "12px",
                            fontWeight: "600",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <FontAwesomeIcon
                            icon={stockStatus.icon}
                            style={{ color: stockStatus.color }}
                          />
                          {stockStatus.text}
                        </span>
                      );
                    })()}
                  </div>
                  <span className={`${Style.sealeproducts}`}>
                    {product.DiscountPercentage}%
                  </span>
                </div>
                <div className={`${Style.cardbody}`}>
                  <img
                    src={`${ImgURLBeasd}${product.ImageUrl}`}
                    alt={product.Name}
                  />
                  <div className={`${Style.cardtext}`}>
                    <Link
                      to={`store/product/${product.Id}`}
                      state={{ data: product }}
                      className={`${Style.viewProducts} text-center`}
                    >
                      <FontAwesomeIcon icon={faEye} />
                    </Link>
                  </div>
                  <div
                    className={`${Style.captitlecard} d-flex justify-content-between p-2 align-items-center`}
                  >
                    <h4 className="fw-bolder ">{product.Name}</h4>
                    <span>
                      <FontAwesomeIcon
                        className={Style.reateicon}
                        icon={faStar}
                        style={{ color: "gold" }}
                      />
                      <span style={{ fontSize: "20px", fontWeight: "800" }}>
                        {product.Rate}
                      </span>
                    </span>
                  </div>
                  <p>
                    {product.Description.length > 100
                      ? product.Description.slice(0, 100) + "..."
                      : product.Description}
                  </p>
                  <div
                    className={`${Style.pricecardshoping} d-flex justify-content-between mt-3 p-2`}
                  >
                    <div className={`${Style.cardshoping}`}>
                      <span
                        className={`${Style.addcart} d-flex justify-content-center align-items-center rounded shadow-lg text-center`}
                        style={{
                          backgroundColor: "#018f2c",
                          fontSize: "20px",
                          color: "white",
                        }}
                        onClick={() => addcarthandel(product.Id)}
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
                          onClick={() => incrementHandler(product.Id)}
                        />
                        {counts[product.Id] || 1}
                        {(counts[product.Id] || 1) > 1 ? (
                          <FontAwesomeIcon
                            icon={faMinus}
                            style={{
                              cursor: "pointer",
                              backgroundColor: "white",
                              borderRadius: "5px",
                              padding: "2px",
                              marginLeft: "10px",
                            }}
                            onClick={() => decrementHandler(product.Id)}
                          />
                        ) : (
                          <FontAwesomeIcon
                            icon={faMinus}
                            style={{
                              cursor: "not-allowed",
                              backgroundColor: "red",
                              color: "white",
                              borderRadius: "5px",
                              padding: "2px",
                              marginLeft: "10px",
                            }}
                            onClick={() => decrementHandler(product.Id)}
                          />
                        )}
                      </span>
                    </div>
                    <span className={`${Style.price}`}>
                      <span
                        style={{
                          fontSize: "21px",
                          fontWeight: "bold",
                          color: "green",
                        }}
                      >
                        {formatArabicPrice(product.DiscountedPrice)}
                      </span>
                      <span
                        style={{
                          fontSize: "12px",
                          color: "gray",
                          textDecoration: "line-through",
                        }}
                      >
                        {formatArabicPrice(product.Price)}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center">لا توجد منتجات مخفضة</div>
          )}
        </div>
        <div className={`${Style.heroPagenation}`}>
          <Stack spacing={2}>
            <Pagination
              count={totalPages}
              variant="outlined"
              shape="rounded"
              onChange={(e, value) => setCurrentPage(value)}
            />
          </Stack>
        </div>
      </div>
    </>
  );
}
