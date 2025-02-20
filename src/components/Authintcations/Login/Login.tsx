// import React, { useContext, useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { SubmitHandler, useForm } from "react-hook-form";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { AuthContext } from "../../../context/Context";
// import Style from "../Login/Login.module.css";
// import imagelogo from "../../../assets/صورة_واتساب_بتاريخ_2024-11-10_في_22.53.07_158af9f7-removebg-preview.png";
// import HeroImageSvg from "../../../assets/svg/svgHeroimage.svg";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
// interface IFormInput {
//   email: string;
//   password: string;
// }

// interface LoginResponse {
//   token: string;
// }

// export default function Login() {
//   const [visible, Setvisible] = useState<boolean>(true);
//   const { isAuthenticated, login, role } = useContext(AuthContext);

//   const navigate = useNavigate();

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<IFormInput>({
//     defaultValues: {
//       email: "",
//       password: "",
//     },
//     mode: "all",
//   });

//   const onSubmit: SubmitHandler<IFormInput> = async (data) => {
//     try {
//       const response = await axios.post(
//         "https://projectplant-production.up.railway.app/api/v1/auth/admin/Login",
//         data
//       );

//       console.log("Backend Response:", response);

//       // Store token in localStorage
//       localStorage.setItem("token", response.data.token);
//       console.log(response.data.token);
//       // Show success toast
//       toast.success("تم تسجيل الدخول بنجاح!");

//       // Navigate to the dashboard
//       navigate("/");
//     } catch (error) {
//       console.error("Error during login:", error);

//       // Handle Axios errors
//       if (axios.isAxiosError(error)) {
//         // Display the error message from the backend
//         toast.error(
//           error.response?.data?.message || "حدث خطأ أثناء تسجيل الدخول"
//         );
//       } else {
//         // Handle generic errors
//         toast.error("حدث خطأ غير متوقع أثناء تسجيل الدخول", {
//           position: "top-right",
//           autoClose: 5000, // Close after 5 seconds
//         });
//       }
//     }
//   };
//   // Redirect if the user is already logged in
//   useEffect(() => {
//     if (isAuthenticated) {
//       navigate("/dashboard"); // Redirect to dashboard if logged in
//     }
//   }, [isAuthenticated, navigate]);

import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "../../../context/Context"; // استخدام `useAuth` بدل `AuthContext`
import Style from "../Login/Login.module.css";
import imagelogo from "../../../assets/صورة_واتساب_بتاريخ_2024-11-10_في_22.53.07_158af9f7-removebg-preview.png";
import HeroImageSvg from "../../../assets/svg/svgHeroimage.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";

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
  const { userData, saveUserData } = useContext<any>(AuthContext);
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
        <div className="  w-50 d-flex flex-column flex-grow-1 ">
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
              <div className="w-100 d-flex flex-column">
                <label htmlFor="email">البريد الالكتروني</label>
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
                  <span className="text-danger">{errors.email.message}</span>
                )}
              </div>
              <div className="w-100 d-flex flex-column position-relative">
                <label htmlFor="name">كلمة المرور</label>
                <input
                  placeholder="أدخل كلمة المرور"
                  className="w-100 p-2"
                  type={visible ? "password" : "text"}
                  id="password"
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
                  onClick={() => setVisible(!visible)}
                  className={Style.IconEye}
                />
              </div>
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
