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
  files: FileList;
  NewTitle: string;
  NewDescription: string;
}

function AddProduct() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({ mode: "all" });

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
    if (data.files && data.files.length > 0) {
      formData.append("files", data.files[0]);
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
        toast.success(
          `✅ تمت الإضافة بنجاح! 🎉\n${result.message || "تمت العملية بنجاح"}`
        );
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
    <>
      <div className="container">
        <div className="content mt-3 mb-4">
          <h3>المنتجات</h3>
          <h6> تستطيع ان تضيف ما تريد من منتجاتك لرفعها على موقعك</h6>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="row my-form shadow-lg rounded-2 p-2"
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
              {errors.productName && (
                <p className="text-danger me-2">{errors.productName.message}</p>
              )}
            </div>
          </div>

          {/* الكمية */}
          <div className="col-md-6">
            <input
              type="text"
              placeholder="الكمية"
              className="inputs-form"
              {...register("quantity", {
                required: "هذا الحقل مطلوب",
                min: { value: 1, message: "يجب أن تكون القيمة أكبر من 0" },
              })}
            />
            {errors.quantity && (
              <p className="text-danger me-2">{errors.quantity.message}</p>
            )}
          </div>

          {/* السعر */}
          <div className="col-md-6">
            <input
              type="text"
              placeholder="السعر"
              className="inputs-form"
              {...register("price", {
                required: "هذا الحقل مطلوب",
                min: { value: 1, message: "يجب أن يكون السعر أكبر من 0" },
              })}
            />
            {errors.price && (
              <p className="text-danger me-2">{errors.price.message}</p>
            )}
          </div>

          {/* الفئة */}
          <div className="col-md-6">
            <select
              className="inputs-form"
              {...register("category", { required: "هذا الحقل مطلوب" })}
            >
              <option value="">اختر فئة</option>
              <option value="مبيدات">مبيدات</option>
              <option value="اسمده زراعيه">أسمده زراعيه</option>
              <option value="تقاوي">تقاوي</option>
            </select>
            {errors.category && (
              <p className="text-danger me-2">{errors.category.message}</p>
            )}
          </div>

          {/* الخصم */}
          <div className="col-md-6">
            <input
              type="text"
              placeholder="الخصم"
              className="inputs-form"
              {...register("discount", {
                required: " هذا الحقل مطلوب",
                min: { value: 1, message: "يجب أن يكون الخصم أكبر من 0" },
              })}
            />
            {errors.discount && (
              <p className="text-danger me-2">{errors.discount.message}</p>
            )}
          </div>

          {/* الوصف */}
          <div className="col-md-12">
            <textarea
              placeholder="الوصف"
              {...register("description", { required: "هذا الحقل مطلوب" })}
            ></textarea>
            {errors.description && (
              <p className="text-danger me-2">{errors.description.message}</p>
            )}
          </div>
          {/* اضافة عنصر */}
          <div className="row  ">
            <div className="col-xl-4 col-lg-6 col-md-6 col-sm-12 col-12 d-flex align-items-center">
              <label htmlFor="العنصر" id="العنصر" className="w-50 me-3">
                {" "}
                أسم العنصر
              </label>
              <input
                type="text"
                id="NewTitle"
                aria-label="NewTitle"
                placeholder="أدخل أسم العنصر"
                className="inputs-form"
                {...register("NewTitle", {
                  min: {
                    value: 5,
                    message: "يجب أن يكون الاسم اكبر من 5 احرف",
                  },
                })}
              />
            </div>
            <div className="col-xl-4 col-lg-6 col-md-6 col-sm-12 col-12 d-flex align-items-center">
              <label htmlFor="الوصف" id="الوصف" className="w-50 me-3">
                {" "}
                الوصف
              </label>
              <input
                type="text"
                id="NewDescription"
                aria-label="NewDescription"
                placeholder="أدخل الوصف"
                className="inputs-form"
                {...register("NewDescription", {
                  min: {
                    value: 10,
                    message: "يجب أن يكون الوصف اكبر من 10 حروف ",
                  },
                })}
              />
            </div>
            <div className="col-xl-4 col-lg-6 col-md-6 col-sm-12 col-12 d-flex align-items-center">
              <button className="btn btn-primary w-auto">إضافة عنصر</button>
            </div>
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
              aria-label="files"
              {...register("files", { required: "يجب تحميل صورة" })}
            />
            {errors.files && <p className="error">{errors.files.message}</p>}
          </div>

          {/* الأزرار */}
          <div className="my-button">
            <button type="submit" className="btn btn-light">
              إضافة
            </button>
            <button
              type="button"
              className="btn cancel-btn"
              onClick={() => reset()}
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default AddProduct;
