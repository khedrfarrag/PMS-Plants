import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import styles from "../style/CategoriesList.module.css";
import { CategoryPoint } from "../../../../constant/Const";
import axios from "axios";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsis,
  faEye,
  faPenToSquare,
  faTrash,
  faMagnifyingGlass,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { ShimmerSimpleGallery, ShimmerPostItem, ShimmerTable } from "react-shimmer-effects";

export default function CategoriesList() {
  const navigate = useNavigate();
  
  interface Category {
    Id: number;
    Name: string;
    SubCategories: {
      Id: number;
      Name: string;
    }[];
  }
  
  type datacategory = Category[];
  
  // State management
  const [dropdown, setDropdown] = useState<number | null>(null);
  const [categoryName, setCategoryName] = useState<datacategory>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");

  const getِAllCategories = async (pageNumber = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const response = await axios.get(CategoryPoint.GetAllCategories, {
        params: {
          pageNumber,
          pageSize,
        },
      });
      setCategoryName(response.data.data || response.data);
      setTotalPages(response.data.pagination?.totalPages || 1);
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
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategoryId) return;
    setLoading(true);
    try {
      await axios.delete(CategoryPoint.Delete(selectedCategoryId), {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}`,
        },
      });
      setCategoryName((prev) =>
        prev.filter((cat) => cat.Id !== selectedCategoryId)
      );
      toast.success("تم حذف الفئة بنجاح");
    } catch (error) {
      toast.error("حدث خطأ أثناء حذف الفئة");
    } finally {
      setLoading(false);
      setShowDeletePopup(false);
      setSelectedCategoryId(null);
    }
  };

  // Filter categories based on search term
  const filteredCategories = categoryName.filter((category) =>
    category.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.SubCategories.some((sub) =>
      sub.Name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdown !== null) {
        // Check if click is outside the dropdown toggle button and dropdown menu
        const target = event.target as HTMLElement;
        const dropdownContainer = target.closest(`.${styles.actionsCell}`);
        const dropdownMenu = target.closest(`.${styles.dropdownMenu}`);
        
        // Don't close if clicking inside the dropdown menu or its container
        if (!dropdownContainer && !dropdownMenu) {
          setDropdown(null);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdown]);

  useEffect(() => {
    getِAllCategories(currentPage);
  }, [currentPage]);

  return (
    <>
      {loading ? (
        <motion.div className={styles.container} dir="rtl" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {/* شيمر الهيدر */}
          <div className={styles.header} style={{ marginBottom: 24 }}>
            <ShimmerPostItem hasImage={false} title cta />
          </div>
          {/* شيمر صف الفلاتر */}
          <div className={styles.filtersRow} style={{ marginBottom: 16 }}>
            <ShimmerSimpleGallery row={1} col={3} />
          </div>
          {/* شيمر جدول الفئات */}
          <div className={styles.tableContainer}>
            <ShimmerTable row={6} col={4} />
          </div>
          {/* شيمر الباجينيشن */}
          <div className={styles.paginationContainer} style={{ marginTop: 24 }}>
            <div style={{ width: 80, height: 36, borderRadius: 8, background: '#e0e0e0', display: 'inline-block', margin: '0 8px' }} />
            <div style={{ width: 100, height: 36, borderRadius: 8, background: '#e0e0e0', display: 'inline-block', margin: '0 8px' }} />
            <div style={{ width: 80, height: 36, borderRadius: 8, background: '#e0e0e0', display: 'inline-block', margin: '0 8px' }} />
          </div>
        </motion.div>
      ) : (
        <motion.div
          className={styles.container}
          dir="rtl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.headerContent}>
              <h3>الفئات</h3>
              <h6>تستطيع أن تفحص كل الفئات وإدارتها</h6>
            </div>
            <button
              onClick={() => navigate("/admin/add-categore")}
              className={styles.addButton}
            >
              <FontAwesomeIcon icon={faPlus} style={{ marginLeft: 8 }} />
              إضافة فئة
            </button>
          </div>

          {/* Filters Row */}
          <div className={styles.filtersRow}>
            <select
              className={styles.filterSelect}
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
            >
              <option value="">الكل</option>
              <option value="withSub">مع فئات فرعية</option>
              <option value="withoutSub">بدون فئات فرعية</option>
            </select>
            
            <select
              className={styles.filterSelect}
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
            >
              <option value="">اختر الفئة</option>
              {categoryName.map((category) => (
                <option key={category.Id} value={category.Id}>
                  {category.Name}
                </option>
              ))}
            </select>

            <div className={styles.searchContainer}>
              <FontAwesomeIcon icon={faMagnifyingGlass} className={styles.searchIcon} />
              <input
                type="text"
                className={styles.searchInput}
                placeholder="ابحث في الفئات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Table */}
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead className={styles.tableHeader}>
                <tr>
                  <th>الرقم التعريفي</th>
                  <th>اسم الفئة</th>
                  <th>الفئات الفرعية</th>
                  <th>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((categories) => (
                  <tr key={categories.Id} className={styles.tableRow}>
                    <td className={`${styles.tableCell} ${styles.idCell}`}>
                      #{categories.Id}
                    </td>
                    <td className={`${styles.tableCell} ${styles.nameCell}`}>
                      {categories.Name}
                    </td>
                    <td className={`${styles.tableCell} ${styles.subCategoriesCell}`}>
                      {categories.SubCategories.length > 0 ? (
                        categories.SubCategories.map((subcat) => (
                          <span
                            key={subcat.Id}
                            className={styles.subCategoryBadge}
                          >
                            {subcat.Name}
                          </span>
                        ))
                      ) : (
                        <span style={{ color: '#6c757d', fontStyle: 'italic' }}>
                          لا توجد فئات فرعية
                        </span>
                      )}
                    </td>
                    <td className={`${styles.tableCell} ${styles.actionsCell}`}>
                      <button
                        className={styles.dropdownToggle}
                        onClick={(e) => {
                          e.stopPropagation();
                          setDropdown(dropdown === categories.Id ? null : categories.Id);
                        }}
                      >
                        <FontAwesomeIcon icon={faEllipsis} />
                      </button>
                      
                      {dropdown === categories.Id && (
                        <div className={styles.dropdownMenu}>
                          <Link
                            to={`/admin/add-categore/${categories.Id}`}
                            state={{
                              data: categories,
                              method: "Edit",
                            }}
                            className={styles.dropdownItem}
                            onClick={(e) => {
                              e.stopPropagation();
                              setDropdown(null);
                            }}
                          >
                            <FontAwesomeIcon icon={faPenToSquare} />
                            تعديل
                          </Link>
                          
                          <button
                            className={`${styles.dropdownItem} ${styles.delete}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCategoryId(categories.Id);
                              setShowDeletePopup(true);
                              setDropdown(null);
                            }}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                            حذف
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className={styles.paginationContainer}>
            <button
              className={styles.paginationButton}
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            >
              السابق
            </button>
            
            <span className={styles.paginationInfo}>
              صفحة {currentPage} من {totalPages}
            </span>
            
            <button
              className={styles.paginationButton}
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
            >
              التالي
            </button>
          </div>
        </motion.div>
      )}

      {/* Delete Confirmation Popup */}
      {showDeletePopup && (
        <div className={styles.deletePopupOverlay}>
          <div className={styles.deletePopup}>
            <h5 className={styles.deletePopupTitle}>تأكيد الحذف</h5>
            <p className={styles.deletePopupMessage}>
              هل أنت متأكد أنك تريد حذف هذه الفئة؟ لا يمكن التراجع عن هذا الإجراء.
            </p>
            <div className={styles.deletePopupButtons}>
              <button
                className={`${styles.deleteButton} ${styles.deleteConfirmButton}`}
                onClick={handleDeleteCategory}
                disabled={loading}
              >
                {loading ? "جاري الحذف..." : "حذف"}
              </button>
              <button
                className={`${styles.deleteButton} ${styles.deleteCancelButton}`}
                onClick={() => setShowDeletePopup(false)}
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
