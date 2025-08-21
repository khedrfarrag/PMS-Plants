import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faCamera,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import Style from "../Register/register.module.css";
import imagelogo from "../../../assets/صورة_واتساب_بتاريخ_2024-11-10_في_22.53.07_158af9f7-removebg-preview.png";
import HeroImageSvg from "../../../assets/svg/svgHeroimage.svg";
import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { authEndPoint } from "../../../constant/Const";

function Register() {
  // تعريف نوع المحافظة

  // قائمة المحافظات (مطابقة للأرقام في الباك اند)
  const governoratesList = [
    { id: 1, name: "Cairo" },
    { id: 2, name: "Giza" },
    { id: 3, name: "Alexandria" },
    { id: 4, name: "Dakahlia" },
    { id: 5, name: "RedSea" },
    { id: 6, name: "Beheira" },
    { id: 7, name: "Fayoum" },
    { id: 8, name: "Gharbia" },
    { id: 9, name: "Ismailia" },
    { id: 10, name: "Menoufia" },
    { id: 11, name: "Minya" },
    { id: 12, name: "Qaliubiya" },
    { id: 13, name: "NewValley" },
    { id: 14, name: "Suez" },
    { id: 15, name: "Aswan" },
    { id: 16, name: "Assiut" },
    { id: 17, name: "BeniSuef" },
    { id: 18, name: "PortSaid" },
    { id: 19, name: "Damietta" },
    { id: 20, name: "Sharqia" },
    { id: 21, name: "SouthSinai" },
    { id: 22, name: "KafrElSheikh" },
    { id: 23, name: "Matrouh" },
    { id: 24, name: "Luxor" },
    { id: 25, name: "Qena" },
    { id: 26, name: "NorthSinai" },
    { id: 27, name: "Sohag" },
  ];

  type Login = {
    FirstName: string;
    LastName: string;
    Email: string;
    Password: string;
    ConfirmedPassword: string;
    City: string;
    PhoneNumber: string;
    Image?: File | null;
  };

  const navigate = useNavigate();

  // State للصورة والمعاينة
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [imageError, setImageError] = useState<string>("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Login>({
    defaultValues: {
      FirstName: "",
      LastName: "",
      Email: "",
      Password: "",
      ConfirmedPassword: "",
      City: "",
      PhoneNumber: "",
      Image: null,
    },
    mode: "all",
  });

  // معالجة اختيار الصورة
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      validateAndSetImage(file);
    }
  };

  // معالجة السحب والإفلات
  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);

    const file = event.dataTransfer.files[0];
    if (file) {
      validateAndSetImage(file);
    }
  };

  // التحقق من صحة الصورة وتعيينها
  const validateAndSetImage = (file: File) => {
    setImageError("");

    // التحقق من نوع الملف
    if (!file.type.startsWith("image/")) {
      setImageError("يرجى اختيار ملف صورة صحيح");
      return;
    }

    // التحقق من حجم الملف (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setImageError("حجم الصورة يجب أن يكون أقل من 5 ميجابايت");
      return;
    }

    // التحقق من نوع الصورة
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setImageError("يرجى اختيار صورة بصيغة JPG, PNG أو WebP");
      return;
    }

    setSelectedImage(file);

    // إنشاء معاينة
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // إزالة الصورة
  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setImageError("");
  };

  const Onsubmit: SubmitHandler<Login> = async (data) => {
    console.log(data);
    try {
      // إنشاء FormData
      const formData = new FormData();

      // إضافة جميع الحقول النصية
      formData.append("FirstName", data.FirstName);
      formData.append("LastName", data.LastName);
      formData.append("Email", data.Email);
      formData.append("Password", data.Password);
      formData.append("ConfirmedPassword", data.ConfirmedPassword);
      formData.append("City", data.City);
      formData.append("PhoneNumber", data.PhoneNumber);

      // إضافة الصورة إذا كانت موجودة
      if (selectedImage) {
        formData.append("Image", selectedImage);
      }

      const respose = await axios.post(authEndPoint.RegisterUser, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(respose.data);
      toast(respose.data.Message);
      navigate("/auth/verify-email");
    } catch (errors: any) {
      console.log(errors);
    }
  };

  const [visible, Setvisible] = useState<boolean>(true);

  // console.log(window.location);
  return (
    // Responsive rendering
    <>
      <div className=" w-100 vh-100 d-flex flex-wrap ">
        <div
          className={`${Style.HeroImage} w-50  d-md-flex d-xl-flex flex-column gap-4 d-sm-none   `}
        >
          <img src={HeroImageSvg} alt="" />
          <div className={`${Style.HeroCaption} `}>
            <h1>انضم إلينا وابدأ رحلتك الزراعية!</h1>
            <p>
              أنشئ حسابك الآن واستمتع بتجربة تسوق سلسة ومميزة لجميع احتياجاتك
              الزراعية
            </p>
          </div>
        </div>
        <div className="  w-50 d-flex flex-column flex-grow-1 ">
          <div className=" w-100  position-relative">
            <img
              src={imagelogo}
              alt="logo"
              className={`${Style.LogoCampony}`}
            />
            <div className=" w-75 m-auto mt-5 ">
              <h3>انشاء حساب</h3>
              <p>اذا كان لديك حساب بالفعل اضغط علي </p>
              <Link className="link-to" to="/auth">
                <p className={`${Style.TitleNavigate}`}> سجل من هنا !</p>
              </Link>
            </div>
          </div>
          <form action="" className="w-100  " onSubmit={handleSubmit(Onsubmit)}>
            <div className=" w-75  d-flex flex-column m-auto gap-1 ">
              {/* حقل الصورة العصري */}
              <div className="w-100 d-flex flex-column">
                <label htmlFor="image">الصورة الشخصية</label>
                <div
                  className={`${Style.imageUploadContainer} ${
                    isDragOver ? Style.dragOver : ""
                  } ${imagePreview ? Style.hasImage : ""}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {imagePreview ? (
                    <div className={Style.imagePreview}>
                      <img src={imagePreview} alt="معاينة الصورة" />
                      <button
                        type="button"
                        className={Style.removeImageBtn}
                        onClick={removeImage}
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </button>
                    </div>
                  ) : (
                    <div className={Style.uploadContent}>
                      <FontAwesomeIcon
                        icon={faCamera}
                        className={Style.cameraIcon}
                      />
                      <p>اسحب الصورة هنا أو اضغط للاختيار</p>
                      <span>JPG, PNG, WebP - أقل من 5MB</span>
                      <input
                        type="file"
                        id="image"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleImageChange}
                        className={Style.fileInput}
                      />
                    </div>
                  )}
                </div>
                {imageError && (
                  <span className="text-danger">{imageError}</span>
                )}
              </div>

              <div className="Fristfeilde w-100 d-flex gap-2">
                <div className="w-100 d-flex flex-column">
                  <label htmlFor="name"> الاسم الاول </label>
                  <input
                    placeholder="أدخل الاسم الاول  "
                    className="w-100 p-2"
                    type="text"
                    id="name"
                    aria-label="name"
                    {...register("FirstName", {
                      required: " الاسم الاول مطلوب",
                      // minLength: {
                      //   value: 5,
                      //   message: " الاسم الاول يجب أن يكون 5 أحرف على الأقل",
                      // },
                      // maxLength: {
                      //   value: 50,
                      //   message: " الاسم الاول يجب أن يكون 50 أحرف على الأكثر",
                      // },
                      // onChange: (e) => {
                      //   // تقسيم الاسم الأول على حسب المسافة وتخزين أول كلمة فقط
                      //   const value = e.target.value.split(" ")[0] || "";
                      //   e.target.value = value;
                      //   return value;
                      // },
                    })}
                  />
                  {errors.FirstName && (
                    <span className="text-danger">
                      {errors.FirstName?.message}
                    </span>
                  )}
                </div>
                <div className="w-100 d-flex flex-column">
                  <label htmlFor="name"> الاسم الثاني </label>
                  <input
                    placeholder="أدخل الاسم الثاني "
                    className="w-100 p-2"
                    type="text"
                    id="name"
                    aria-label="name"
                    {...register("LastName", {
                      required: "الاسم الثاني مطلوب",
                      // minLength: {
                      //   value: 5,
                      //   message: "الاسم الثاني يجب أن يكون 5 أحرف على الأقل",
                      // },
                      // maxLength: {
                      //   value: 50,
                      //   message: "الاسم الثاني يجب أن يكون 50 أحرف على الأكثر",
                      // },
                      // onChange: (e) => {
                      //   // تقسيم الاسم الثاني على حسب المسافة وتخزين أول كلمة فقط
                      //   const value = e.target.value.split(" ")[0] || "";
                      //   e.target.value = value;
                      //   return value;
                      // },
                    })}
                  />
                  {errors.LastName && (
                    <span className="text-danger">
                      {errors.LastName?.message}
                    </span>
                  )}
                </div>
              </div>
              <div className="w-100 d-flex gap-2 ">
                <div className="w-100 d-flex flex-column ">
                  <label htmlFor="name">المدينة</label>
                  <select
                    className="w-100 p-2"
                    aria-label="governorates"
                    {...register("City", {
                      required: "المدينة مطلوبة",
                    })}
                  >
                    <option value={""} disabled>
                      المدينة
                    </option>
                    {governoratesList.map((governorate) => (
                      <option key={governorate.id} value={governorate.name}>
                        {governorate.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-100 d-flex flex-column">
                  <label htmlFor="name"> رقم الهاتف </label>
                  <input
                    placeholder="أدخل رقم الهاتف"
                    className="w-100 p-2"
                    type="text"
                    id="PhoneNumber"
                    aria-label="PhoneNumber"
                    {...register("PhoneNumber", {
                      required: "رقم الهاتف مطلوب",
                    })}
                  />
                  {errors.PhoneNumber && (
                    <span className="text-danger">
                      {errors.PhoneNumber?.message}
                    </span>
                  )}
                </div>
              </div>
              <div className="w-100 d-flex flex-column">
                <label htmlFor="name">البريد الالكتروني</label>
                <input
                  placeholder="أدخل البريد الالكتروني"
                  className="w-100 p-2"
                  type="email"
                  id="name"
                  aria-label="email"
                  {...register("Email", {
                    required: "البريد الالكتروني مطلوب",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "يجب أن يكون البريد الالكتروني بصيغة صحيحة",
                    },
                  })}
                />
                {errors.Email && (
                  <span className="text-danger">{errors.Email?.message}</span>
                )}
              </div>
              <div className="w-100 d-flex flex-column position-relative">
                <label htmlFor="name">كلمة المرور</label>
                <input
                  placeholder="أدخل كلمة المرور"
                  className="w-100 p-2"
                  type={visible ? "password" : "text"}
                  id="name"
                  aria-label="Password"
                  {...register("Password", {
                    required: "الرقم السري مطلوب",
                    pattern: {
                      //  اضافة شرط للتأكد من وجود حرف كبير وحرف صغير ورقم ورموز خاص
                      value:
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/,
                      message: "يجب أن يكون الرقم السري بصيغة صحيحة",
                    },
                    minLength: {
                      value: 8,
                      message: "يجب أن يكون الرقم السري 8 أحرف على الأقل",
                    },
                    maxLength: {
                      value: 20,
                      message: "يجب أن يكون الرقم السري 20 أحرف على الأكثر",
                    },
                  })}
                />
                {errors.Password && (
                  <span className="text-danger">{errors.Password.message}</span>
                )}
                <FontAwesomeIcon
                  icon={visible ? faEyeSlash : faEye}
                  onClick={() => Setvisible(!visible)}
                  className={Style.IconEye}
                />
              </div>
              <div className="w-100 d-flex flex-column position-relative">
                <label htmlFor="name">تاكيد كلمة المرور</label>
                <input
                  placeholder="أدخل كلمة المرور"
                  className="w-100 p-2"
                  type={visible ? "password" : "text"}
                  id="name"
                  aria-label="ConfirmedPassword"
                  {...register("ConfirmedPassword", {
                    required: "يجب ادخال رقم سري جديد",
                    minLength: {
                      value: 8,
                      message: "يجب أن يكون الرقم السري 8 أحرف على الأقل",
                    },
                    maxLength: {
                      value: 20,
                      message: "يجب أن يكون الرقم السري 20 أحرف على الأكثر",
                    },
                    validate: (value) =>
                      value === watch("Password") || "كلمات المرور غير متطابقة",
                  })}
                />
                <FontAwesomeIcon
                  icon={visible ? faEyeSlash : faEye}
                  className={Style.IconHideEye}
                  onClick={() => Setvisible(!visible)}
                />
              </div>
              {/* <div className="w-100 d-flex flex-column">
                <label htmlFor="name">الصورة</label> */}
              {/* <input
                  type="file"
                  id="image"
                  aria-label="image"
                  {...register("Image", {
                    required: "الصورة مطلوبة",
                  })}
                /> */}
              {/* </div> */}
              <button
                type="submit"
                className={`${Style.BttnSubmit} p-3 bg-success `}
              >
                {" "}
                انشاء حساب
              </button>
            </div>
          </form>
        </div>
      </div>
      <style>{`
         @media (max-width: 768px) {
           .${Style.HeroImage}, vh-100 w-50 {
             width: 100% !important;
             height: auto !important;
              display: none !important
           }
         }
      `}</style>
    </>
  );
}

export default Register;
