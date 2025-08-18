import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faCamera, faTimes } from "@fortawesome/free-solid-svg-icons";
import Style from "./AdminRegister.module.css";
import imagelogo from "../../../assets/صورة_واتساب_بتاريخ_2024-11-10_في_22.53.07_158af9f7-removebg-preview.png";
import HeroImageSvg from "../../../assets/svg/svgHeroimage.svg";
import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { authEndPoint } from "../../../constant/Const";

function AdminRegister() {
  // قائمة المحافظات (مطابقة للأرقام في الباك اند)
  const governoratesList = [
    { id: 1, name: "Cairo" },
    { id: 2, name: "Giza" },
    { id: 3, name: "Alexandria" },
    { id: 4, name: "Mansoura" },
    { id: 5, name: "Luxor" },
    { id: 6, name: "Aswan" },
    { id: 7, name: "Asyut" },
    { id: 8, name: "Beheira" },
    { id: 9, name: "Fayoum" },
    { id: 10, name: "Ismailia" },
    { id: 11, name: "Port Said" },
    { id: 12, name: "Suez" },
    { id: 13, name: "Tanta" },
    { id: 14, name: "Zagazig" },
    { id: 15, name: "Shibin El Kom" },
    { id: 16, name: "Sohag" },
    { id: 17, name: "Qena" },
    { id: 18, name: "Kafr El Sheikh" },
    { id: 19, name: "Matrouh" },
    { id: 20, name: "Minya" },
    { id: 21, name: "Monufia" },
    { id: 23, name: "North Sinai" },
    { id: 24, name: "Sinai" },
    { id: 25, name: "South Sinai" },
    { id: 26, name: "Beni Suef" },
  ];

  type AdminLogin = {
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
  } = useForm<AdminLogin>({
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
    if (!file.type.startsWith('image/')) {
      setImageError("يرجى اختيار ملف صورة صحيح");
      return;
    }
    
    // التحقق من حجم الملف (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setImageError("حجم الصورة يجب أن يكون أقل من 5 ميجابايت");
      return;
    }
    
    // التحقق من نوع الصورة
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
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

  const Onsubmit: SubmitHandler<AdminLogin> = async (data) => {
    console.log(Data(data));
    const formData = Data(data);
    try {
      const respose = await axios.post(
        authEndPoint.RegisterAdmin,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }
      );
      console.log(respose.data);
      toast.success("تم تسجيل المدير بنجاح!");
      navigate("/auth/verify-email");
    } catch (errors: any) {
      console.log(errors);
      if (errors.response?.data) {
        toast.error(errors.response.data[0] || "حدث خطأ ما");
      } else {
        toast.error("حدث خطأ في الاتصال");
      }
    }
  };

  const Data = (data: AdminLogin) => {
    const formData = new FormData();
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
    
    return formData;
  };

  const [visible, Setvisible] = useState<boolean>(true);

  return (
    <>
      <div className=" w-100 vh-100 d-flex flex-wrap ">
        <div
          className={`${Style.HeroImage} w-50  d-md-flex d-xl-flex flex-column gap-4 d-sm-none   `}
        >
          <img src={HeroImageSvg} alt="" />
          <div className={`${Style.HeroCaption} `}>
            <h1>انضم إلينا كمدير!</h1>
            <p>
              أنشئ حسابك كمدير واستمتع بإدارة النظام بكفاءة عالية
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
              <h3>تسجيل مدير جديد</h3>
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
                  className={`${Style.imageUploadContainer} ${isDragOver ? Style.dragOver : ''} ${imagePreview ? Style.hasImage : ''}`}
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
                      <FontAwesomeIcon icon={faCamera} className={Style.cameraIcon} />
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
                تسجيل مدير جديد
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

export default AdminRegister; 