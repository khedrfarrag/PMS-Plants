import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "../../../context/Context"; // استخدام `useAuth` بدل `AuthContext`
import Style from "../Login/Login.module.css";
import imagelogo from "../../../assets/صورة_واتساب_بتاريخ_2024-11-10_في_22.53.07_158af9f7-removebg-preview.png";
import HeroImageSvg from "../../../assets/svg/svgHeroimage.svg";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import TextFeild from "../../shared/utils/TextFeild";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type IFormInput = {
  email: string;
  password: string;
};

type LoginResponse = {
  payload: {
    id: number;
    email: string;
    role: string;
    phone: string;
    name: string;
  };
  token: string;
};

export default function Login() {
  const { saveUserData } = useContext<any>(AuthContext);
  const [visible, setVisible] = useState<boolean>(true);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "all",
  });

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      const response = await axios.post<LoginResponse>(
        "https://projectplant-production.up.railway.app/api/v1/auth/admin/Login",
        // "https://projectplant-production.up.railway.app/api/v1/auth/user/Login",
        data
      );

      // استدعاء `login` من `AuthContext`
      console.log(response?.data?.token);
      console.log(response?.data?.payload.role);

      const token = response?.data?.token;
      localStorage.setItem("token", token);
      saveUserData();
      // console.log(userData?.payload?.role);
      if (response?.data?.payload.role === "Admin") {
        navigate("/admin");
      } else if (response?.data?.payload.role === "User") {
        navigate("/");
      } else {
        navigate("/auth");
      }
    } catch (error) {
      console.error("Error during login:", error);

      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "حدث خطأ أثناء تسجيل الدخول"
        );
      } else {
        toast.error("حدث خطأ غير متوقع أثناء تسجيل الدخول");
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
            <h1>مرحبًا بعودتك!</h1>
            <p>سجل دخولك للوصول إلى حسابك وإدارة مشترياتك بسهولة</p>
          </div>
        </div>
        <div className="  w-50 d-flex flex-column flex-grow-1 p-2 ">
          <div className=" w-100  position-relative">
            <img
              src={imagelogo}
              alt="logo"
              className={`${Style.LogoCampony}`}
            />
            <div className=" w-75 m-auto mt-5 ">
              <h3>سجل دخول</h3>
              <p>اذا لم يكن لديك حساب تستطيع </p>
              <Link className="link-to" to="register">
                <p className={`${Style.TitleNavigate}`}> انشاء حساب من هنا !</p>
              </Link>
            </div>
          </div>
          <form className="w-100" onSubmit={handleSubmit(onSubmit)}>
            <div className=" w-75  d-flex flex-column m-auto gap-1 mt-5 ">
              <TextFeild
                label="البريد الالكتروني"
                placeholder="أدخل البريد الالكتروني"
                type="email"
                id="email"
                error={errors?.email?.message}
                {...register("email", {
                  required: "البريد الالكتروني مطلوب",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "يجب أن يكون البريد الالكتروني بصيغة صحيحة",
                  },
                })}
              />
              <TextFeild
                label="كلمة المرور"
                placeholder="أدخل كلمة المرور"
                type={visible ? "password" : "text"}
                id="password"
                error={errors?.password?.message}
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
                starticon={
                  <FontAwesomeIcon
                    icon={visible ? faEyeSlash : faEye}
                    onClick={() => setVisible(!visible)}
                    className={Style.IconEye}
                  />
                }
              />
              <div className="">
                <Link className="link-to" to="/auth/forget-password">
                  <span className={`${Style.TitleNavigate}`}>
                    نسيت كلمة المرور!
                  </span>
                </Link>
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
