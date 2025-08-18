import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsis,
  faEye,
  faHeart,
  faHeartBroken,
  faPenToSquare,
  faTrash,
  faFilter,
  faTimes,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import {
  CategoryPoint,
  ImgURLBeasd,
  ProductsPoint,
} from "../../../constant/Const";
import Style from "./style/style.module.css";
import loding from "../../../assets/صورة_واتساب_بتاريخ_2024-11-10_في_22.53.07_158af9f7-removebg-preview.png";
export default function ProductPopular() {
  interface Product {
    Id: number;
    Name: string;
    CategoryId: number;
    SubCategoryId: number;
    Description: string;
    priceAfter?: number;
    DiscountPercentage?: number;
    DiscountedPrice?: number;
    ImageUrl: string;
    Price: number;
    ProductDetails: [object];
    ProductFeedbacks: [];
    Rate: number;
    StockQuantity: number;
    StockStatues: string;
  }
  
  interface Category {
    Id: number;
    Name: string;
    SubCategoryId: [object];
  }

  interface SubCategory {
    Id: number;
    Name: string;
    categoryId?: number;
  }

  const [getPopularProducts, setGetPopularProducts] = useState<Product[]>([]);
  const [categoryName, setCategoryName] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [dropdown, setDropdown] = useState<number | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const navigate = useNavigate();
  const [pagination, setPagination] = useState({ currentPage: 1, pageSize: 10 });
  const [filters, setFilters] = useState({
    categoryId: "",
    subCategoryId: "",
    minPrice: "",
    maxPrice: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const getPopularProductsData = async ({pageNumber, pageSize}: {pageNumber: number, pageSize: number}) => {
    try {
      setLoading(true);
      const response = await axios.get(ProductsPoint.GetPopular(pageNumber, pageSize), {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}`,
        },
      });
      setGetPopularProducts(response.data.Data || response.data.data || response.data || []);
    } catch (error) {
      console.log(error);
      toast.error("حدث خطأ في جلب المنتجات الشائعة");
    } finally {
      setLoading(false);
    }
  };

  // Get categories
  const getCategoryName = async () => {
    try {
      const response = await axios.get(CategoryPoint.GetAllCategories, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}`,
        },
      });
      setCategoryName(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Get all subcategories
  const getAllSubCategories = async () => {
    try {
      const allSubCategories: SubCategory[] = [];
      
      for (const category of categoryName) {
        try {
          const response = await axios.get(CategoryPoint.Getsubcategories(category.Id), {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}`,
            },
          });
          
          const subCategoriesWithCategory = response.data.map((sub: SubCategory) => ({
            ...sub,
            categoryId: category.Id
          }));
          
          allSubCategories.push(...subCategoriesWithCategory);
        } catch (error) {
          console.error(`Error fetching subcategories for category ${category.Id}:`, error);
        }
      }
      
      setSubCategories(allSubCategories);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  // Get subcategory name
  const getSubCategoryName = (subCategoryId: number) => {
    const subCategory = subCategories.find(sub => sub.Id === subCategoryId);
    return subCategory ? subCategory.Name : "غير محدد";
  };

  // Remove from popular
  const removeFromPopular = async (productId: number) => {
    try {
      await axios.put(ProductsPoint.MarkNotPopular(productId), { productId }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}`,
        },
      });
      
      // Remove from local state
      setGetPopularProducts(prev => prev.filter(product => product.Id !== productId));
      toast.success("تم إزالة المنتج من المنتجات الشائعة");
    } catch (error) {
      toast.error("حدث خطأ أثناء إزالة المنتج من المنتجات الشائعة");
    }
  };

  // Delete product
  const deleteProduct = async () => {
    if (!selectedProduct) return;
    
    try {
      await axios.delete(ProductsPoint.Delete(selectedProduct.Id), {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}`,
        },
      });
      
      setGetPopularProducts(prev => prev.filter(product => product.Id !== selectedProduct.Id));
      toast.success("تم حذف المنتج بنجاح");
    } catch (error) {
      toast.error("حدث خطأ أثناء حذف المنتج");
    } finally {
      setShowDeletePopup(false);
      setSelectedProduct(null);
    }
  };

  // Close popup
  const closePopup = () => {
    setShowDeletePopup(false);
    setSelectedProduct(null);
  };

  // Add effect to close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdown !== null) {
        const dropdownMenus = document.querySelectorAll(".dropdown-menu.show");
        let clickedInside = false;
        dropdownMenus.forEach((menu) => {
          if (menu.contains(event.target as Node)) {
            clickedInside = true;
          }
        });
        if (!clickedInside) setDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdown]);

  // Effect to get initial data
  useEffect(() => {
    getPopularProductsData({ pageNumber: pagination.currentPage, pageSize: pagination.pageSize });
    getCategoryName();
  }, []);

  // Effect to get subcategories after categories are loaded
  useEffect(() => {
    if (categoryName.length > 0) {
      getAllSubCategories();
    }
  }, [categoryName]);

  // دالة فلترة المنتجات الشائعة في الـ frontend
  const filteredPopularProducts = getPopularProducts.filter(product => {
    let match = true;
    if (filters.categoryId && product.CategoryId !== parseInt(filters.categoryId)) match = false;
    if (filters.subCategoryId && product.SubCategoryId !== parseInt(filters.subCategoryId)) match = false;
    if (filters.minPrice && product.Price < parseFloat(filters.minPrice)) match = false;
    if (filters.maxPrice && product.Price > parseFloat(filters.maxPrice)) match = false;
    if (searchTerm && !product.Name.toLowerCase().includes(searchTerm.toLowerCase())) match = false;
    return match;
  });

  // أضف دوال مساعدة
  const getStockStatus = (quantity: number) => {
    if (quantity === 0) {
      return { status: 'outOfStock', text: 'نفذ المخزون' };
    } else if (quantity <= 10) {
      return { status: 'lowStock', text: 'مخزون منخفض' };
    } else {
      return { status: 'inStock', text: 'متوفر' };
    }
  };
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ar-EG', {
      style: 'currency',
      currency: 'EGP'
    }).format(price);
  };

  return (
    <>
      {loading ? (
        <div className={Style.loadingWrapper}>
          <img src={loding} alt="loading..." className={Style.loadingImg} style={{width: "100px", height: "100px" , margin: "0 auto", objectFit:"contain" , textAlign:"center" } } />
          <span>جاري التحميل...</span>
        </div>
      ) : (
        <motion.div className={Style.productsContainer} dir="rtl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <div className={Style.productsHeader}>
            <div>
            <h3>المنتجات الشائعة</h3>
            <h6>تستطيع أن تفحص كل المنتجات الشائعة</h6>
            </div>
            <div className={Style.productsActionsRow}>
              {/* <button onClick={() => navigate("/admin/add-product")}>إضافة منتج</button> */}
              <button onClick={() => navigate("/admin/product-list")}>عرض المنتجات</button>
            </div>
          </div>
          <div className={Style.productsResultsCount}>
            <p>
                عدد المنتجات الشائعة: {getPopularProducts.length} منتج
              </p>
          </div>
          {/* زر التصفية يظهر فقط في الشاشات الصغيرة */}
          <div className={Style.filterButtonWrapper}>
            <button className={Style.filterButton} onClick={() => setShowFilterModal(true)}>
              <FontAwesomeIcon icon={faFilter} /> التصفية
            </button>
          </div>

          {/* صف الفلاتر يظهر فقط في الشاشات الكبيرة */}
          <div className={Style.productsFiltersRow}>
            <div className={Style.productsFiltersCol}>
              <select value={filters.categoryId} onChange={e => setFilters(f => ({ ...f, categoryId: e.target.value }))}>
                <option value="">اختر الفئة</option>
                {categoryName.map((category) => (
                  <option key={category.Id} value={category.Id}>{category.Name}</option>
                ))}
              </select>
              <select value={filters.subCategoryId} onChange={e => setFilters(f => ({ ...f, subCategoryId: e.target.value }))}>
                <option value="">اختر الفئة الفرعية</option>
                {subCategories
                  .filter(sub => !filters.categoryId || sub.categoryId === parseInt(filters.categoryId))
                  .map((subCategory) => (
                    <option key={subCategory.Id} value={subCategory.Id}>{subCategory.Name}</option>
                  ))}
              </select>
              <input type="number" placeholder="السعر من" value={filters.minPrice} onChange={e => setFilters(f => ({ ...f, minPrice: e.target.value }))} />
              <input type="number" placeholder="السعر إلى" value={filters.maxPrice} onChange={e => setFilters(f => ({ ...f, maxPrice: e.target.value }))} />
            </div>
            <div className={Style.productsSearchCol}>
              <div className={Style.searchInputWrapper}>
                <input 
                  className={Style.searchInput}
                  type="text" 
                  aria-label="Search" 
                  placeholder="ابحث هنا ..." 
                  value={searchTerm} 
                  onChange={e => setSearchTerm(e.target.value)}
                />
                <FontAwesomeIcon 
                  icon={faSearch} 
                  className={Style.searchIcon}
                />
              </div>
              {searchTerm && (
                <button onClick={() => setSearchTerm("")} title="إعادة تعيين البحث" className={Style.resetFilterIcon}>
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              )}
        </div>
          </div>

          {/* المودال العصري للفلاتر */}
          {showFilterModal && (
            <div className={Style.filterModalOverlay}>
              <div className={Style.filterModalBox}>
                <div className={Style.filterModalHeader}>
                  <span>التصفية</span>
                  <button className={Style.closeModalBtn} onClick={() => setShowFilterModal(false)}>
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
                <div className={Style.filterModalContent}>
                  {/* البحث */}
                  <div className={Style.productsSearchCol}>
                    <div className={Style.searchInputWrapper}>
                      <input 
                        className={Style.searchInput}
                        type="text" 
                        aria-label="Search" 
                        placeholder="ابحث هنا ..." 
                        value={searchTerm} 
                        onChange={e => setSearchTerm(e.target.value)}
                      />
                      <FontAwesomeIcon 
                        icon={faSearch} 
                        className={Style.searchIcon}
                      />
                    </div>
                    {searchTerm && (
                      <button onClick={() => setSearchTerm("")} title="إعادة تعيين البحث" className={Style.resetFilterIcon}>
                        <FontAwesomeIcon icon={faTimes} />
                      </button>
                    )}
                  </div>
                  {/* الفلاتر */}
                  <div className={Style.productsFiltersCol}>
                    <select value={filters.categoryId} onChange={e => setFilters(f => ({ ...f, categoryId: e.target.value }))}>
                      <option value="">اختر الفئة</option>
                      {categoryName.map((category) => (
                        <option key={category.Id} value={category.Id}>{category.Name}</option>
                      ))}
                    </select>
                    <select value={filters.subCategoryId} onChange={e => setFilters(f => ({ ...f, subCategoryId: e.target.value }))}>
                      <option value="">اختر الفئة الفرعية</option>
                      {subCategories
                        .filter(sub => !filters.categoryId || sub.categoryId === parseInt(filters.categoryId))
                        .map((subCategory) => (
                          <option key={subCategory.Id} value={subCategory.Id}>{subCategory.Name}</option>
                        ))}
                    </select>
                    <input type="number" placeholder="السعر من" value={filters.minPrice} onChange={e => setFilters(f => ({ ...f, minPrice: e.target.value }))} />
                    <input type="number" placeholder="السعر إلى" value={filters.maxPrice} onChange={e => setFilters(f => ({ ...f, maxPrice: e.target.value }))} />
                  </div>
                  <div className={Style.filterModalFooter}>
                    <button className={Style.applyFilterBtn} onClick={() => setShowFilterModal(false)}>
                      تطبيق
                    </button>
                    {(filters.categoryId || filters.subCategoryId || filters.minPrice || filters.maxPrice || searchTerm) && (
                      <button onClick={() => setFilters({ categoryId: "", subCategoryId: "", minPrice: "", maxPrice: "" }) || setSearchTerm("")} title="إعادة تعيين الفلاتر" className={Style.resetFilterIcon}>
                        <FontAwesomeIcon icon={faTimes} />
                      </button>
                    )}
                  </div>
                </div>
          </div>
        </div>
          )}
          <div className={Style.productsTableWrapper}>
            <table className={Style.productsTable} style={{ minWidth: 700 }}>
                <thead>
                  <tr>
                    <th>الاسم</th>
                    <th>الصورة</th>
                      <th>السعر قبل الخصم</th>
                      <th>السعر بعد الخصم</th>
                    <th>الكمية المتاحة</th>
                    <th>الفئة</th>
                    <th>الفئة الفرعية</th>
                    <th>خيارات</th>
                  </tr>
                </thead>
                <tbody>
                {filteredPopularProducts.length === 0 ? (
                    <tr>
                        <td colSpan={8} className="text-center">
                        لا توجد منتجات شائعة
                      </td>
                    </tr>
                  ) : (
                  filteredPopularProducts.map((product) => {
                    const stockStatus = getStockStatus(product.StockQuantity);
                    return (
                      <tr key={product.Id}>
                        <td>{product.Name}</td>
                        <td>
                          <img
                            src={product.ImageUrl === null ? "notfound" : `${ImgURLBeasd}/${product.ImageUrl}`}
                            alt={product.Name}
                          />
                        </td>
                        <td>{formatPrice(product.Price)}</td>
                        <td>{formatPrice(product.DiscountedPrice || product.Price)}</td>
                        <td>
                          <div className={`${Style.stockStatus} ${Style[stockStatus.status]}`}>{stockStatus.text}</div>
                        </td>
                        <td>{categoryName.find(c => c.Id === product.CategoryId)?.Name || "-"}</td>
                        <td>{getSubCategoryName(product.SubCategoryId)}</td>
                        <td>
                          <div
                            className="dropdown"
                            style={{
                              position: "relative",
                              display: "inline-block",
                            }}
                          >
                            <FontAwesomeIcon
                              icon={faEllipsis}
                              style={{ cursor: "pointer", fontSize: "1.3rem" }}
                              onClick={() => setDropdown(product.Id)}
                            />
                            {dropdown === product.Id && (
                              <ul
                                className="dropdown-menu show"
                                style={{
                                  position: "absolute",
                                  right: "-100px",
                                  top: "100%",
                                  zIndex: 9999,
                                  display: "block",
                                  minWidth: "120px",
                                  background: "#fff",
                                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                                  border: "1px solid #ddd",
                                  padding: "0.5rem 0",
                                  maxHeight: "none",
                                  overflowY: "hidden",
                                }}
                              >
                                <li className="text-center">
                                  <button className="dropdown-item">
                                    <Link
                                      style={{ color: "green" }}
                                      onClick={() => {
                                        setDropdown(null);
                                      }}
                                      to={`/admin/product-view/${product.Id}`}
                                      state={{ data: product }}
                                    >
                                      <FontAwesomeIcon icon={faEye} />
                                    </Link>
                                  </button>
                                </li>
                                <li className="text-center">
                                  <button className="dropdown-item">
                                    <Link
                                      style={{ color: "yellowgreen" }}
                                      onClick={() => {
                                        setDropdown(null);
                                      }}
                                      to={`/admin/add-product/${product.Id}`}
                                      state={{ data: product.Id, method: "Edit" }}
                                    >
                                      <FontAwesomeIcon icon={faPenToSquare} />
                                    </Link>
                                  </button>
                                </li>
                                <li className="text-center">
                                  <button
                                    className="dropdown-item text-danger"
                                    onClick={() => {
                                      setSelectedProduct(product);
                                      setShowDeletePopup(true);
                                      setDropdown(null);
                                    }}
                                  >
                                    <FontAwesomeIcon icon={faTrash} />
                                  </button>
                                </li>
                              </ul>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                  )}
                </tbody>
              </table>
            </div>
          {/* الباجينيشن العصري */}
          <div className={Style.productsPaginationRow}>
            <button
              disabled={pagination.currentPage === 1}
              onClick={() => setPagination(prev => ({ ...prev, currentPage: Math.max(prev.currentPage - 1, 1) }))}
            >
              السابق
            </button>
            <span>
              صفحة {pagination.currentPage}
            </span>
            <button
              disabled={getPopularProducts.length < pagination.pageSize}
              onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
            >
              التالي
            </button>
        </div>
      </motion.div>
      )}

      {/* Confirm Delete Popup */}
      {showDeletePopup && selectedProduct && (
        <div className={Style.productsDeleteOverlay}>
          <div className={Style.productsDeleteBox}>
            <h5>تأكيد الحذف</h5>
            <p>
              هل أنت متأكد أنك تريد حذف المنتج <b>{selectedProduct.Name}</b>؟
            </p>
            <div>
              <button onClick={deleteProduct}>حذف</button>
              <button onClick={closePopup}>إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 