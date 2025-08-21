import React, { useEffect, useState } from "react";
import Style from "../Style.module.css";
import icon1 from "../svg/caticon1.svg";
import icon2 from "../svg/caticon2.svg";
import icon3 from "../svg/caticon3.svg";
import icon4 from "../svg/caticon4.svg";
import icon5 from "../svg/img_1.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CategoryPoint } from "../../../../constant/Const";
import { motion, AnimatePresence } from "framer-motion";
interface Category {
  Id: number;
  Name: string;
  SubCategories: SubCategory[];
}
interface SubCategory {
  Id: number;
  Name: string;
}

export default function Categoris() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const navigate = useNavigate();

  // التنقل التلقائي بين الفئات
  useEffect(() => {
    if (categories.length <= 1 || isPaused) return; // لا حاجة للتنقل إذا كانت فئة واحدة فقط أو متوقف مؤقتاً

    const interval = setInterval(() => {
      setActiveIdx((prevIdx) => (prevIdx + 1) % categories.length);
    }, 10000); // كل 3 ثوانٍ

    return () => clearInterval(interval);
  }, [categories.length, isPaused]);

  const getAllCategories = async ({
    pageNumber,
    pageSize,
  }: {
    pageNumber: number;
    pageSize: number;
  }) => {
    try {
      setLoading(true);
      const response = await axios.get(CategoryPoint.GetAllCategories, {
        params: { pageNumber, pageSize },
      });
      setCategories(response.data || []);
      setActiveIdx(0);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllCategories({ pageNumber: 1, pageSize: 100 });
  }, []);

  const getCategoryImage = (name: string) => categoryImages[name];
  const getSubCategoryImage = (name: string) => subCategoryImages[name];

  // دالة للتنقل للفئة
  const goToCategory = (
    category: any,
    isMainCategory: boolean,
    parentCategory?: any
  ) => {
    if (isMainCategory) {
      // فئة رئيسية
      navigate(`/store?categoryId=${category.Id}`);
    } else {
      // فئة فرعية - نحتاج معرف الفئة الرئيسية أيضاً
      navigate(
        `/store?categoryId=${parentCategory.Id}&subCategoryId=${category.Id}`
      );
    }
    window.scrollTo(0, 0);
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "200px" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!categories.length) return null;

  const activeCategory = categories[Math.min(activeIdx, categories.length - 1)];
  const subCats = activeCategory?.SubCategories || [];

  // صور الفئات الرئيسية
  const categoryImages: Record<string, string> = {
    "أسمده زراعية": icon1,
    بذور: icon5,
    "مبيدات زراعية": icon3,
  };

  // صور الفئات الفرعية (يمكنك تعديلها بحرية)
  const subCategoryImages: Record<string, string> = {
    "مبيدات حشرية ": icon3,
    "مبيدات فطرية": icon1,
    مغزيات: icon2,
    معلقات: icon4,
  };
  return (
    <>
      <div className={Style.captioncateg}>
        <h1 className="text-center">فئات منتجاتنا</h1>
        <p className="text-center">
          اختر الفئة المطلوبة أو أحد الفئات الفرعية المرتبطة بها
        </p>
      </div>

      <div
        className="d-flex flex-column flex-lg-row align-items-stretch gap-3"
        style={{ width: "95%", margin: "30px auto" }}
        onMouseEnter={() => setIsPaused(true)} // إيقاف التنقل عند وضع الماوس
        onMouseLeave={() => setIsPaused(false)} // إعادة التنقل عند إزالة الماوس
      >
        {/* القسم الأيسر: شبكة الفئات الفرعية */}
        <div
          className="flex-grow-1 order-2 order-lg-1"
          style={{ minWidth: 260 }}
        >
          <div
            className="d-grid"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: "16px",
            }}
          >
            <AnimatePresence mode="wait">
              {subCats.slice(0, 4).map((sc, index) => (
                <motion.button
                  key={`${activeCategory.Id}-${sc.Id}`}
                  className="bg-white border-0 shadow-sm rounded-3 p-3 text-center"
                  style={{ cursor: "pointer" }}
                  onClick={() => goToCategory(sc, false, activeCategory)}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.9 }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.1,
                    ease: "easeOut",
                  }}
                  whileHover={{
                    scale: 1.05,
                    background:
                      "linear-gradient(180deg, rgba(16, 181, 65, 0.06), rgba(69, 197, 107, 0.02))",
                    boxShadow: "0 4px 12px rgba(0, 238, 72, 0.15)",
                    transition: { duration: 0.2 },
                  }}
                >
                  <div
                    className="d-flex align-items-center justify-content-center mb-2"
                    style={{ height: 60 }}
                  >
                    {sc?.Name && (
                      <img
                        src={getSubCategoryImage(sc?.Name)}
                        alt={sc?.Name}
                        style={{
                          maxWidth: 40,
                          maxHeight: 40,
                          objectFit: "contain",
                        }}
                      />
                    )}
                  </div>
                  <div style={{ fontWeight: 600, color: "#333" }}>
                    {sc.Name}
                  </div>
                </motion.button>
              ))}
              {/* في حالة عدم وجود فئات فرعية */}
              {!subCats.length && (
                <motion.div
                  className="bg-white rounded-3 p-4 d-flex align-items-center justify-content-center shadow-sm"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                >
                  لا توجد فئات فرعية
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* نقاط التنقل بين الفئات الرئيسية */}
          <div className="d-flex gap-2 justify-content-center mt-3">
            {categories.map((_, idx) => (
              <motion.button
                key={idx}
                aria-label={`category-${idx + 1}`}
                onClick={() => {
                  setActiveIdx(idx);
                  setIsPaused(true); // إيقاف التنقل التلقائي عند الضغط على النقطة
                  // إعادة تشغيل التنقل التلقائي بعد 5 ثوانٍ
                  setTimeout(() => setIsPaused(false), 5000);
                }}
                className="p-0 border-0"
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 999,
                  background: idx === activeIdx ? "#018f2c" : "#cfd8dc",
                }}
                whileHover={{
                  scale: 1.3,
                  transition: { duration: 0.2 },
                }}
                whileTap={{ scale: 0.8 }}
                animate={{
                  scale: idx === activeIdx ? 1.2 : 1,
                  background: idx === activeIdx ? "#018f2c" : "#cfd8dc",
                }}
                transition={{
                  duration: 0.3,
                  ease: "easeOut",
                }}
              />
            ))}
          </div>
        </div>

        {/* القسم الأيمن: بطاقة الفئة الرئيسية */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory.Id}
            className={`bg-white shadow rounded-4 d-flex flex-column justify-content-between order-1 order-lg-2`}
            style={{
              minWidth: 280,
              padding: 16,
              background:
                "linear-gradient(180deg, rgba(16, 181, 65, 0.06), rgba(69, 197, 107, 0.02))",
            }}
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -50, scale: 0.95 }}
            transition={{
              duration: 0.5,
              ease: "easeOut",
              type: "spring",
              stiffness: 100,
            }}
            whileHover={{
              scale: 1.02,
              boxShadow: "0 8px 25px rgba(1,143,44,0.1)",
              transition: { duration: 0.3 },
            }}
          >
            <div className="d-flex align-items-center gap-3">
              <motion.div
                className="rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: 54, height: 54, background: "#e8f5e9" }}
                initial={{ rotate: -180, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{
                  duration: 0.6,
                  delay: 0.2,
                  type: "spring",
                  stiffness: 200,
                }}
              >
                <img
                  src={getCategoryImage(activeCategory.Name)}
                  alt={activeCategory.Name}
                  style={{ maxWidth: 28, maxHeight: 28, objectFit: "contain" }}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <h5
                  className="m-0"
                  style={{ fontWeight: 800, color: "#0a0a0a" }}
                >
                  {activeCategory.Name}
                </h5>
                <small style={{ color: "#607d8b" }}>
                  {subCats.length
                    ? `${subCats.length} فئات فرعية`
                    : "بدون فئات فرعية"}
                </small>
              </motion.div>
            </div>

            <motion.button
              className="btn btn-success mt-3"
              onClick={() => goToCategory(activeCategory, true)}
              style={{ alignSelf: "flex-start" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 4px 12px rgba(1,143,44,0.2)",
                transition: { duration: 0.2 },
              }}
              whileTap={{ scale: 0.95 }}
            >
              تصفح المنتجات
            </motion.button>
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}
