import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap CSS is imported
import imagelogo from "../../../assets/صورة_واتساب_بتاريخ_2024-11-10_في_22.53.07_158af9f7-removebg-preview.png";
import HeroImageSvg from "../../../assets/svg/svgHeroimage.svg";
import Style from "../ResetPass/ResetPass.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";

function ResetPass() {
  const navigate = useNavigate();

  const [visible, Setvisible] = useState<boolean>(true);

  interface IFormInput {
    email: string;
    code: string;
    newPassword: string;
    confirmPassword: string;
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      const response = await axios.post(
        "https://projectplant-production.up.railway.app/api/v1/auth/admin/Reset-Password",
        data
      );

      console.log("Backend Response:", response);

      // Show success message
      toast.success("تم إعادة تعيين كلمة المرور بنجاح");

      // Redirect to login page
      navigate("/auth");
    } catch (error) {
      console.error("Error during password reset:", error);

      // Display error message to the user
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ||
            "حدث خطأ أثناء إعادة تعيين كلمة المرور"
        );
      } else {
        toast.error("حدث خطأ غير متوقع");
      }
    }
  };

  return (
    <>
      <div className=" w-100 vh-100 d-flex flex-wrap ">
        <div
          className={`${Style.HeroImage} w-50  d-md-flex d-xl-flex flex-column gap-4 d-sm-none   `}
        >
          <img src={HeroImageSvg} alt="" />
          <div className={`${Style.HeroCaption} `}>
            <h1>حسنا تبقي خطوة واحدة!</h1>
            <p> أدخل هذه البيانات لاستعادة الوصول إلى حسابك !</p>
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
              <h3>اعادة تعيين كلمة المرور</h3>
              <p>اذا أردت الرجوع الي تسجيل الدخول </p>
              <Link className="link-to" to="/auth">
                <p className={`${Style.TitleNavigate}`}>
                  {" "}
                  تسجيل الدخول من هنا !
                </p>
              </Link>
            </div>
          </div>
          <form action="" className="w-100  " onSubmit={handleSubmit(onSubmit)}>
            <div className=" w-75  d-flex flex-column m-auto gap-1 ">
              <div className="w-100 d-flex flex-column">
                <label htmlFor="name">البريد الالكتروني</label>
                <input
                  placeholder="أدخل البريد الالكتروني"
                  className="w-100 p-2"
                  type="email"
                  id="name"
                  aria-label="email"
                  {...register("email", {
                    required: "البريد الالكتروني مطلوب",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "يجب أن يكون البريد الالكتروني بصيغة صحيحة",
                    },
                  })}
                />
                {errors.email && (
                  <span className="text-danger">{errors.email?.message}</span>
                )}
              </div>
              <div className="w-100 d-flex flex-column">
                <label htmlFor="name">الرقم المتغير</label>
                <input
                  placeholder="أدخل الرقم المتغير "
                  className="w-100 p-2"
                  type="text"
                  aria-label="code"
                  id="code"
                  {...register("code", {
                    required: "الرقم المتغير مطلوب",
                  })}
                />
              </div>
              <div className="w-100 d-flex flex-column position-relative">
                <label htmlFor="name"> كلمة المرور الجديدة</label>
                <input
                  placeholder="أدخل كلمة المرور"
                  className="w-100 p-2"
                  type={visible ? "password" : "text"}
                  id="name"
                  aria-label="newPassword"
                  {...register("newPassword", {
                    required: "يجب ادخال رقم سري جديد",
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
                  aria-label="confirmpassword"
                  {...register("confirmPassword", {
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
                      value === watch("newPassword") ||
                      "كلمات المرور غير متطابقة",
                  })}
                />
                <FontAwesomeIcon
                  icon={visible ? faEyeSlash : faEye}
                  className={Style.IconHideEye}
                  onClick={() => Setvisible(!visible)}
                />
              </div>
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

export default ResetPass;
