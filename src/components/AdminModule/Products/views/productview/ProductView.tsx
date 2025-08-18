import React, { useEffect, useState } from "react";
import {
  faArrowAltCircleRight,
  faTrash,
  faHeart,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLocation } from "react-router-dom";
import Style from "./style/style.module.css";
import imgiuser from "../../../../../assets/svg/userimg.svg";
import axios from "axios";
import { CategoryPoint, ImgURLBeasd, productFeedbackPoint, ProductsPoint } from "../../../../../constant/Const";
import { useContext } from "react";
import { AuthContext } from "../../../../../context/Context";
import { toast } from "react-toastify";
import { ShimmerSimpleGallery, ShimmerPostItem } from "react-shimmer-effects";

// Define a type for the product details
interface ProductDetails {
  Id: number;
  Name: string;
  CategoryId: number;
  SubCategoryId: number;
  Description: string;
  PriceAfter?: number;
  DiscountPercentage?: number;
  DiscountedPrice?: number;
  ImageUrl?: string;
  Price: number;
  Title1: string;
  Body1: string;
  Title2: string;
  Body2: string;
  ProductFeedbacks: {
    UserId: number;
    Comment: string;
    FeedBackId: number;
    Rate: number;
    UserName: string;
    CreatedAt: string;
  }[];
  Rate: number;
  StockQuantity: number;
  StockStatues: string;
}

