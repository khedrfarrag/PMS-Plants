import React from "react";
import Style from "../ForgetPass/Forgetpass.module.css";
import imagelogo from "../../../assets/صورة_واتساب_بتاريخ_2024-11-10_في_22.53.07_158af9f7-removebg-preview.png";
import HeroImageSvg from "../../../assets/svg/svgHeroimage.svg";
import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { authEndPoint } from "../../../constant/Const";
function ForgetPass() {
  type Login = {
    Email: string;
  };
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      Email: "",
    },
    mode: "all",
  });
  const Onsubmit: SubmitHandler<Login> = async (data) => {
    try {
      const respose = await axios.post(
        authEndPoint.ForgotPassword,
        data
      );
      toast.success(respose.data);
      console.log(respose.data);
      navigate("/auth/reset-password");

      console.log(respose.data);
    } catch (errors) {
      console.log(errors);
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
            <h1>نسيت كلمة المرور؟</h1>
            <p>لا تقلق ! أدخل بريدك الإلكتروني لاستعادة الوصول إلى حسابك</p>
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
              <h3>نسيت كلمة المرور</h3>
              <p>اذا اردت الرجوع الي تسجيل الدخول </p>
              <Link className="link-to" to="/auth">
                <p className={`${Style.TitleNavigate}`}>
                  {" "}
                  تسجيل الدخول من هنا !
                </p>
              </Link>
            </div>
          </div>
          <form className="w-100" onSubmit={handleSubmit(Onsubmit)}>
            <div className=" w-75  d-flex flex-column m-auto gap-1 mt-5 ">
              <div className="w-100 d-flex flex-column">
                <label htmlFor="email">البريد الالكتروني</label>
                <input
                  placeholder="أدخل البريد الالكتروني"
                  className="w-100 p-2"
                  type="email"
                  id="name"
                  aria-label="email"
                  {...register("Email", {
                    required: "البريد الالكتروني مطلوب",
                    pattern: {
                      value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g,
                      message: "يجب أن يكون البريد الالكتروني بصيغة صحيحة ",
                    },
                  })}
                />
                {errors.Email && (
                  <span className="text-danger">{errors.Email?.message}</span>
                )}
              </div>
              <button
                type="submit"
                className={`${Style.BttnSubmit} p-3 bg-success `}
              >
                {" "}
                ارسال الرابط
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

export default ForgetPass;
