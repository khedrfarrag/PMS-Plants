import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { CategoryPoint, ProductsPoint } from "../../../../constant/Const";
import ImageUpload from "./ImageUpload";
import styles from "./AddProduct.module.css";
import { ShimmerSimpleGallery, ShimmerPostItem } from "react-shimmer-effects";

interface FormData {
  Id: string;
  Name: string;
  CategoryId: number;
  SubCategoryId: number;
  Description: string;
  DiscountPercentage?: number;
  ImageUrl: FileList | string;
  Price: number;
  StockQuantity: number;
  Title1: string;
  Body1: string;
  Title2: string;
  Body2: string;
}

interface SubCategory {
  Id: number;
  Name: string;
}

interface Category {
  Id: number;
  Name: string;
  SubCategories: SubCategory[];
}

function AddProduct() {
  const navigate = useNavigate();
  const location = useLocation();
  const method = location?.state?.method === "Edit";
  const productdata = location?.state?.data;

  const [GetProductData, setProductData] = useState<FormData | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [AllCategoryId, setAllCategoryId] = useState<Category[]>([]);
  const [SubCategoryId, setSubCategoryId] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<FormData>({ mode: "all" });

  const watchedCategoryId = watch("CategoryId");

  const getProductData = async (id: number) => {
    try {
      setLoading(true);
      const response = await axios.get<FormData>(
        ProductsPoint.GetProductId(id),
        {
          headers: {
              Authorization: `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}`,
          },
        }
      );
      setProductData(response?.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "حدث خطأ أثناء جلب بيانات المنتج"
        );
      } else {
        toast.error("حدث خطأ أثناء جلب بيانات المنتج");
      }
    } finally {
      setLoading(false);
    }
  };

  const GetAllcategory = async () => {
    try {
      const response = await axios.get(CategoryPoint.GetAllCategories);
    setAllCategoryId(response.data);
    } catch (error) {
      toast.error("حدث خطأ في جلب الفئات");
    }
  };

  const handleImageSelect = useCallback((file: File | null) => {
    setSelectedImage(file);
  }, []);

  const formdata = (data: FormData) => {
    const formData = new FormData();
    formData.append("Name", data.Name);
    formData.append("Price", String(data.Price));
    formData.append("StockQuantity", String(data.StockQuantity));
    formData.append("Description", data.Description);
    
    // Handle image upload
    if (selectedImage) {
      formData.append("ImageUrl", selectedImage);
    }
    
    formData.append("DiscountPercentage", String(data.DiscountPercentage || 0));
    formData.append("CategoryId", String(data.CategoryId));
    
    // Handle SubCategoryId - if it's empty or 0, send 0
    const subCategoryId = data.SubCategoryId || 0;
    formData.append("SubCategoryId", String(subCategoryId));
    
    formData.append("Title1", data.Title1 || "");
    formData.append("Title2", data.Title2 || "");
    formData.append("Body1", data.Body1 || "");
    formData.append("Body2", data.Body2 || "");
    return formData;
  };

  const onSubmit = async (data: FormData) => {
    if (!method && !selectedImage) {
      toast.error("يرجى اختيار صورة للمنتج");
      return;
    }

    try {
      setLoading(true);
    const conveirtdata = formdata(data);
      
      await axios({
        method: method ? "put" : "post",
        url: method ? ProductsPoint.Put(productdata) : ProductsPoint.Post,
        data: conveirtdata,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}`,
        },
      });
      
      toast.success(
        method ? "تم تعديل المنتج بنجاح" : "تمت إضافة المنتج بنجاح"
      );
      method ? navigate("/admin/product-list") : ""
      // navigate("/admin/product-list");
      reset();
      
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "حدث خطأ أثناء حفظ المنتج"
        );
      } else {
        toast.error("حدث خطأ أثناء حفظ المنتج");
      }
    } finally {
      setLoading(false);
    }
  };

  // Load categories on mount
  useEffect(() => {
    GetAllcategory();
    if (method && productdata) {
      getProductData(productdata);
    }
  }, [method, productdata]);

  // Set form data when product data is loaded (for edit mode)
  useEffect(() => {
    if (GetProductData && isInitialLoad && AllCategoryId.length > 0) {
      setIsInitialLoad(false);
      reset({
        ...GetProductData,
        ImageUrl: "", // لا يمكن تعيين ملف تلقائيًا
      });
      // Load subcategories for the current category
      if (GetProductData.CategoryId) {
        const selectedCat = AllCategoryId.find(cat => cat.Id === Number(GetProductData.CategoryId));
        setSubCategoryId(selectedCat?.SubCategories || []);
        setTimeout(() => {
          setValue("SubCategoryId", GetProductData.SubCategoryId || 0);
        }, 200);
      }
    }
  }, [GetProductData, reset, setValue, isInitialLoad, AllCategoryId]);

  // Handle category change - clear subcategory when category changes
  useEffect(() => {
    if (AllCategoryId.length > 0) {
      if (watchedCategoryId) {
        setValue("SubCategoryId", 0);
        const selectedCat = AllCategoryId.find(cat => cat.Id === Number(watchedCategoryId));
        setSubCategoryId(selectedCat?.SubCategories || []);
      } else {
        setSubCategoryId([]);
        setValue("SubCategoryId", 0);
      }
    }
  }, [watchedCategoryId, setValue, AllCategoryId]);

  if (loading) {
    return (
      <div className={styles.loadingContainer} style={{ padding: '40px 0' }}>
        {/* شيمر الهيدر */}
        <div style={{ marginBottom: 32 }}>
          <ShimmerPostItem hasImage={false} title cta />
        </div>
        {/* شيمر جاليري لعناصر النموذج */}
        <div style={{ marginBottom: 32 }}>
          <ShimmerSimpleGallery row={2} col={3} imageHeight={32} />
        </div>
        {/* شيمر مستطيل كبير مكان الفورم */}
        <div style={{ width: '100%', height: 220, background: '#e0e0e0', borderRadius: 16, marginBottom: 32 }} />
        {/* شيمر زرار كبير مكان أزرار التحكم */}
        <div style={{ width: 180, height: 48, background: '#e0e0e0', borderRadius: 12, margin: '0 auto' }} />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>{method ? "تعديل المنتج" : "إضافة منتج جديد"}</h1>
        <p>{method ? "قم بتعديل بيانات المنتج" : "أدخل بيانات المنتج الجديد"}</p>
      </div>

    <form
      onSubmit={handleSubmit(onSubmit)}
        className={styles.form}
      dir="rtl"
      encType="multipart/form-data"
    >
        <div className={styles.formGrid}>
          {/* اسم المنتج */}
          <div className={styles.formGroup}>
            <label className={styles.label}>اسم المنتج *</label>
        <input
          type="text"
              className={`${styles.input} ${errors.Name ? styles.error : ''}`}
              placeholder="أدخل اسم المنتج"
              {...register("Name", { required: "اسم المنتج مطلوب" })}
        />
            {errors.Name && <span className={styles.errorText}>{errors.Name.message}</span>}
      </div>

          {/* الكمية */}
          <div className={styles.formGroup}>
            <label className={styles.label}>الكمية *</label>
        <input
          type="number"
              placeholder="أدخل الكمية المتوفرة"
              className={`${styles.input} ${errors.StockQuantity ? styles.error : ''}`}
          {...register("StockQuantity", {
                required: "الكمية مطلوبة",
            min: { value: 1, message: "يجب أن تكون القيمة أكبر من 0" },
          })}
        />
            {errors.StockQuantity && <span className={styles.errorText}>{errors.StockQuantity.message}</span>}
      </div>

          {/* السعر */}
          <div className={styles.formGroup}>
            <label className={styles.label}>السعر *</label>
        <input
          type="number"
              placeholder="أدخل سعر المنتج"
              className={`${styles.input} ${errors.Price ? styles.error : ''}`}
          {...register("Price", {
                required: "السعر مطلوب",
            min: { value: 1, message: "يجب أن يكون السعر أكبر من 0" },
          })}
        />
            {errors.Price && <span className={styles.errorText}>{errors.Price.message}</span>}
      </div>

          {/* الفئة الرئيسية */}
          <div className={styles.formGroup}>
            <label className={styles.label}>الفئة الرئيسية *</label>
        <select
              className={`${styles.select} ${errors.CategoryId ? styles.error : ''}`}
              {...register("CategoryId", { required: "الفئة الرئيسية مطلوبة", valueAsNumber: true })}
        >
          <option value="">اختر الفئة الرئيسية</option>
          {AllCategoryId.map((cat) => (
            <option key={cat.Id} value={cat.Id}>
              {cat.Name}
            </option>
          ))}
        </select>
            {errors.CategoryId && <span className={styles.errorText}>{errors.CategoryId.message}</span>}
          </div>

          {/* الفئة الفرعية */}
          <div className={styles.formGroup}>
            <label className={styles.label}>الفئة الفرعية</label>
        <select
              className={styles.select}
              {...register("SubCategoryId")}
              disabled={loading}
              defaultValue={method && GetProductData ? GetProductData.SubCategoryId : ""}
        >
              <option value="">
                {loading ? "جاري التحميل..." : "اختر الفئة الفرعية"}
              </option>
          {SubCategoryId.map((sub) => (
            <option key={sub.Id} value={sub.Id}>
              {sub.Name}
            </option>
          ))}
        </select>
        
            {SubCategoryId.length === 0 && watchedCategoryId && !loading && (
              <span className={styles.infoText}>لا توجد فئات فرعية لهذه الفئة</span>
        )} 
      </div>

          {/* الخصم */}
          <div className={styles.formGroup}>
            <label className={styles.label}>نسبة الخصم (%)</label>
        <input
              type="number"
              placeholder="أدخل نسبة الخصم"
              className={`${styles.input} ${errors.DiscountPercentage ? styles.error : ''}`}
          {...register("DiscountPercentage", {
                min: { value: 0, message: "الخصم يجب أن يكون 0 أو أكثر" },
                max: { value: 100, message: "الخصم لا يمكن أن يتجاوز 100%" },
          })}
        />
            {errors.DiscountPercentage && <span className={styles.errorText}>{errors.DiscountPercentage.message}</span>}
          </div>
      </div>

        {/* الوصف */}
        <div className={styles.formGroup}>
          <label className={styles.label}>وصف المنتج *</label>
        <textarea
            placeholder="أدخل وصف المنتج"
            className={`${styles.textarea} ${errors.Description ? styles.error : ''}`}
            rows={4}
            {...register("Description", { required: "وصف المنتج مطلوب" })}
          />
          {errors.Description && <span className={styles.errorText}>{errors.Description.message}</span>}
      </div>

        {/* تفاصيل إضافية */}
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label className={styles.label}>العنوان الأول</label>
        <input
          type="text"
              placeholder="أدخل العنوان الأول"
              className={styles.input}
          {...register("Title1")}
        />
      </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>الوصف الأول</label>
        <input
          type="text"
              placeholder="أدخل الوصف الأول"
              className={styles.input}
          {...register("Body1")}
        />
      </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>العنوان الثاني</label>
        <input
          type="text"
              placeholder="أدخل العنوان الثاني"
              className={styles.input}
          {...register("Title2")}
        />
      </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>الوصف الثاني</label>
        <input
          type="text"
              placeholder="أدخل الوصف الثاني"
              className={styles.input}
          {...register("Body2")}
        />
      </div>
        </div>

        {/* رفع الصورة */}
        <div className={styles.formGroup}>
          <label className={styles.label}>
            صورة المنتج {!method && '*'}
          </label>
          <ImageUpload
            onImageSelect={handleImageSelect}
            currentImageUrl={GetProductData?.ImageUrl as string}
            error={errors.ImageUrl?.message}
            required={!method}
          />
      </div>

        {/* أزرار التحكم */}
        <div className={styles.buttonGroup}>
          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? "جاري الحفظ..." : (method ? "تحديث المنتج" : "إضافة المنتج")}
        </button>
        <button
          type="button"
            className={styles.cancelButton}
          onClick={() => navigate("/admin/product-list")}
            disabled={loading}
        >
          إلغاء
        </button>
      </div>
    </form>
    </div>
  );
}

export default AddProduct;