export default function ProductView() {
  const { userData }: any = useContext(AuthContext);
  const [isPopular, setIsPopular] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [feedbackToDelete, setFeedbackToDelete] = useState<number | null>(null);
  const [popularProducts, setPopularProducts] = useState<any[]>([]);
  const [loadingPopular, setLoadingPopular] = useState(true);
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [categoryName, setCategoryName] = useState<string | null>(null);

  const location = useLocation();
  const productId: number = location.state.data;

  // Function to handle navigation back to the store
  const handlenavegate = () => {
    window.history.back();
  };

  // Get category name from category ID
  const getCategoryName = async (categoryId: number) => {
    if (!categoryId) {
      setCategoryName("غير محدد");
      return;
    }
    
    try {
    const response = await axios.get(
      CategoryPoint.GetCategoriesId(categoryId),
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}`,
        },
      }
    );
      
      if (response.data && response.data.Name) {
    setCategoryName(response.data.Name);
      } else {
        setCategoryName("غير محدد");
      }
    } catch (error) {
      console.error("Error fetching category:", error);
      setCategoryName("غير محدد");
    }
  };

  // Fetch product by ID
  const fetchProduct = async () => {
    try {
      console.log("Fetching product with ID:", productId);
      
      const response = await axios.get(
        ProductsPoint.GetProductId(productId),
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}`,
          },
        }
      );

      console.log("API Response:", response);
      
      if (response.data && response.data.data) {
        const productData = response.data.data;
        console.log("Product data:", productData);
        setProduct(productData);
      } else if (response.data) {
        console.log("Direct product data:", response.data);
        setProduct(response.data);
      } else {
        console.error("No product data found in response");
        toast.error("لم يتم العثور على بيانات المنتج");
      }
    } catch (error: any) {
      console.error("Error fetching product:", error);
      console.error("Error response:", error.response?.data);
      toast.error("حدث خطأ أثناء جلب بيانات المنتج");
    }
  };

  // Fetch all popular products once
  const getPopularProducts = async () => {
    setLoadingPopular(true);
    try {
      const response = await axios.get(
        ProductsPoint.GetPopular(1, 1000),
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}`,
          },
        }
      );
      
      let products = [];
      if (response.data.data) {
        products = response.data.data;
      } else if (response.data) {
        products = response.data;
      } else if (Array.isArray(response.data)) {
        products = response.data;
      }
      
      setPopularProducts(products);
    } catch (error) {
      setPopularProducts([]);
    } finally {
      setLoadingPopular(false);
    }
  };

  // Check if product is popular
  const checkIfProductIsPopular = () => {
    if (popularProducts.length === 0 || !product) return;
    
    const isInPopular = popularProducts.some(popularProduct => 
      popularProduct.Id === product.Id
    );
    
    setIsPopular(isInPopular);
  };

  // Handle popular/not popular toggle
  const handlePopularToggle = async () => {
    if (!userData?.userId) {
      toast.error("يجب تسجيل الدخول أولاً");
      return;
    }

    if (!product) return;

    setLoading(true);
    try {
      if (isPopular) {
        await axios.put(
          ProductsPoint.MarkNotPopular(product.Id),
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}`,
            },
          }
        );
        setIsPopular(false);
        setPopularProducts(prev => prev.filter(p => p.Id !== product.Id));
      } else {
        await axios.put(
          ProductsPoint.MarkPopular(product.Id),
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}`,
            },
          }
        );
        setIsPopular(true);
        setPopularProducts(prev => [...prev, product]);
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء تحديث حالة المنتج");
    } finally {
      setLoading(false);
    }
  };

  // Show delete confirmation popup
  const showDeleteConfirmation = (feedbackId: number) => {
    setFeedbackToDelete(feedbackId);
    setShowDeletePopup(true);
  };

  // Delete feedback
  const handleDeleteFeedback = async () => {
    if (!userData?.userId || !feedbackToDelete) {
      toast.error("يجب تسجيل الدخول أولاً");
      return;
    }

    try {
      await axios.delete(
        `${productFeedbackPoint.Delete(feedbackToDelete)}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}`,
          },
        }
      );
      
      setShowDeletePopup(false);
      setFeedbackToDelete(null);
      toast.success("تم حذف المراجعة بنجاح");
      window.location.reload();
    } catch (error) {
      toast.error("حدث خطأ أثناء حذف المراجعة");
    }
  };

  // Cancel delete
  const cancelDelete = () => {
    setShowDeletePopup(false);
    setFeedbackToDelete(null);
  };

  // Initial data fetching
  useEffect(() => {
    if (productId) {
      console.log("Starting to fetch data for product ID:", productId);
      fetchProduct();
      getPopularProducts();
    } else {
      console.error("No product ID provided");
      toast.error("معرف المنتج غير صحيح");
    }
  }, [productId]);

  // Get category name when product is loaded
  useEffect(() => {
    if (product?.CategoryId) {
    getCategoryName(product.CategoryId);
    }
  }, [product?.CategoryId]);

  // Check if product is popular when popular products are loaded
  useEffect(() => {
    if (popularProducts.length > 0 && product) {
      checkIfProductIsPopular();
    }
  }, [popularProducts, product]);

  // Show loading if product is not loaded yet
  if (!product) {
    return (
      <div className={Style.Contanerproductsec}>
        {/* شيمر الهيدر/صورة المنتج */}
        <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start', marginBottom: 32 }}>
          <div style={{ flex: '0 0 320px', minWidth: 220 }}>
            <ShimmerPostItem title cta />
          </div>
          <div style={{ flex: 1 }}>
            <ShimmerSimpleGallery row={1} col={3} imageHeight={32} />
            <div style={{ height: 32, width: '80%', background: '#e0e0e0', borderRadius: 8, margin: '24px 0' }} />
          </div>
        </div>
        {/* شيمر مراجعات المنتج */}
        <div style={{ marginTop: 32 }}>
          <ShimmerPostItem title cta />
          <ShimmerPostItem title cta />
          <ShimmerPostItem title cta />
        </div>
      </div>
    );
  }

  // Ensure ProductFeedbacks is always an array
  const productFeedbacks = product.ProductFeedbacks || [];

  // Debug: Log product data to see what we're getting
  console.log("Current product:", product);
  console.log("ProductFeedbacks:", productFeedbacks);

  return (
    <>
      <section className={`${Style.Contanerproductsec}`}>
        <div className={`${Style.heroProductsSection} `}>
          <div
            className={`${Style.heroimgsec}`}
            style={{ position: "relative" }}
          >
            <button onClick={handlenavegate} className={`${Style.backtostore}`}>
              <FontAwesomeIcon icon={faArrowAltCircleRight} />
            </button>
            {product.ImageUrl ? (
              <img
                src={`${ImgURLBeasd}/${product.ImageUrl}`}
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
              />
            )}
          </div>
          <div className={`${Style.herotextsec}`}>
            <div className={`${Style.headsection} `}>
              <h1>{product.Name}</h1>
              <div className={`${Style.headDiscount}`}>
                <span>خصم {product.DiscountPercentage}% </span>

                <span 
                  className={`${Style.headhart} shadow-lg`} 
                  role="button"
                  onClick={handlePopularToggle}
                  style={{ 
                    cursor: (loading || loadingPopular) ? 'not-allowed' : 'pointer',
                    opacity: loadingPopular ? 0.5 : 1
                  }}
                >
                  <FontAwesomeIcon 
                    icon={faHeart} 
                    className={Style.harticon} 
                    style={{ 
                      color: isPopular ? '#ff4757' : '#ccc',
                      opacity: (loading || loadingPopular) ? 0.5 : 1
                    }} 
                  />
                </span>
              </div>
            </div>
            <div className={Style.productdetails}>
              <span className={`${Style.productinforate}`}>
                {product.Rate}
                <FontAwesomeIcon icon={faStar} style={{ color: "gold" }} />
              </span>
              <span className={`${Style.productinfo}`}>
                <span>الكمية</span>
                {product.StockQuantity}
              </span>
              <span className={`${Style.productinfo}`}>
                <span>الفئة</span>
                {categoryName}
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
                {product.StockStatues === "In Stock" ? (
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
            <div className={Style.productdescription}>
              <h2>الوصف </h2>
              {!product.Description || product.Description === "" ? (
                <p style={{ color: "red", fontSize: "20px" }}>
                  لم يتم ادخل اي تفاصيل للمنتج
                </p>
              ) : (
                <p>{product.Description}</p>
              )}
            </div>
            <div className={Style.productDetails}>
              <h2>تفاصيل المنتج</h2>
              <span className={Style.Detailstitle}>
                <h3>{product.Title1}</h3>
                <p>{product.Body1}</p>
              </span>
              <span className={Style.Detailstitle}>
                <h3>{product.Title2}</h3>
                <p>{product.Body2}</p>
              </span>
            </div>
          </div>
        </div>
        <div className={Style.productFeedbacks}>
          <h2>مراجعات المنتج</h2>
          {productFeedbacks && productFeedbacks.length > 0 ? (
            productFeedbacks.map((feedback) => (
              <div key={feedback.FeedBackId} className={Style.productfeedbakusers}>
              <FontAwesomeIcon
                  icon={faTrash}
                className={`${Style.productoption}`}
                  onClick={() => showDeleteConfirmation(feedback.FeedBackId)}
                  style={{ cursor: 'pointer', color: '#ff4757' }}
              />
              <span className={Style.userimg}>
                <img src={imgiuser} alt="user" style={{ width: "50px" }} />
                <span className={Style.userfeedbackname}>
                  {feedback.UserName}
                </span>
              </span>

              <div className={Style.userfeedback}>
                <span className={Style.userfeedbackrate}>
                  {feedback.Rate}
                  <FontAwesomeIcon icon={faStar} style={{ color: "gold" }} />
                  <span className={Style.userfeedbackdate}>
                      {feedback.CreatedAt ? feedback.CreatedAt.slice(0, 10) : ''}
                  </span>
                </span>

                <p className={Style.userfeedbacktext}>
                    {feedback.Comment}
                </p>
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
              <p>لا توجد مراجعات لهذا المنتج بعد</p>
            </div>
          )}
        </div>
      </section>

      {/* Delete Confirmation Popup */}
      {showDeletePopup && (
        <div className={Style.deletePopupOverlay}>
          <div className={Style.deletePopup}>
            <div className={Style.deletePopupHeader}>
              <h3>تأكيد الحذف</h3>
            </div>
            <div className={Style.deletePopupBody}>
              <p>هل أنت متأكد من حذف هذه المراجعة؟</p>
              <p style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>
                لا يمكن التراجع عن هذا الإجراء
              </p>
            </div>
            <div className={Style.deletePopupFooter}>
              <button 
                className={Style.deletePopupCancel}
                onClick={cancelDelete}
              >
                إلغاء
              </button>
              <button 
                className={Style.deletePopupConfirm}
                onClick={handleDeleteFeedback}
              >
                حذف
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
