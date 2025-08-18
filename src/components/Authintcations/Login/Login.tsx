import React, { useContext, useEffect, useState } from "react";
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
import { authEndPoint } from "../../../constant/Const";

type IFormInput = {
  email: string;
  password: string;
  RememberMe: boolean;
};

type LoginResponse = {
  id: number;
  email: string;
  role: string;
  phone: string;
  name: string;
  Token: string;
  message: string;
};

export default function Login() {
  const { userData, saveUserData } = useContext<any>(AuthContext);
  const [visible, setVisible] = useState<boolean>(true);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IFormInput>({
    defaultValues: {
      email: "",
      password: "",
      RememberMe: false,
    },
    mode: "all",
  });
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      const response = await axios.post<LoginResponse>(
        authEndPoint.Login,
        data
      );
      // استدعاء `login` من `AuthContext`
      const token = response?.data?.Token;
      // حفظ التوكن حسب RememberMe
      if (data.RememberMe) {
        localStorage.setItem("token", token);
        sessionStorage.removeItem("token");
      } else {
        sessionStorage.setItem("token", token);
        localStorage.removeItem("token");
      }
      saveUserData();
      if (watchRemember) {
        // لو RememberMe محددة، ممكن تحفظ بيانات إضافية زي الإيميل أو تفعيل صلاحيات أطول
        localStorage.setItem("remember", "true");

      } else {
        localStorage.removeItem("remember");

      }
      toast.success("مرحبا بك في الشركه الزراعيه ");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data.Errors[0] || "حدث خطأ أثناء تسجيل الدخول"
        );
      }
    }
  };
  useEffect(() => {
    if (userData?.role === "Admin" || userData?.role === "SuperAdmin") {
      navigate("/admin");
    } else if (userData?.role === "User") {
      navigate("/");

    } 
    else {
      navigate("/auth");
    }
  }, [userData, navigate]);
  const watchRemember = watch("RememberMe");
  useEffect(() => {
    console.log("هل تم تحديد تذكرني؟", watchRemember);
  }, [watchRemember]);

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
              <Link className="link-to" to="/auth/register">
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

              <div className={Style.heroAction}>
                <Link className="link-to" to="/auth/forget-password">
                  <span className={`${Style.TitleNavigate}`}>
                    نسيت كلمة المرور!
                  </span>
                </Link>
                <div className={`${Style.herorememberme}`}>
                  <TextFeild
                    label=""
                    type="checkbox"
                    aria-label="RememberMe"
                    className={Style.chickRemember}
                    {...register("RememberMe")}
                    error={errors?.RememberMe?.message}
                  />
                  <label className={Style.chicklable} htmlFor="RememberMe">
                    تذكر
                  </label>
                </div>
              </div>
              <button
                type="submit"
                className={`${Style.BttnSubmit} p-3 bg-success `}
              >
                {" "}
                تسجيل الدخول
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
