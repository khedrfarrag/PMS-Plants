import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

interface FormData {
  productName: string;
  quantity: number;
  price: number;
  category: string;
  discount?: number;
  description: string;
  image: FileList;
}

function AddProduct() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>(); 




  const onSubmit = async (data: FormData) => {
    const formData = new FormData();
    formData.append("productName", data.productName);
    formData.append("quantity", data.quantity.toString());
    formData.append("price", data.price.toString());
    formData.append("category", data.category);
    if (data.discount !== undefined) {
      formData.append("discount", data.discount.toString());
    }
    formData.append("description", data.description);
    if (data.image && data.image.length > 0) {
      formData.append("image", data.image[0]);
    }

    try {
      const response = await fetch(
        "https://projectplant-production.up.railway.app/api/v1/cartify-product/createCartifyProduct",
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      if (response.ok) {
        toast.success(`✅ تمت الإضافة بنجاح! 🎉\n${result.message || "تمت العملية بنجاح"}`);
        reset();
      } else {
        toast.error(`❌ خطأ: ${result.message || "حدث خطأ، حاول مجددًا!"}`);
      }
    } catch (error) {
      console.error("❌ خطأ في الاتصال بالسيرفر:", error);
      toast.error("❌ حدث خطأ أثناء الاتصال بالسيرفر.");
    }
  };

  return (
    <div className="container">
      <div className="content mt-3 mb-4">
        <h3>المنتجات</h3>
        <h6> تستطيع ان تضيف ما تريد من منتجاتك لرفعها على موقعك</h6>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="row my-form"
        dir="rtl"
        encType="multipart/form-data"
      >
        {/* اسم المنتج */}
        <div className="col-md-12">
          <div className="mb-3">
            <input
              type="text"
              className="inputs-form"
              placeholder="اسم المنتج"
              {...register("productName", { required: "هذا الحقل مطلوب" })}
            />
            {errors.productName && <p className="error">{errors.productName.message}</p>}
          </div>
        </div>

        {/* الكمية */}
        <div className="col-md-6">
          <input
            type="number"
            placeholder="الكمية"
            className="inputs-form"
            {...register("quantity", {
              required: "هذا الحقل مطلوب",
              min: { value: 1, message: "يجب أن تكون القيمة أكبر من 0" },
            })}
          />
          {errors.quantity && <p className="error">{errors.quantity.message}</p>}
        </div>

        {/* السعر */}
        <div className="col-md-6">
          <input
            type="number"
            placeholder="السعر"
            className="inputs-form"
            {...register("price", {
              required: "هذا الحقل مطلوب",
              min: { value: 1, message: "يجب أن يكون السعر أكبر من 0" },
            })}
          />
          {errors.price && <p className="error">{errors.price.message}</p>}
        </div>

        {/* الفئة */}
        <div className="col-md-6">
          <input
            type="text"
            placeholder="الفئة"
            className="inputs-form"
            {...register("category", { required: "هذا الحقل مطلوب" })}
          />
          {errors.category && <p className="error">{errors.category.message}</p>}
        </div>

        {/* الخصم */}
        <div className="col-md-6">
          <input
            type="number"
            placeholder="الخصم"
            className="inputs-form"
            {...register("discount", {
              min: { value: 0, message: "يجب أن يكون الخصم 0 أو أكثر" },
            })}
          />
          {errors.discount && <p className="error">{errors.discount.message}</p>}
        </div>

        {/* الوصف */}
        <div className="col-md-12">
          <textarea
            placeholder="الوصف"
            {...register("description", { required: "هذا الحقل مطلوب" })}
          ></textarea>
          {errors.description && <p className="error">{errors.description.message}</p>}
        </div>

        {/* تحميل الصورة */}
        <div className="col-md-12 my-form">
          <label htmlFor="imageUpload" className="custom-file-upload">
            <i className="fa-solid fa-arrow-up"></i>
            <h6>
              اسحب الصورة و أسقطها <span>هنا</span>
            </h6>
          </label>
          <input
            type="file"
            className="img"
            id="imageUpload"
            {...register("image", { required: "يجب تحميل صورة" })}
          />
          {errors.image && <p className="error">{errors.image.message}</p>}
        </div>

        {/* الأزرار */}
        <div className="my-button">
          <button type="submit" className="btn btn-light">
            إضافة
          </button>
          <button type="button" className="btn cancel-btn" onClick={() => reset()} >
            إلغاء
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddProduct;
