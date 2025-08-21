import {
  faArrowAltCircleLeft,
  faCartShopping,
  faHeart,
  faMinus,
  faPlus,
  faStar,
  faEllipsisV,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useState, useEffect } from "react";
import { data, useLocation, useNavigate } from "react-router-dom";
import Style from "./style/Style.module.css";
import avataruser from "../../../../../assets/svg/userimg.svg";
import {
  cartShopPoint,
  ImgURLBeasd,
  ProductsPoint,
  CategoryPoint,
  productFeedbackPoint,
} from "../../../../../constant/Const";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "../../../../../context/Context";
import { CartshopContext } from "../../../../../context/CartshopContext";
import { Helmet } from "react-helmet-async";
// Define a type for the product details
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
  ProductFeedbacks: any[];
}

// Define types for categories
interface SubCategory {
  Id: number;
  Name: string;
}

interface Category {
  Id: number;
  Name: string;
  SubCategories: SubCategory[];
}
export default function Product() {
  const { userData, sessionExpired }: null | any = useContext(AuthContext);
  const { fetchCart } = useContext(CartshopContext) || {};
  const UserId = userData?.userId;
  // const UserID: string = UserData?.userId; // Get UserID from context or set to 0 if not available
  const location = useLocation();
  const product: data = location?.state?.data;
  const navigate = useNavigate();

  const [count, setCount] = useState<number>(1);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState<boolean>(false);

  // Reviews state
  const [showReviewForm, setShowReviewForm] = useState<boolean>(false);
  const [reviewRating, setReviewRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [reviewsPerPage] = useState<number>(5);
  const [reviews, setReviews] = useState<any[]>(
    product?.ProductFeedbacks || []
  );
  const [loadingReviews, setLoadingReviews] = useState<boolean>(false);

  // جلب قائمة المفضلة عند تحميل الصفحة
  useEffect(() => {
    const fetchFavorites = async () => {
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
    };
    fetchFavorites();
  }, [UserId]);

  // جلب الفئات عند تحميل الصفحة
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const response = await axios.get(CategoryPoint.GetAllCategories);
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("فشل في جلب الفئات");
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // جلب المراجعات عند تحميل الصفحة
  useEffect(() => {
    fetchReviews();
  }, [product.Id]);

  // جلب المراجعات من الـ backend
  const fetchReviews = async () => {
    setLoadingReviews(true);
    try {
      // جلب المراجعات من الـ backend
      const response = await axios.get(
        productFeedbackPoint.GetAll(product.Id),
        {
          headers: {
            Authorization: `Bearer ${
              localStorage.getItem("token") || sessionStorage.getItem("token")
            }`,
          },
        }
      );
      setReviews(response.data || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      // إذا فشل جلب المراجعات، استخدم البيانات المحلية
      setReviews(product?.ProductFeedbacks || []);
    } finally {
      setLoadingReviews(false);
    }
  };

  // Decrement quantity handler
  const decrementHandler = (): void => {
    if (count >= 1) {
      setCount(count - 1);
    }
  };
  // Increment quantity handler
  const incrementHandler = (): void => {
    setCount(count + 1);
  };

  // Function to handle navigation back to the store
  const handlenavegate = () => {
    navigate("/store");
  };
  // Function to handle add/remove favorite (toggle)
  const handlefavorite = async () => {
    if (sessionExpired || !UserId) {
      toast.error("يرجى تسجيل الدخول لإضافة المنتج الي المفضلة");
      return;
    }
    if (favorites.includes(product.Id)) {
      // حذف من المفضلة
      try {
        await axios.delete(
          `${ProductsPoint.DeleteFavorites}?userId=${UserId}&productId=${product.Id}`,
          {
            headers: {
              Authorization: `Bearer ${
                localStorage.getItem("token") || sessionStorage.getItem("token")
              }`,
            },
          }
        );
        setFavorites((prev) => prev.filter((id) => id !== product.Id));
        toast.success("تمت إزالة المنتج من المفضلة");
      } catch (error) {
        if (
          axios.isAxiosError(error) &&
          error.response &&
          error.response.status === 401
        ) {
          toast.error("يرجى تسجيل الدخول لإضافة المنتج الي المفضلة");
        } else {
          toast.error("فشل في إزالة المنتج من المفضلة");
        }
      }
      return;
    }
    // إضافة للمفضلة
    try {
      await axios.post(
        `${ProductsPoint.AddFavorites(UserId, product.Id)}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${
              localStorage.getItem("token") || sessionStorage.getItem("token")
            }`,
          },
        }
      );
      setFavorites((prev) => [...prev, product.Id]);
      toast.success("تمت إضافة المنتج إلى المفضلة بنجاح");
    } catch (error) {
      if (
        axios.isAxiosError(error) &&
        error.response &&
        error.response.status === 401
      ) {
        toast.error("يرجى تسجيل الدخول لإضافة المنتج الي المفضلة");
      } else {
        toast.error(
          (error as any)?.response?.data?.[0] ||
            "فشل في إضافة المنتج إلى المفضلة"
        );
      }
    }
  };
  // دوال مساعدة للحصول على أسماء الفئات
  const getCategoryName = (categoryId: number): string => {
    const category = categories.find((cat) => cat.Id === categoryId);
    return category ? category.Name : "غير محدد";
  };

  const getSubCategoryName = (
    categoryId: number,
    subCategoryId: number
  ): string => {
    const category = categories.find((cat) => cat.Id === categoryId);
    if (!category) return "غير محدد";

    const subCategory = category.SubCategories.find(
      (sub) => sub.Id === subCategoryId
    );
    return subCategory ? subCategory.Name : "غير محدد";
  };

  // Reviews functions
  const handleSubmitReview = async () => {
    // التحقق من تسجيل الدخول (مزيج من userData و token)
    if (
      !UserId ||
      (!localStorage.getItem("token") && !sessionStorage.getItem("token"))
    ) {
      toast.error("يجب تسجيل الدخول لكتابة مراجعة");
      return;
    }
    if (sessionExpired) {
      toast.error("انتهت الجلسة، الرجاء تسجيل الدخول مرة أخرى");
      return;
    }
    // التحقق من التقييم (1-5 نجوم)
    if (reviewRating < 1 || reviewRating > 5) {
      toast.error("يرجى اختيار تقييم من 1 إلى 5 نجوم");
      return;
    }
    // التحقق من النص
    if (!reviewText.trim()) {
      toast.error("يرجى كتابة مراجعة");
      return;
    }

    try {
      const reviewData = {
        UserId: UserId,
        ProductId: product?.Id,
        Rate: reviewRating,
        Comment: reviewText.trim(),
      };

      // إرسال المراجعة للـ API
      await axios.post(productFeedbackPoint.Post, reviewData, {
        headers: {
          Authorization: `Bearer ${
            localStorage.getItem("token") || sessionStorage.getItem("token")
          }`,
        },
      });

      // إضافة المراجعة الجديدة للـ state
      const newReview = {
        Id: Date.now(), // مؤقت حتى يتم إرجاع ID من الـ backend
        UserId: UserId,
        ProductId: product?.Id,
        Rate: reviewRating,
        Comment: reviewText.trim(),
        UserName: userData?.name || "المستخدم",
        CreatedAt: new Date().toISOString(),
      };

      setReviews((prevReviews) => [newReview, ...prevReviews]);
      toast.success("تم إرسال المراجعة بنجاح");
      setShowReviewForm(false);
      setReviewRating(0);
      setReviewText("");
      setCurrentPage(1); // العودة للصفحة الأولى

      // جلب المراجعات المحدثة من الـ backend
      await fetchReviews();
    } catch (error) {
      if (
        axios.isAxiosError(error) &&
        error.response &&
        error.response.status === 401
      ) {
        toast.error("انتهت الجلسة، الرجاء تسجيل الدخول مرة أخرى");
      } else {
        toast.error("فشل في إرسال المراجعة");
      }
    }
  };

  // Pagination functions
  const totalReviews = reviews.length;
  const totalPages = Math.ceil(totalReviews / reviewsPerPage);
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Function to handle adding the product to the cart
  const handleaddToCart = async () => {
    if (sessionExpired) {
      toast.error("الرجاء تسجيل الدخول مرة أخرى");
      return;
    }

    const body = {
      CartItems: [
        {
          ProductId: product.Id,
          Quantity: count,
        },
      ],
    };
    try {
      // الحصول على session-Id الموجود أو إنشاء واحد جديد
      let sessionId = sessionStorage.getItem("session-Id");
      if (!sessionId) {
        sessionId = Math.random().toString(36).substring(2, 15);
        sessionStorage.setItem("session-Id", sessionId);
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
      toast.success("تمت إضافة المنتج إلى السلة بنجاح");

      // بدلاً من window.location.reload() - تحديث السلة من الـ context
      if (fetchCart) {
        await fetchCart();
      }
    } catch (error) {
      if (
        axios.isAxiosError(error) &&
        error.response &&
        error.response.status === 401
      ) {
        toast.error("انتهت الجلسة، الرجاء تسجيل الدخول مرة أخرى");
      } else {
        toast.error("فشل في إضافة المنتج إلى السلة");
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>{product.Name} - تفاصيل المنتج</title>
        <meta
          name="description"
          content={product.Description || "وصف المنتج غير متوفر"}
        />
      </Helmet>

      {/* Desktop Layout */}
      <section className={`${Style.Contanerproductsec}`}>
        <div className={`${Style.heroProductsSection} `}>
          <div className={`${Style.heroimgsec}`}>
            {/* create button for back to store */}
            <button onClick={handlenavegate} className={`${Style.backtostore}`}>
              <FontAwesomeIcon icon={faArrowAltCircleLeft} />
            </button>
            <img
              src={`${ImgURLBeasd}/${product?.ImageUrl}`}
              alt="img-product"
            />
          </div>
          <div className={`${Style.herotextsec}`}>
            <div className={`${Style.headsection} `}>
              <h1>{product.Name}</h1>
              <div className={`${Style.headDiscount}`}>
                <span>خصم {product?.DiscountPercentage}% </span>
                <span
                  className={`${Style.headhart} shadow-lg`}
                  role="button"
                  onClick={handlefavorite}
                >
                  <FontAwesomeIcon
                    icon={faHeart}
                    className={Style.harticon}
                    style={{
                      color: favorites.includes(product.Id) ? "red" : "#bbb",
                    }}
                  />
                </span>
              </div>
            </div>
            <div className={Style.productdetails}>
              <span className={`${Style.productinforate}`}>
                {reviews.length > 0
                  ? (
                      reviews.reduce((acc, f) => acc + (f.Rate || 0), 0) /
                      reviews.length
                    ).toFixed(1)
                  : 0}
                <FontAwesomeIcon icon={faStar} style={{ color: "gold" }} />
              </span>
              <span className={`${Style.productinfo}`}>
                <span>الكمية</span>
                {product.StockQuantity}
              </span>
              <span className={`${Style.productinfo}`}>
                <span>الفئة</span>
                {loadingCategories
                  ? "جاري التحميل..."
                  : getCategoryName(product.CategoryId)}
              </span>
              <span className={`${Style.productinfo}`}>
                <span>الفئة الفرعية</span>
                {loadingCategories
                  ? "جاري التحميل..."
                  : getSubCategoryName(
                      product.CategoryId,
                      product.SubCategoryId
                    )}
              </span>
              <span
                className={`${Style.productinfo}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "20px",
                  color: product.StockStatues === "In Stock" ? "green" : "red",
                }}
              >
                {product?.StockStatues === "In Stock" ? (
                  <span style={{ color: "green" }}>متوفر</span>
                ) : (
                  <span> غير متوفر</span>
                )}
              </span>
              <span className={`${Style.productinfoprice}`}>
                <span className={Style.pricedoler}>$</span>
                {product.DiscountedPrice}
                <span
                  style={{
                    fontSize: "20px",
                    color: "gray",
                    textDecoration: "line-through",
                  }}
                >
                  ${product.Price}
                </span>
              </span>
            </div>
            <div
              className={
                Style.productdescription + " " + Style.scrollDescription
              }
            >
              <h2>الوصف </h2>
              <p>{product.Description}</p>
              <p>{product.Body1}</p>
              <p>{product.Body1}</p>
              {/* <p>{product.Body2}</p> */}
            </div>
            <div className={Style.productaction}>
              {/* <Link to={"/payment"} className={Style.buyproduct}>
                <FontAwesomeIcon icon={faMoneyCheck} />
                أشتري الان
              </Link> */}
              <button className={Style.addtocart} onClick={handleaddToCart}>
                <FontAwesomeIcon icon={faCartShopping} />
                اضف الى السلة
              </button>
              {/* counter product */}
              <div className={Style.counterproduct}>
                <button
                  className=" "
                  onClick={incrementHandler}
                  style={{
                    backgroundColor: "white",
                  }}
                >
                  <FontAwesomeIcon icon={faPlus} />
                </button>
                <span>{count}</span>
                {count ? (
                  <button
                    className=" "
                    onClick={decrementHandler}
                    style={{
                      backgroundColor: "white",
                    }}
                  >
                    <FontAwesomeIcon icon={faMinus} />
                  </button>
                ) : (
                  <button
                    className=" "
                    onClick={decrementHandler}
                    style={{
                      cursor: "not-allowed",
                      backgroundColor: "red",
                      color: "white",
                    }}
                  >
                    <FontAwesomeIcon icon={faMinus} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Card Layout */}
      <div className={Style.productCardMobile}>
        <div className={Style.cardImageSection}>
          <button onClick={handlenavegate} className={Style.backButton}>
            <FontAwesomeIcon icon={faArrowAltCircleLeft} />
          </button>
          {product?.DiscountPercentage > 0 && (
            <div className={Style.discountBadge}>
              خصم {product.DiscountPercentage}%
            </div>
          )}
          <div className={Style.favoriteIcon} onClick={handlefavorite}>
            <FontAwesomeIcon
              icon={faHeart}
              style={{ color: favorites.includes(product.Id) ? "red" : "#bbb" }}
            />
          </div>
          <img src={`${ImgURLBeasd}/${product.ImageUrl}`} alt="img-product" />
        </div>

        <div className={Style.cardContent}>
          <h2 className={Style.productTitle}>{product.Name}</h2>

          <div className={Style.productStatus}>
            {product?.StockStatues === "In Stock" ? "متوفر" : "غير متوفر"}
          </div>

          <div className={Style.productRating}>
            <FontAwesomeIcon icon={faStar} className={Style.starIcon} />
            <span>
              {(() => {
                const count = reviews.length;
                if (count === 0) return "لا يوجد تقييمات";
                const total = reviews.reduce(
                  (acc: number, f: { Rate?: number }) => {
                    let rate = f.Rate || 0;
                    if (rate < 0) rate = 0;
                    if (rate > 5) rate = 5;
                    return acc + rate;
                  },
                  0
                );
                const avg = total / count;
                const roundedAvg = Math.min(Math.round(avg * 10) / 10, 5);
                return `${roundedAvg} من 5`;
              })()}
            </span>
          </div>

          <div
            className={Style.productDescription + " " + Style.scrollDescription}
          >
            {product.Description
              ? product.Description.length > 80
                ? product.Description.slice(0, 80) + "..."
                : product.Description
              : "وصف المنتج: منتج جديد يستاهل تجربه"}
          </div>

          <div className={Style.productPrice}>
            <span className={Style.currentPrice}>
              ${product.DiscountedPrice}
            </span>
            {(product.DiscountPercentage ?? 0) > 0 && (
              <span className={Style.originalPrice}>${product.Price}</span>
            )}
          </div>

          <div className={Style.productActions}>
            <div className={Style.quantityControl}>
              <button onClick={decrementHandler} disabled={count <= 1}>
                <FontAwesomeIcon icon={faMinus} />
              </button>
              <span className={Style.quantity}>{count}</span>
              <button onClick={incrementHandler}>
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </div>

            <button className={Style.addButton} onClick={handleaddToCart}>
              <FontAwesomeIcon icon={faPlus} className={Style.plusIcon} />
              أضف للسلة
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className={Style.reviewsSection}>
        <div className={Style.reviewsContainer}>
          {/* Reviews Summary */}
          <div className={Style.reviewsSummary}>
            <h3>مراجعات المستخدمين:</h3>
            <div className={Style.ratingSummary}>
              <div className={Style.overallRating}>
                <span className={Style.ratingNumber}>
                  {(() => {
                    const count = reviews.length;
                    if (count === 0) return "0";
                    const total = reviews.reduce(
                      (acc: number, f: { Rate?: number }) => {
                        let rate = f.Rate || 0;
                        if (rate < 0) rate = 0;
                        if (rate > 5) rate = 5;
                        return acc + rate;
                      },
                      0
                    );
                    const avg = total / count;
                    const finalAvg = Math.min(Math.round(avg * 10) / 10, 5);
                    return finalAvg.toFixed(1);
                  })()}
                </span>
                <div className={Style.stars}>
                  {[1, 2, 3, 4, 5].map((star) => {
                    const avgRating =
                      reviews.length > 0
                        ? Math.min(
                            reviews.reduce((acc, f) => acc + (f.Rate || 0), 0) /
                              reviews.length,
                            5
                          )
                        : 0;

                    // حساب لون النجمة بشكل صحيح
                    let starColor = "#ddd"; // رمادي افتراضياً

                    if (star <= avgRating) {
                      // نجوم كاملة أو جزئية
                      starColor = "#FFD700";
                    }

                    return (
                      <FontAwesomeIcon
                        key={star}
                        icon={faStar}
                        className={Style.starIcon}
                        style={{
                          color: starColor,
                        }}
                      />
                    );
                  })}
                </div>
                <span className={Style.totalReviews}>
                  {reviews.length} تقييم
                </span>
              </div>

              {/* Rating Distribution */}
              <div className={Style.ratingDistribution}>
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = reviews.length;
                  const ratingCount = reviews.filter(
                    (f: any) => f.Rate === rating
                  ).length;
                  const percentage =
                    count > 0 ? Math.round((ratingCount / count) * 100) : 0;

                  return (
                    <div key={rating} className={Style.ratingBar}>
                      <span className={Style.ratingLabel}>{rating} نجوم</span>
                      <div className={Style.barContainer}>
                        <div
                          className={Style.barFill}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className={Style.ratingPercentage}>
                        {percentage}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Reviews List */}
          <div className={Style.reviewsList}>
            {loadingReviews ? (
              <div className={Style.loadingReviews}>
                <p>جاري تحميل المراجعات...</p>
              </div>
            ) : currentReviews && currentReviews.length > 0 ? (
              currentReviews.map((review: any, index: number) => (
                <div key={index} className={Style.reviewItem}>
                  <div className={Style.reviewHeader}>
                    <div className={Style.reviewerInfo}>
                      <img
                        src={
                          userData?.image
                            ? `${ImgURLBeasd}${userData?.image}`
                            : avataruser
                        }
                        alt="user"
                        className={Style.reviewerAvatar}
                      />
                      <div className={Style.reviewerDetails}>
                        <span className={Style.reviewerName}>
                          {review.UserName || "المستخدم"}
                        </span>
                        <span className={Style.reviewDate}>
                          <div className={Style.reviewRating}>
                            <FontAwesomeIcon
                              icon={faStar}
                              style={{ color: "#FFD700" }}
                            />
                            <span>{review.Rate || 0}</span>
                          </div>
                          {review.CreatedAt
                            ? new Date(review.CreatedAt).toLocaleDateString(
                                "ar-EG"
                              )
                            : "الآن"}
                        </span>
                      </div>
                    </div>
                    <div className={Style.reviewOptions}>
                      <FontAwesomeIcon icon={faEllipsisV} />
                    </div>
                  </div>

                  <div className={Style.reviewContent}>
                    <p>{review.Comment}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className={Style.noReviews}>
                <p>لا توجد مراجعات لهذا المنتج بعد</p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className={Style.pagination}>
                <button
                  className={Style.paginationBtn}
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                >
                  السابق
                </button>

                <div className={Style.pageNumbers}>
                  {Array.from(
                    { length: totalPages },
                    (_, index) => index + 1
                  ).map((pageNumber) => (
                    <button
                      key={pageNumber}
                      className={`${Style.pageNumber} ${
                        currentPage === pageNumber ? Style.activePage : ""
                      }`}
                      onClick={() => handlePageChange(pageNumber)}
                    >
                      {pageNumber}
                    </button>
                  ))}
                </div>

                <button
                  className={Style.paginationBtn}
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  التالي
                </button>
              </div>
            )}
          </div>

          {/* Write Review Form */}
          <div className={Style.writeReviewSection}>
            <h3>اكتب مراجعتك لهذا المنتج</h3>
            <div className={Style.reviewForm}>
              <div className={Style.userInfo}>
                <img
                  src={
                    userData?.image
                      ? `${ImgURLBeasd}${userData?.image}`
                      : avataruser
                  }
                  alt="user"
                  className={Style.userAvatar}
                />
                <span className={Style.userName}>
                  {userData?.name || "المستخدم"}
                </span>
              </div>

              <div className={Style.ratingInput}>
                <span>التقييم:</span>
                <div className={Style.starRating}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FontAwesomeIcon
                      key={star}
                      icon={faStar}
                      className={Style.starIcon}
                      style={{
                        color: star <= reviewRating ? "#FFD700" : "#ddd",
                        cursor: "pointer",
                      }}
                      onClick={() => setReviewRating(star)}
                    />
                  ))}
                </div>
              </div>

              <textarea
                className={Style.reviewTextarea}
                placeholder="اكتب مراجعتك..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows={4}
              />

              <button
                className={Style.submitReviewBtn}
                onClick={handleSubmitReview}
              >
                نشر
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
