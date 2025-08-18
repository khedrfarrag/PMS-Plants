import React from "react";
import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Style from "./style.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsis,
  faEye,
  faHeart,
  faMarker,
  faPenToSquare,
  faTrash,
  faSearch,
  faFilter,
  faTimes,
  faHeartBroken,
  faBars,
  faPlus,
  faList,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import {
  CategoryPoint,
  ImgURLBeasd,
  ProductsPoint,
} from "../../../../constant/Const";
import {
  ShimmerSimpleGallery,
  ShimmerPostItem,
  ShimmerTable,
} from "react-shimmer-effects";
import Stack from "@mui/material/Stack";
import Pagination from "@mui/material/Pagination";

function ProductsList() {
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

  interface Pagination {
    currentPage: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  }

  // State for products and loading
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [originalFilteredProducts, setOriginalFilteredProducts] = useState<
    Product[]
  >([]); // النتائج الأصلية من الـ backend
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // State for pagination
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 1,
    hasNext: false,
    hasPrevious: false,
  });

  // State for filters
  const [filters, setFilters] = useState({
    categoryId: "",
    subCategoryId: "",
    hasDiscount: "",
    minPrice: "",
    maxPrice: "",
    feedbackScore: "",
  });
  // Debounced price state
  const [debouncedPrice, setDebouncedPrice] = useState({ min: "", max: "" });
  // Popup state
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [dropdown, setDropdown] = useState<number | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [categoryName, setCategoryName] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [subCategoriesLoading, setSubCategoriesLoading] = useState(false);
  const [popularProductIds, setPopularProductIds] = useState<number[]>([]);
  const [dropdownMenu, setDropdownMenu] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);

  // Get categories
  const getCategoryName = async () => {
    try {
      const response = await axios.get(CategoryPoint.GetAllCategories, {
        headers: {
          Authorization: `Bearer ${
            localStorage.getItem("token") || sessionStorage.getItem("token")
          } `,
        },
      });
      setCategoryName(response.data);
    } catch (error) {
      if (
        axios.isAxiosError(error) &&
        error.response &&
        error.response.data &&
        error.response.data.Error
      ) {
        toast.error(error.response.data.Error);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("حدث خطأ أثناء جلب الفئات");
      }
    }
  };

  // دالة لجلب قائمة المنتجات الشائعة
  const getPopularProductIds = async () => {
    try {
      const response = await axios.get(ProductsPoint.GetPopular(1, 1000), {
        headers: {
          Authorization: `Bearer ${
            localStorage.getItem("token") || sessionStorage.getItem("token")
          }`,
        },
      });

      const popularProducts =
        response.data.Data || response.data.data || response.data || [];
      const popularIds = popularProducts.map((product: Product) => product.Id);
      setPopularProductIds(popularIds);
    } catch (error) {
      console.error("Error fetching popular product IDs:", error);
    }
  };

  // دالة مساعدة لتحديد ما إذا كان المنتج شائع
  const isProductPopular = (productId: number) => {
    return popularProductIds.includes(productId);
  };

  // Get all subcategories
  const getAllSubCategories = async () => {
    setSubCategoriesLoading(true);
    try {
      // Get subcategories for all categories
      const allSubCategories: SubCategory[] = [];

      for (const category of categoryName) {
        try {
          const response = await axios.get(
            CategoryPoint.Getsubcategories(category.Id),
            {
              headers: {
                Authorization: `Bearer ${
                  localStorage.getItem("token") ||
                  sessionStorage.getItem("token")
                }`,
              },
            }
          );

          // Add category info to subcategories for easier filtering
          const subCategoriesWithCategory = response.data.map(
            (sub: SubCategory) => ({
              ...sub,
              categoryId: category.Id,
            })
          );

          allSubCategories.push(...subCategoriesWithCategory);
        } catch (error) {
          console.error(
            `Error fetching subcategories for category ${category.Id}:`,
            error
          );
        }
      }

      setSubCategories(allSubCategories);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    } finally {
      setSubCategoriesLoading(false);
    }
  };

  // Get all products from backend
  const getAllProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(ProductsPoint.GetAllProducts, {
        params: {
          pageNumber: pagination.currentPage,
          pageSize: pagination.pageSize,
        },
        headers: {
          Authorization: `Bearer ${
            localStorage.getItem("token") || sessionStorage.getItem("token")
          }`,
        },
      });

      const responseData = response.data.Data || response.data.data || [];
      const responsePagination =
        response.data.Pagination || response.data.pagination || {};

      setAllProducts(responseData);
      setFilteredProducts(responseData);
      setOriginalFilteredProducts(responseData); // Store original filtered products

      // Update pagination state with proper field mapping
      setPagination((prev) => {
        const totalCount =
          responsePagination.TotalCount || responsePagination.totalCount || 0;
        const totalPages =
          responsePagination.TotalPages || responsePagination.totalPages || 1;
        const currentPage =
          responsePagination.CurrentPage || responsePagination.currentPage || 1;

        // Calculate hasNext and hasPrevious if not provided by backend
        const hasNext =
          responsePagination.HasNext !== undefined
            ? responsePagination.HasNext
            : responsePagination.hasNext !== undefined
            ? responsePagination.hasNext
            : currentPage < totalPages;

        const hasPrevious =
          responsePagination.HasPrevious !== undefined
            ? responsePagination.HasPrevious
            : responsePagination.hasPrevious !== undefined
            ? responsePagination.hasPrevious
            : currentPage > 1;

        return {
          ...prev,
          totalCount,
          totalPages,
          hasNext,
          hasPrevious,
          currentPage,
        };
      });
    } catch (error) {
      console.error("Error fetching products:", error);
      if (
        axios.isAxiosError(error) &&
        error.response &&
        error.response.data &&
        error.response.data.Error
      ) {
        toast.error(error.response.data.Error);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("حدث خطأ في جلب المنتجات");
      }
    } finally {
      setLoading(false);
    }
  };


  // Get filtered products from backend
  const getFilteredProducts = async () => {
    setLoading(true);
    try {
      const filterParams: any = {};

      if (filters.categoryId)
        filterParams.CategoryId = parseInt(filters.categoryId);
      if (filters.subCategoryId)
        filterParams.SubCategoryId = parseInt(filters.subCategoryId);
      if (filters.hasDiscount !== "")
        filterParams.HasDiscount = filters.hasDiscount === "true";
      if (debouncedPrice.min)
        filterParams.MinPrice = parseFloat(debouncedPrice.min);
      if (debouncedPrice.max)
        filterParams.MaxPrice = parseFloat(debouncedPrice.max);
      if (filters.feedbackScore)
        filterParams.FeedbackScore = parseInt(filters.feedbackScore);

      const response = await axios.get(ProductsPoint.ProductFilter, {
        params: filterParams,
        headers: {
          Authorization: `Bearer ${
            localStorage.getItem("token") || sessionStorage.getItem("token")
          }`,
        },
      });

      const responseData = response.data.Data || response.data.data || [];
      const responsePagination =
        response.data.Pagination || response.data.pagination || {};

      setAllProducts(responseData);
      setFilteredProducts(responseData);
      setOriginalFilteredProducts(responseData); // Store original filtered products

      // Update pagination state with proper field mapping
      setPagination((prev) => {
        const totalCount =
          responsePagination.TotalCount || responsePagination.totalCount || 0;
        const totalPages =
          responsePagination.TotalPages || responsePagination.totalPages || 1;
        const currentPage =
          responsePagination.CurrentPage || responsePagination.currentPage || 1;

        // Calculate hasNext and hasPrevious if not provided by backend
        const hasNext =
          responsePagination.HasNext !== undefined
            ? responsePagination.HasNext
            : responsePagination.hasNext !== undefined
            ? responsePagination.hasNext
            : currentPage < totalPages;

        const hasPrevious =
          responsePagination.HasPrevious !== undefined
            ? responsePagination.HasPrevious
            : responsePagination.hasPrevious !== undefined
            ? responsePagination.hasPrevious
            : currentPage > 1;

        return {
          ...prev,
          totalCount,
          totalPages,
          hasNext,
          hasPrevious,
          currentPage,
        };
      });
    } catch (error) {
      console.error("Error fetching filtered products:", error);
      console.error("Error details:", {
        message: error instanceof Error ? error.message : "Unknown error",
        response: axios.isAxiosError(error) ? error.response?.data : null,
        status: axios.isAxiosError(error) ? error.response?.status : null,
      });

      if (
        axios.isAxiosError(error) &&
        error.response &&
        error.response.data &&
        error.response.data.Error
      ) {
        toast.error(error.response.data.Error);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("حدث خطأ في جلب المنتجات المفلترة");
      }
    } finally {
      setLoading(false);
    }
  };
  const [searchTerm, setSearchTerm] = useState("");
  // unified search function
  const getSearchedProducts = (products: Product[]) => {
    if (!searchTerm.trim()) return products;
    return products.filter(
      (product) =>
        product.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.Description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Helper function to get subcategory name
  const getSubCategoryName = (subCategoryId: number) => {
    const subCategory = subCategories.find((sub) => sub.Id === subCategoryId);
    return subCategory ? subCategory.Name : "غير محدد";
  };

  // Helper function to get stock status
  const getStockStatus = (quantity: number) => {
    if (quantity === 0) {
      return { status: "outOfStock", text: "نفذ المخزون" };
    } else if (quantity <= 10) {
      return { status: "lowStock", text: "مخزون منخفض" };
    } else {
      return { status: "inStock", text: "متوفر" };
    }
  };

  // Helper function to format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ar-EG", {
      style: "currency",
      currency: "EGP",
    }).format(price);
  };

  // متغير العرض النهائي
  const displayedProducts = useMemo(() => {
    // لو فيه فلاتر نشطة، ابحث في originalFilteredProducts، وإلا ابحث في allProducts
    const hasActiveFilters = Object.values(filters).some(
      (value) => value !== ""
    );
    let baseProducts = hasActiveFilters
      ? originalFilteredProducts
      : allProducts;

    // Apply frontend subcategory filter if no backend filters are active
    if (!hasActiveFilters && filters.subCategoryId) {
      baseProducts = baseProducts.filter(
        (product) => product.SubCategoryId === parseInt(filters.subCategoryId)
      );
    }

    const result = getSearchedProducts(baseProducts);

    return result;
  }, [originalFilteredProducts, allProducts, searchTerm, filters]);

  // Remove old search logic - now using displayedProducts directly

  // Handle search with debounce
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
  };

  // Handle filter changes
  const handleFilterChange = (filterName: string, value: string) => {
    setFilters((prev) => {
      const newFilters = { ...prev, [filterName]: value };

      // Clear subcategory when category changes
      if (filterName === "categoryId") {
        newFilters.subCategoryId = "";
      }

      return newFilters;
    });
  };

  // Reset all filters and search
  const resetFilters = () => {
    setFilters({
      categoryId: "",
      subCategoryId: "",
      hasDiscount: "",
      minPrice: "",
      maxPrice: "",
      feedbackScore: "",
    });
    setSearchTerm("");
    setOriginalFilteredProducts([]); // Clear original filtered products
    getAllProducts(); // Get all products when resetting
  };

  // Check if any filter is active
  const hasActiveFilters = useMemo(() => {
    return (
      Object.values(filters).some((value) => value !== "") ||
      searchTerm.trim() !== ""
    );
  }, [filters, searchTerm]);

  // Close popup
  const closePopup = () => {
    setShowDeletePopup(false);
    setSelectedProduct(null);
  };

  // Delete product API call
  const deleteProduct = async () => {
    if (!selectedProduct) return;

    try {
      await axios.delete(ProductsPoint.Delete(selectedProduct.Id), {
        headers: {
          Authorization: `Bearer ${
            localStorage.getItem("token") || sessionStorage.getItem("token")
          }`,
        },
      });
      setAllProducts((prev) => prev.filter((p) => p.Id !== selectedProduct.Id));
      setFilteredProducts((prev) =>
        prev.filter((p) => p.Id !== selectedProduct.Id)
      );
      toast.success("تم حذف المنتج بنجاح");
      setShowDeletePopup(false);
    } catch (error) {
      toast.error("حدث خطأ أثناء حذف المنتج");
      setShowDeletePopup(false);
    } finally {
      closePopup();
    }
  };

  const togglePopular = async (productId: number) => {
    const isCurrentlyPopular = isProductPopular(productId);

    try {
      const endpoint = isCurrentlyPopular
        ? ProductsPoint.MarkNotPopular(productId)
        : ProductsPoint.MarkPopular(productId);

      await axios.put(
        endpoint,
        { productId },
        {
          headers: {
            Authorization: `Bearer ${
              localStorage.getItem("token") || sessionStorage.getItem("token")
            }`,
          },
        }
      );

      // تحديث قائمة المنتجات الشائعة
      if (isCurrentlyPopular) {
        setPopularProductIds((prev) => prev.filter((id) => id !== productId));
      } else {
        setPopularProductIds((prev) => [...prev, productId]);
      }

      toast.success(
        isCurrentlyPopular
          ? "تم إزالة المنتج من المنتجات الشائعة"
          : "تم إضافة المنتج للمنتجات الشائعة"
      );
    } catch (error) {
      toast.error("حدث خطأ أثناء تحديث حالة المنتج");
    }
  };

  // Add this effect to close dropdown on outside click
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

  // Debounce effect for price filter
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedPrice({
        min: filters.minPrice,
        max: filters.maxPrice,
      });
    }, 1000);
    return () => clearTimeout(handler);
  }, [filters.minPrice, filters.maxPrice]);

  // Effect to get filtered products when debounced price changes
  useEffect(() => {
    // Only run if at least one price filter is set
    if (debouncedPrice.min !== "" || debouncedPrice.max !== "") {
      getFilteredProducts();
    }
    // eslint-disable-next-line
  }, [debouncedPrice.min, debouncedPrice.max]);

  // Effect to get products when filters (except price) change
  useEffect(() => {
    // Exclude minPrice and maxPrice from this effect
    const { minPrice, maxPrice, ...otherFilters } = filters;
    const hasActiveFilters = Object.values(otherFilters).some(
      (value) => value !== ""
    );
    if (hasActiveFilters) {
      getFilteredProducts();
    } else {
      getAllProducts();
    }
    // eslint-disable-next-line
  }, [filters.categoryId, filters.subCategoryId, filters.hasDiscount, filters.feedbackScore]);

  // Effect to get products when page changes
  useEffect(() => {
    // Only change page if no filters are active
    const hasActiveFilters = Object.values(filters).some(
      (value) => value !== ""
    );
    if (!hasActiveFilters) {
      getAllProducts();
    }
  }, [pagination.currentPage]);

  // Effect to get initial data
  useEffect(() => {
    getAllProducts();
    getCategoryName();
    getPopularProductIds(); // جلب قائمة المنتجات الشائعة عند التحميل
  }, []);

  // Effect to get subcategories after categories are loaded
  useEffect(() => {
    if (categoryName.length > 0) {
      getAllSubCategories();
    }
  }, [categoryName]);

 
  return (
    <>
      {loading ? (
        <motion.div
          className={Style.productsContainer}
          dir="rtl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* شيمر الهيدر */}
          <div className={Style.productsHeader} style={{ marginBottom: 24 }}>
            <ShimmerPostItem hasImage={false} title cta />
          </div>
          {/* شيمر شريط الأدوات */}
          <div
            className={Style.productsActionsRow}
            style={{ marginBottom: 16 }}
          >
            <ShimmerSimpleGallery row={1} col={2}  />
          </div>
          {/* شيمر صف الفلاتر */}
          <div
            className={Style.productsFiltersRow}
            style={{ marginBottom: 16 }}
          >
            <ShimmerSimpleGallery row={1} col={5}  />
          </div>
          {/* شيمر جدول المنتجات */}
          <div className={Style.productsTableWrapper}>
            <ShimmerTable row={6} col={8} />
          </div>
          {/* شيمر الباجينيشن */}
          <div
            className={Style.productsPaginationRow}
            style={{ marginTop: 24 }}
          >
            <div
              style={{
                width: 80,
                height: 36,
                borderRadius: 8,
                background: "#e0e0e0",
                display: "inline-block",
                margin: "0 8px",
              }}
            />
            <div
              style={{
                width: 60,
                height: 36,
                borderRadius: 8,
                background: "#e0e0e0",
                display: "inline-block",
                margin: "0 8px",
              }}
            />
            <div
              style={{
                width: 80,
                height: 36,
                borderRadius: 8,
                background: "#e0e0e0",
                display: "inline-block",
                margin: "0 8px",
              }}
            />
          </div>
        </motion.div>
      ) : (
        <motion.div
          className={Style.productsContainer}
          dir="rtl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className={Style.productsHeader}>
            <div>
              <h3>المنتجات</h3>
              <h6>تستطيع أن تفحص كل منتجاتك</h6>
            </div>
            <div className={Style.productsActionsRow}>
             
             <div className={Style.mainActionNav}>
             <button onClick={() => navigate("/admin/add-product")}>
                <FontAwesomeIcon icon={faPlus} />
                إضافة منتج
              </button>{" "}
              <button onClick={() => navigate("/admin/add-categore")}>
                <FontAwesomeIcon icon={faPlus} />
                إضافة فئة
              </button>
             </div>
              <div className={Style.menuWrapper}>
                <button
                  className={Style.menuIcon}
                  onClick={() => setDropdownMenu(!dropdownMenu)}
                >
                  <FontAwesomeIcon icon={faBars} />
                </button>
                {dropdownMenu && (
                  <ul className={Style.menuDropdown}>
                    <li>
                      <button
                        onClick={() => {
                          navigate("/admin/categore-list");
                          setDropdownMenu(false);
                        }}
                      >
                        <FontAwesomeIcon icon={faList} />
                        عرض الفئات
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          navigate("/admin/product-popular");
                          setDropdownMenu(false);
                        }}
                      >
                        <FontAwesomeIcon icon={faHeart} />
                        عرض المنتجات المميزة
                      </button>
                    </li>
                  </ul>
                )}
              </div>
            </div>
          </div>
          {/* زر التصفية يظهر فقط في الشاشات الصغيرة */}
          <div className={Style.filterButtonWrapper}>
            <button
              className={Style.filterButton}
              onClick={() => setShowFilterModal(true)}
            >
              <FontAwesomeIcon icon={faFilter} /> التصفية
            </button>
            {/* <button
              className={Style.filterButton}
              onClick={() => setShowFilterModal(true)}
            >
              <FontAwesomeIcon icon={faSearch} /> البحث
            </button> */}
          </div>

          {/* صف الفلاتر يظهر فقط في الشاشات الكبيرة */}
          <div className={Style.productsFiltersRow}>
            <div className={Style.productsFiltersCol}>
              <select
                value={filters.categoryId}
                onChange={(e) =>
                  handleFilterChange("categoryId", e.target.value)
                }
              >
                <option value="">اختر الفئة</option>
                {categoryName.map((category) => (
                  <option key={category.Id} value={category.Id}>
                    {category.Name}
                  </option>
                ))}
              </select>
              <select
                value={filters.subCategoryId}
                onChange={(e) =>
                  handleFilterChange("subCategoryId", e.target.value)
                }
                disabled={subCategoriesLoading}
              >
                <option value="">
                  {subCategoriesLoading
                    ? "جاري التحميل..."
                    : "اختر الفئة الفرعية"}
                </option>
                {!subCategoriesLoading &&
                  (filters.categoryId
                    ? subCategories
                        .filter(
                          (sub) =>
                            sub.categoryId === parseInt(filters.categoryId)
                        )
                        .map((subCategory) => (
                          <option key={subCategory.Id} value={subCategory.Id}>
                            {subCategory.Name}
                          </option>
                        ))
                    : subCategories.map((subCategory) => (
                        <option key={subCategory.Id} value={subCategory.Id}>
                          {subCategory.Name}
                        </option>
                      )))}
              </select>
              <select
                value={filters.hasDiscount}
                onChange={(e) =>
                  handleFilterChange("hasDiscount", e.target.value)
                }
              >
                <option value="">الكل</option>
                <option value="true">خصم</option>
                <option value="false">بدون خصم</option>
              </select>
              <input
                type="number"
                placeholder="السعر من"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange("minPrice", e.target.value)}
              />
              <input
                type="number"
                placeholder="السعر إلى"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
              />
            </div>
            <div className={Style.productsSearchCol}>
              <div className={Style.searchInputWrapper}>
                <input
                  className={Style.searchInput}
                  type="text"
                  aria-label="Search"
                  placeholder="ابحث هنا ..."
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <FontAwesomeIcon icon={faSearch} className={Style.searchIcon} />
              </div>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  title="إعادة تعيين الفلاتر"
                  className={Style.resetFilterIcon}
                >
                  <FontAwesomeIcon icon={faXmark} />
                </button>
              )}
            </div>
          </div>
          <div className={Style.productsResultsCount}>
            <small>
              عدد النتائج: {displayedProducts.length} منتج
              {hasActiveFilters && (
                <span>
                  (من أصل{" "}
                  {hasActiveFilters
                    ? originalFilteredProducts.length
                    : allProducts.length}{" "}
                  منتج)
                </span>
              )}
            </small>
          </div>
          <div className={Style.productsTableWrapper}>
            <table className={Style.productsTable}>
              <thead>
                <tr>
                  <th>الاسم</th>
                  <th>الصوره</th>
                  <th>السعر قبل الخصم</th>
                  <th>السعر بعد الخصم</th>
                  <th>الكمية المتاحة</th>
                  <th>الفئة</th>
                  <th>الفئة الفرعية</th>
                  <th>خيارات</th>
                </tr>
              </thead>
              <tbody>
                {displayedProducts.map((product) => {
                  const stockStatus = getStockStatus(product.StockQuantity);
                  return (
                    <tr key={product.Id}>
                      <td>{product.Name}</td>
                      <td>
                        <img
                          src={
                            product.ImageUrl === null
                              ? "notfound"
                              : `${ImgURLBeasd}/${product.ImageUrl}`
                          }
                          alt={product.Name}
                        />
                      </td>
                      <td>{formatPrice(product.Price)}</td>
                      <td>
                        {formatPrice(product.DiscountedPrice || product.Price)}
                      </td>
                      <td>
                        <div
                          className={`${Style.stockStatus} ${
                            Style[stockStatus.status]
                          }`}
                        >
                          {stockStatus.text}
                        </div>
                      </td>
                      <td>
                        {categoryName.map((category) => {
                          if (category.Id == product.CategoryId) {
                            return category.Name;
                          }
                          return null;
                        })}
                      </td>
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
                              <li className="text-center ">
                                <button
                                  className="dropdown-item"
                                  onClick={() => {
                                    setDropdown(null);
                                    togglePopular(product.Id);
                                  }}
                                >
                                  <FontAwesomeIcon
                                    icon={
                                      isProductPopular(product.Id)
                                        ? faHeart
                                        : faHeartBroken
                                    }
                                    style={{
                                      color: isProductPopular(product.Id)
                                        ? "red"
                                        : "wheat",
                                    }}
                                  />
                                </button>
                              </li>
                              <li className="text-center ">
                                <button className="dropdown-item">
                                  <Link
                                    style={{ color: "green" }}
                                    onClick={() => {
                                      setDropdown(null);
                                    }}
                                    to={`/admin/product-view/${product.Id}`}
                                    state={{ data: product.Id }}
                                  >
                                    <FontAwesomeIcon icon={faEye} />
                                  </Link>
                                </button>
                              </li>
                              <li className="text-center">
                                <button className="dropdown-item ">
                                  <Link
                                    style={{ color: "yellowgreen" }}
                                    onClick={() => {
                                      setDropdown(null);
                                    }}
                                    to={`/admin/add-product/${product.Id}`}
                                    state={{ data: product.Id, method: "Edit" }}
                                  >
                                    <FontAwesomeIcon icon={faPenToSquare} />{" "}
                                  </Link>
                                </button>
                              </li>
                              <li className="text-center ">
                                <button
                                  className="dropdown-item text-danger"
                                  onClick={() => {
                                    setSelectedProduct(product);
                                    setShowDeletePopup(true);
                                    setDropdown(null);
                                  }}
                                >
                                  <FontAwesomeIcon icon={faTrash} />{" "}
                                </button>
                              </li>
                            </ul>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Pagination */}
      {displayedProducts.length > 0 && (
        <div className="d-flex justify-content-center align-items-center" style={{ marginTop: ".5rem", marginBottom: "1rem" }}>
          <Stack spacing={2}>
            <Pagination count={pagination.totalPages} variant="outlined" shape="rounded" onChange={(e,value)=>setPagination((prev)=>({...prev,currentPage:value}))} />
          </Stack>
        </div>
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

      {/* المودال */}
      {showFilterModal && (
        <div className={Style.filterModalOverlay}>
          <div className={Style.filterModalBox}>
            <div className={Style.filterModalHeader}>
              <span>التصفية</span>
              <button
                className={Style.closeModalBtn}
                onClick={() => setShowFilterModal(false)}
              >
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
                    onChange={handleSearch}
                  />
                  <FontAwesomeIcon
                    icon={faSearch}
                    className={Style.searchIcon}
                  />
                </div>
              </div>

              {/* الفلاتر */}
              <div className={Style.productsFiltersCol}>
                <select
                  value={filters.categoryId}
                  onChange={(e) =>
                    handleFilterChange("categoryId", e.target.value)
                  }
                >
                  <option value="">اختر الفئة</option>
                  {categoryName.map((category) => (
                    <option key={category.Id} value={category.Id}>
                      {category.Name}
                    </option>
                  ))}
                </select>
                <select
                  value={filters.subCategoryId}
                  onChange={(e) =>
                    handleFilterChange("subCategoryId", e.target.value)
                  }
                  disabled={subCategoriesLoading}
                >
                  <option value="">
                    {subCategoriesLoading
                      ? "جاري التحميل..."
                      : "اختر الفئة الفرعية"}
                  </option>
                  {!subCategoriesLoading &&
                    (filters.categoryId
                      ? subCategories
                          .filter(
                            (sub) =>
                              sub.categoryId === parseInt(filters.categoryId)
                          )
                          .map((subCategory) => (
                            <option key={subCategory.Id} value={subCategory.Id}>
                              {subCategory.Name}
                            </option>
                          ))
                      : subCategories.map((subCategory) => (
                          <option key={subCategory.Id} value={subCategory.Id}>
                            {subCategory.Name}
                          </option>
                        )))}
                </select>
                <select
                  value={filters.hasDiscount}
                  onChange={(e) =>
                    handleFilterChange("hasDiscount", e.target.value)
                  }
                >
                  <option value="">الكل</option>
                  <option value="true">خصم</option>
                  <option value="false">بدون خصم</option>
                </select>
                <input
                  type="number"
                  placeholder="السعر من"
                  value={filters.minPrice}
                  onChange={(e) =>
                    handleFilterChange("minPrice", e.target.value)
                  }
                />
                <input
                  type="number"
                  placeholder="السعر إلى"
                  value={filters.maxPrice}
                  onChange={(e) =>
                    handleFilterChange("maxPrice", e.target.value)
                  }
                />
              </div>
              <div className={Style.filterModalFooter}>
                <button
                  className={Style.applyFilterBtn}
                  onClick={() => setShowFilterModal(false)}
                >
                  تطبيق
                </button>
                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    title="إعادة تعيين الفلاتر"
                    className={Style.resetFilterIcon}
                  >
                    <FontAwesomeIcon icon={faXmark} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ProductsList;
