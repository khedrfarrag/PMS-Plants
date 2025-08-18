import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faTimes } from "@fortawesome/free-solid-svg-icons";
import Style from "../style/style.module.css";
interface Category {
  Id: number;
  Name: string;
  SubCategories?: any[];
}
type SidebarFillterProps = {
  show?: boolean;
  onClose?: () => void;
  isMobile?: boolean;
  categories?: Category[];
  onFilterChange?: (filters: any) => void;
  onSearchName?: (searchName: string) => void;
  selectedCategoryId: number | undefined;
  setSelectedCategoryId: (id: number | undefined) => void;
  selectedSubCategoryId: number | null;
  setSelectedSubCategoryId: (id: number | null) => void;
  hasDiscount: boolean | undefined;
  setHasDiscount: (value: boolean | undefined) => void;
  minPrice: number | undefined;
  setMinPrice: (value: number | undefined) => void;
  maxPrice: number | undefined;
  setMaxPrice: (value: number | undefined) => void;
  feedbackScore: number | undefined;
  setFeedbackScore: (value: number | undefined) => void;
  feedbackScoreTo: number | undefined;
  setFeedbackScoreTo: (value: number | undefined) => void;
};
export default function SidebarFillter({
  show = true,
  onClose = () => {},
  isMobile = false,
  categories = [],
  onFilterChange = () => {},
  onSearchName = () => {},
  selectedCategoryId,
  setSelectedCategoryId,
  selectedSubCategoryId,
  setSelectedSubCategoryId,
  hasDiscount,
  setHasDiscount,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  feedbackScore,
  setFeedbackScore,
  feedbackScoreTo,
  setFeedbackScoreTo,
}: SidebarFillterProps) {
  // State for search input
  console.log('categories', categories);
  const [searchName, setSearchName] = useState("");
  console.log("searchName", searchName);
  const [showCategories, setShowCategories] = useState(true);
  // احذف useState للفلاتر واستخدم props بدلاً منها
  console.log("subcategories", selectedSubCategoryId);
  console.log('selectedCategoryId', selectedCategoryId);
  // عند تغيير الفئة
  const handleCategoryChange = (id: number) => {
    setSelectedCategoryId(id);
    setSelectedSubCategoryId(null);
    onFilterChange({
      CategoryId: id,
      SubCategoryId: undefined,
      HasDiscount: hasDiscount,
      MinPrice: minPrice,
      MaxPrice: maxPrice,
      FeedbackScore: feedbackScore,
    });
  };
  // عند تغيير الفئة الفرعية
  const handleSubCategoryChange = (categoryId: number, subId: number) => {
    setSelectedCategoryId(categoryId);
    setSelectedSubCategoryId(subId);
    onFilterChange({
      CategoryId: categoryId,
      SubCategoryId: subId,
      HasDiscount: hasDiscount,
      MinPrice: minPrice,
      MaxPrice: maxPrice,
      FeedbackScore: feedbackScore,
    });
  };
  // إعادة الضبط
  const handleReset = () => {
    setSelectedCategoryId(undefined);
    setSelectedSubCategoryId(null);
    setHasDiscount(undefined);
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setFeedbackScore(undefined);
    setFeedbackScoreTo(undefined);
    onFilterChange({
      CategoryId: undefined,
      SubCategoryId: undefined,
      HasDiscount: undefined,
      MinPrice: undefined,
      MaxPrice: undefined,
      FeedbackScore: undefined,
    });
  };

  // تطبيق الفلاتر
  const handleApplyFilters = () => {
    onFilterChange({
      CategoryId: selectedCategoryId,
      SubCategoryId: selectedSubCategoryId,
      HasDiscount: hasDiscount,
      MinPrice: minPrice,
      MaxPrice: maxPrice,
      FeedbackScore: feedbackScore,
      FeedbackScoreTo: feedbackScoreTo,
    });
  };

  return (
    <div
      className={`${Style.sidebarFilterCustom} ${
        show ? Style.show : Style.hide
      } ${isMobile ? Style.mobileSidebar : Style.desktopSidebar}`}
    >
      {isMobile && (
        <button className={Style.sidebarCloseBtn} onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
      )}
      <div className={Style.clearfix} />
      {/* قسم الفئات مع إمكانية الطي */}
      <div
        className={Style.sidebarSectionHeader}
        onClick={() => setShowCategories((prev) => !prev)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        <span className={Style.sidebarSectionTitle}>الفئات</span>
        <span
          className={Style.sidebarSectionArrow}
          style={{
            transition: "transform 0.2s",
            transform: showCategories ? "rotate(0deg)" : "rotate(-90deg)",
          }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7 10l5 5 5-5"
              stroke="#222"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
      {showCategories && (
        <div className={Style.sidebarSection} style={{ marginTop: 0 }}>
          <div
            className={Style.sidebarSection}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "10px",
            }}
          >
            <input
              type="text"
              className={Style.sidebarPriceInput}
              placeholder="ابحث باسم المنتج..."
              style={{
                flex: 1,
                borderRadius: "6px",
                border: "1px solid #ddd",
                padding: "7px 10px",
                fontSize: "1em",
              }}
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onSearchName(searchName);
                }
              }}
            />
            <button
              style={{
                background: "#009247",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                padding: "7px 16px",
                display: "flex",
                alignItems: "center",
                gap: "5px",
                fontWeight: 500,
                fontSize: "1em",
                cursor: "pointer",
              }}
              onClick={() => onSearchName(searchName)}
            >
              ابحث...
            </button>
          </div>
          <div className={Style.sidebarCategoryRadios}>
            {categories.map((cat) => (
              <React.Fragment key={cat.Id}>
                <label className={Style.sidebarCategoryRadioLabel}>
                  <input
                    type="radio"
                    name="category"
                    className={Style.sidebarCategoryRadio}
                    checked={selectedCategoryId === cat.Id}
                    onChange={() => handleCategoryChange(cat.Id)}
                  />
                  <span className={Style.sidebarCategoryRadioCustom}></span>
                  {cat?.Name}
                </label>
                {/* عرض الفئات الفرعية مباشرة تحت الفئة المختارة فقط */}
                {selectedCategoryId === cat.Id &&
                  cat.SubCategories &&
                  cat.SubCategories.length > 0 && (
                    <div
                      className={Style.sidebarSubCategoryRadios}
                      style={{ margin: "10px 0 0 0", paddingRight: "10px" }}
                    >
                      {cat.SubCategories.map((sub: any) => (
                        <label
                          className={Style.sidebarCategoryRadioLabel}
                          key={sub.Id}
                          style={{ fontWeight: 400, fontSize: "0.95em" }}
                        >
                          <input
                            type="radio"
                            name="subcategory"
                            className={Style.sidebarCategoryRadio}
                            checked={selectedSubCategoryId === sub.Id}
                            onChange={() =>
                              handleSubCategoryChange(cat.Id, sub.Id)
                            }
                          />
                          <span
                            className={Style.sidebarCategoryRadioCustom}
                          ></span>
                          {sub.Name}
                        </label>
                      ))}
                    </div>
                  )}
              </React.Fragment>
            ))}
          </div>
          
        </div>
      )}

      {/* مدى السعر */}
      <div className={Style.sidebarSection}>
        <strong className={Style.sidebarSectionTitle}>مدى السعر</strong>
        <div className={Style.sidebarDiscountRadios}>
          <label className={Style.sidebarCategoryRadioLabel}>
            <input
              type="radio"
              name="discount"
              className={Style.sidebarCategoryRadio}
              checked={hasDiscount === undefined}
              onChange={() => setHasDiscount(undefined)}
            />
            <span className={Style.sidebarCategoryRadioCustom}></span>
            الكل
          </label>
          <label className={Style.sidebarCategoryRadioLabel}>
            <input
              type="radio"
              name="discount"
              className={Style.sidebarCategoryRadio}
              checked={hasDiscount === true}
              onChange={() => setHasDiscount(true)}
            />
            <span className={Style.sidebarCategoryRadioCustom}></span>
            بخصم
          </label>
          <label className={Style.sidebarCategoryRadioLabel}>
            <input
              type="radio"
              name="discount"
              className={Style.sidebarCategoryRadio}
              checked={hasDiscount === false}
              onChange={() => setHasDiscount(false)}
            />
            <span className={Style.sidebarCategoryRadioCustom}></span>
            بدون خصم
          </label>
        </div>
        <div className={Style.sidebarPriceRange}>
          <span className={Style.sidebarPriceLabel}>من</span>
          <input
            type="number"
            className={Style.sidebarPriceInput}
            placeholder="$ 0"
            value={minPrice === undefined ? "" : minPrice}
            onChange={(e) => {
              const value = e.target.value ? Number(e.target.value) : undefined;
              setMinPrice(value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleApplyFilters();
              }
            }}
          />
          <span className={Style.sidebarPriceLabel}>إلى</span>
          <input
            type="number"
            className={Style.sidebarPriceInput}
            placeholder="$ 99"
            value={maxPrice === undefined ? "" : maxPrice}
            onChange={(e) => {
              const value = e.target.value ? Number(e.target.value) : undefined;
              setMaxPrice(value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleApplyFilters();
              }
            }}
          />
        </div>
      </div>
      {/* التقييم */}
      <div className={Style.sidebarSection}>
        <strong className={Style.sidebarSectionTitle}>التقييم</strong>
        <div className={Style.sidebarRateRange}>
          <span className={Style.sidebarRateLabel}>من</span>
          <input
            type="number"
            className={Style.sidebarRateInput}
            placeholder="0"
            value={feedbackScore === undefined ? "" : feedbackScore}
            onChange={(e) => {
              const value = e.target.value ? Number(e.target.value) : undefined;
              setFeedbackScore(value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleApplyFilters();
              }
            }}
          />
          <FontAwesomeIcon icon={faStar} className={Style.sidebarRateStar} />
          <span className={Style.sidebarRateLabel}>إلى</span>
          <input
            type="number"
            className={Style.sidebarRateInput}
            placeholder="5"
            value={feedbackScoreTo === undefined ? "" : feedbackScoreTo}
            onChange={(e) => {
              const value = e.target.value ? Number(e.target.value) : undefined;
              setFeedbackScoreTo(value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleApplyFilters();
              }
            }}
          />
          <FontAwesomeIcon icon={faStar} className={Style.sidebarRateStar} />
        </div>
        <button className={Style.sidebarResetBtn} onClick={handleReset}>إعادة الضبط</button>
      </div>
      
      {/* زر تطبيق الفلاتر */}
      <div className={Style.sidebarSection}>
        <button 
          className={Style.applyFiltersBtn}
          onClick={handleApplyFilters}
        >
          تطبيق الفلاتر
        </button>
      </div>
    </div>
  );
}
