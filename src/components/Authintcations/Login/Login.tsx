import React, { useContext, useEffect, useState } from "react";
import photo from "../../../assets/login.png";
import logo from "../../../assets/صورة واتساب بتاريخ 2024-11-10 في 22.53.07_158af9f7 1.png";
import { Link, useNavigate } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import { toast} from "react-toastify";
import { AuthContext } from "../../../context/Context";

interface IFormInput {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
}

export default function Login() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { isAuthenticated } = useContext(AuthContext);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      const response = await axios.post<LoginResponse>(
        "https://projectplant-production.up.railway.app/api/v1/auth/user/Login",
        data
      );

      console.log("Backend Response:", response);

      // Store token in localStorage
      localStorage.setItem("userToken", response.data.token);

      // Show success toast
      toast.success("تم تسجيل الدخول بنجاح!");

      // Navigate to the dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Error during login:", error);

      // Handle Axios errors
      if (axios.isAxiosError(error)) {
        // Display the error message from the backend
        toast.error(
          error.response?.data?.message || "حدث خطأ أثناء تسجيل الدخول",
        );
      } else {
        // Handle generic errors
        toast.error("حدث خطأ غير متوقع أثناء تسجيل الدخول", {
          position: "top-right",
          autoClose: 5000, // Close after 5 seconds
        });
      }
    }
  };
// Redirect if the user is already logged in
useEffect(() => {
  if (isAuthenticated) {
    navigate("/dashboard"); // Redirect to dashboard if logged in
  }
}, [isAuthenticated, navigate]);
  return (
    <>
      <div className="container-fluid vh-100">
        <div className="row h-100 " style={{ overflow: "hidden" }}>
          <div
            className="col-md-6  d-none d-md-flex align-items-center justify-content-center bg-light"
            style={{ maxHeight: "100vh", minHeight: "100vh" }}
          >
            <div className="main-img ">
              <img
                src={photo}
                alt="logo-photo"
                className="img-fluid  "
                style={{ maxHeight: "90vh" }}
              />
            </div>
          </div>

          <div
            className="col-md-6 d-flex align-items-center justify-content-center"
            style={{ maxHeight: "100vh", overflowY: "auto" }}
          >
            <div className="w-100 p-4" style={{ maxWidth: "400px" }}>
              <div className="img text-center mb-4 ">
                <img src={logo} alt="logo-img" className="img-fluid" style={{ width: "100px" }} />
              </div>

              <div className="text-center p-4">
                <h2>سجل دخول</h2>
                <h3>اذا لم يكن لديك حساب تسطتيع </h3>
                <Link className="link-to" to="/register">
                  انشاء حساب !
                </Link>
              </div>

              <form action="" dir="rtl" onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3 pt-4">
                  <label htmlFor="email" className="form-label">
                    البريد الالكتروني
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="form-control"
                    placeholder="ادخل البريد الالكتروني"
                    autoComplete="email"
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

                <div className="mb-3 pt-4">
                  <label htmlFor="password" className="form-label">
                    الرقم السري
                  </label>
                  <div className="input-group">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      className="form-control"
                      autoComplete="current-password"
                      placeholder="ادخل الرقم السري"
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
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="input-group-text"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      <i
                        className={`fa-regular ${
                          showPassword ? "fa-eye-slash" : "fa-eye"
                        }`}
                      ></i>
                    </button>
                  </div>
                  {errors.password && (
                    <span className="text-danger">
                      {errors.password.message}
                    </span>
                  )}
                </div>

                <Link className="link-to" to="/auth/forget-password">
                  نسيت كلمة المرور ؟
                </Link>

                <button className="btn d-block w-100 border-0 border-4 mt-4">
                  تسجيل الدخول
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
     
    </>
  );
}
