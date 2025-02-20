import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import Style from "../Register/register.module.css";
import imagelogo from "../../../assets/صورة_واتساب_بتاريخ_2024-11-10_في_22.53.07_158af9f7-removebg-preview.png";
import HeroImageSvg from "../../../assets/svg/svgHeroimage.svg";
import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import { Link } from "react-router-dom";
function Register() {
  type Login = {
    email: string;
    password: string;
    confirmPassword: string;
    phone: string;
    city: string;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      city: "",
    },
    mode: "all",
  });
  const Onsubmit: SubmitHandler<Login> = async (data) => {
    try {
      const respose = await axios.post(
        "https://projectplant-production.up.railway.app/api/v1/auth/user/Register",
        data
      );
      console.log(respose.data);
    } catch (errors) {
      console.log(errors);
    }
  };
  const [visible, Setvisible] = useState<boolean>(true);

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
              <div className="w-100 d-flex flex-column">
                <label htmlFor="name">اسم المستخدم</label>
                <input
                  placeholder="أدخل الاسم "
                  className="w-100 p-2"
                  type="text"
                  id="name"
                  aria-label="name"
                  {...register("name", {
                    required: "name is required",
                    minLength: {
                      value: 4,
                      message: "username must be at least 4 characters",
                    },
                  })}
                />
              </div>
              <div className="w-100 d-flex gap-2 ">
                <div className="w-50 d-flex flex-column ">
                  <label htmlFor="name">المدينة</label>
                  <input
                    placeholder="المدينة"
                    className="w-100 p-2"
                    type="text"
                    id="name"
                    aria-label="city"
                    {...register("city", {
                      required: "city is required",
                      minLength: {
                        value: 4,
                        message: "country must be at least 4 characters",
                      },
                    })}
                  />
                </div>
                <div className="w-50 d-flex  flex-column d-md-block ">
                  <label htmlFor="name">رقم الهاتف</label>
                  <input
                    placeholder="الهاتف"
                    className="w-100 p-2"
                    type="text"
                    id="name"
                    aria-label="phone"
                    {...register("phone", {
                      required: {
                        value: true,
                        message: "البريد الإلكتروني مطلوب",
                      },
                    })}
                  />
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
              <div className="w-100 d-flex flex-column position-relative">
                <label htmlFor="name">كلمة المرور</label>
                <input
                  placeholder="أدخل كلمة المرور"
                  className="w-100 p-2"
                  type={visible ? "password" : "text"}
                  id="name"
                  aria-label="password"
                  {...register("password", {
                    required: "الرقم السري مطلوب",
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
                {errors.password && (
                  <span className="text-danger">{errors.password.message}</span>
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
                      value === watch("password") || "كلمات المرور غير متطابقة",
                  })}
                />
                {errors.confirmPassword && (
                  <span className="text-danger">
                    {errors.confirmPassword.message}
                  </span>
                )}
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

{
  /* <FontAwesomeIcon
icon={faEyeSlash}
className={Style.IconHideEye}
/> */
}
export default Register;
