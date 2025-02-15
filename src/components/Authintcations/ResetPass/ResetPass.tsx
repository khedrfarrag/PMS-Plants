import React from "react";
import photo from "../../../assets/login.png";
import logo from "../../../assets/صورة واتساب بتاريخ 2024-11-10 في 22.53.07_158af9f7 1.png";
import { Link, useNavigate } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap CSS is imported

function ResetPass() {
  const navigate = useNavigate();
  const [showConfirmPassword, setShowConfirmPassword] = React.useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = React.useState<boolean>(false);

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

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      const response = await axios.post(
        "https://projectplant-production.up.railway.app/api/v1/auth/user/ResetPassword",
        data
      );

      console.log("Backend Response:", response);

      // Show success message
      toast.success("تم إعادة تعيين كلمة المرور بنجاح");

      // Redirect to login page
      navigate("/login");
    } catch (error) {
      console.error("Error during password reset:", error);

      // Display error message to the user
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "حدث خطأ أثناء إعادة تعيين كلمة المرور");
      } else {
        toast.error("حدث خطأ غير متوقع");
      }
    }
  };

  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">
        {/* Image Column (Hidden on Small Screens) */}
        <div className="col-md-6 d-none d-md-flex align-items-center justify-content-center bg-light">
          <img
            src={photo}
            alt="logo-photo"
            className="img-fluid"
            style={{ maxHeight: "90vh" }}
          />
        </div>

        {/* Form Column */}
        <div className="col-md-6 d-flex align-items-center justify-content-center">
          <div className="w-100 p-4" style={{ maxWidth: "400px" }}>
            {/* Logo */}
            <div className="text-center mb-4">
              <img src={logo} alt="logo-img" className="img-fluid" style={{ width: "100px" }} />
            </div>

            {/* Reset Password Form */}
            <form onSubmit={handleSubmit(onSubmit)} dir="rtl">
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  البريد الالكتروني
                </label>
                <input
                  type="email"
                  id="email"
                  className="form-control"
                  placeholder="ادخل البريد الالكتروني"
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

              <div className="mb-3">
                <label htmlFor="code" className="form-label">
                  الرقم المتغير
                </label>
                <input
                  type="text"
                  id="code"
                  className="form-control"
                  placeholder="ادخل الرقم المتغير"
                  {...register("code", {
                    required: "الرقم المتغير مطلوب",
                  })}
                />
                {errors.code && (
                  <span className="text-danger">{errors.code.message}</span>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="newPassword" className="form-label">
                  كلمة المرور الجديدة
                </label>
                <div className="input-group">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    id="newPassword"
                    className="form-control"
                    placeholder="ادخل رقم سري جديد"
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
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={toggleNewPasswordVisibility}
                    aria-label={showNewPassword ? "Hide password" : "Show password"}
                  >
                    <i
                      className={`fa-regular ${
                        showNewPassword ? "fa-eye-slash" : "fa-eye"
                      }`}
                    ></i>
                  </button>
                </div>
                {errors.newPassword && (
                  <span className="text-danger">{errors.newPassword.message}</span>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="confirmPassword" className="form-label">
                  تاكيد كلمة المرور
                </label>
                <div className="input-group">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    className="form-control"
                    placeholder="تاكيد كلمة المرور"
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
                        value === watch("newPassword") || "كلمات المرور غير متطابقة",
                    })}
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={toggleConfirmPasswordVisibility}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    <i
                      className={`fa-regular ${
                        showConfirmPassword ? "fa-eye-slash" : "fa-eye"
                      }`}
                    ></i>
                  </button>
                </div>
                {errors.confirmPassword && (
                  <span className="text-danger">{errors.confirmPassword.message}</span>
                )}
              </div>

              <button type="submit" className="btn btn-primary w-100">
                إعادة تعيين كلمة المرور
              </button>
            </form>

            {/* Login Link */}
            <div className="text-center mt-3">
              <span>تذكرت كلمة المرور؟ </span>
              <Link to="/login" className="text-decoration-none">
                تسجيل الدخول
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPass;