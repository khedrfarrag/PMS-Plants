import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import styles from "./style/AddCategores.module.css";
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faTrash,
  faArrowLeft,
  faList,
} from "@fortawesome/free-solid-svg-icons";
import { CategoryPoint } from "../../../constant/Const";

interface SubCategory {
  Id?: number;
  Name: string;
}

interface CategoryData {
  Id?: number;
  Name: string;
  SubCategories: SubCategory[];
}

export default function AddCategores() {
  const navigate = useNavigate();
  const location = useLocation();
  const isEdit = location.state?.method === "Edit";
  const editData = location.state?.data;
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CategoryData>({
    defaultValues: {
      Name: "",
      SubCategories: [], // لا توجد فئات فرعية افتراضياً
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "SubCategories",
  });

  // عند الدخول في وضع التعديل، عيّن القيم القديمة
  useEffect(() => {
    if (isEdit && editData) {
      reset({
        Name: editData.Name,
        SubCategories:
          editData.SubCategories && editData.SubCategories.length > 0
            ? editData.SubCategories.map((sub: SubCategory) => ({
                Name: sub.Name,
              }))
            : [],
      });
    }
  }, [isEdit, editData, reset]);

  const onSubmit = async (data: CategoryData) => {
    try {
      setLoading(true);

      if (isEdit && editData) {
        // تعديل
        await axios.put(CategoryPoint.Put(editData.Id!), data, {
          headers: {
            Authorization: `Bearer ${
              localStorage.getItem("token") || sessionStorage.getItem("token")
            }`,
          },
        });
        toast.success("تم تعديل الفئة بنجاح");
      } else {
        // إضافة
        await axios.post(CategoryPoint.Post, data, {
          headers: {
            Authorization: `Bearer ${
              localStorage.getItem("token") || sessionStorage.getItem("token")
            }`,
          },
        });
        toast.success("تم أضافة الفئة بنجاح");
        reset({
          Name: "",
          SubCategories: [],
        });
      }
      navigate("/admin/categore-list");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "حدث خطأ أثناء حفظ الفئة");
      } else {
        toast.error("حدث خطأ أثناء حفظ الفئة");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubCategory = () => {
    append({ Name: "" });
  };

  const handleRemoveSubCategory = (index: number) => {
    remove(index);
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1>{isEdit ? "تعديل فئة" : "إضافة فئة جديدة"}</h1>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className={styles.navigationButtons}>
        <button
          type="button"
          onClick={() => navigate("/admin/add-product")}
          className={styles.navButton}
        >
          <FontAwesomeIcon icon={faPlus} />
          إضافة المنتجات
        </button>
        <button
          type="button"
          onClick={() => navigate("/admin/categore-list")}
          className={styles.navButton}
        >
          <FontAwesomeIcon icon={faList} />
          عرض الفئات
        </button>
        <button
          type="button"
          onClick={() => navigate("/admin/product-list")}
          className={styles.navButton}
        >
          <FontAwesomeIcon icon={faList} />
          العودة إلى قائمة المنتجات
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        {/* الفئة الرئيسية */}
        <div className={styles.formGroup}>
          <label className={styles.label}>اسم الفئة الرئيسية *</label>
          <input
            {...register("Name", {
              required: "اسم الفئة الرئيسية مطلوب",
              minLength: {
                value: 2,
                message: "اسم الفئة يجب أن يكون على الأقل حرفين",
              },
            })}
            placeholder="أدخل اسم الفئة الرئيسية"
            className={`${styles.input} ${errors.Name ? styles.error : ""}`}
          />
          {errors.Name && (
            <span className={styles.errorText}>{errors.Name.message}</span>
          )}
        </div>

        {/* الفئات الفرعية */}
        <div className={styles.subCategoriesSection}>
          <div className={styles.subCategoriesHeader}>
            <h3 className={styles.subCategoriesTitle}>الفئات الفرعية</h3>
            <button
              type="button"
              onClick={handleAddSubCategory}
              className={styles.addSubCategoryButton}
            >
              <FontAwesomeIcon icon={faPlus} />
              إضافة فئة فرعية
            </button>
          </div>

          {fields.length === 0 ? (
            <div className={styles.emptyState}>
              <p className={styles.emptyStateText}>
                لا توجد فئات فرعية. اضغط على "إضافة فئة فرعية" لإضافة فئات
                فرعية.
              </p>
            </div>
          ) : (
            fields.map((field, index) => (
              <div key={field.id} className={styles.subCategoryItem}>
                <input
                  {...register(`SubCategories.${index}.Name`, {
                    required: "اسم الفئة الفرعية مطلوب",
                    minLength: {
                      value: 2,
                      message: "اسم الفئة الفرعية يجب أن يكون على الأقل حرفين",
                    },
                  })}
                  placeholder={`اسم الفئة الفرعية ${index + 1}`}
                  className={`${styles.subCategoryInput} ${
                    errors.SubCategories?.[index]?.Name ? styles.error : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveSubCategory(index)}
                  className={styles.removeButton}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={styles.submitButton}
          disabled={loading}
        >
          {loading ? "جاري الحفظ..." : isEdit ? "تحديث الفئة" : "إضافة الفئة"}
        </button>
      </form>
    </div>
  );
}
