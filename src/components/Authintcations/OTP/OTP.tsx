import React from "react";
import Style from "./style/OTP.module.css";
import imagelogo from "../../../assets/صورة_واتساب_بتاريخ_2024-11-10_في_22.53.07_158af9f7-removebg-preview.png";
import HeroImageSvg from "../../../assets/svg/svgHeroimage.svg";
import { Link, useNavigate } from "react-router-dom";
import TextFeild from "../../shared/utils/TextFeild";
import { useForm } from "react-hook-form";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { authEndPoint } from "../../../constant/Const";

export default function OTP() {
  type IFormInput = {
    Email: string;
    otp: string;
  };

  type ResendOTP = {
    Email: string;
    isForResetPassword: boolean;
  };

  const [expiredOTP, setExpiredOTP] = React.useState(false);
  const [loadingResend, setLoadingResend] = React.useState(false);
  const [loadingSubmit, setLoadingSubmit] = React.useState(false);
  
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    setValue,
    setFocus,
    watch,
    formState: { errors },
  } = useForm<IFormInput>({
    defaultValues: {
      Email: "",
      otp: "",
    },
    mode: "all",
  });

  // مراقبة قيمة الإيميل
  const watchedEmail = watch("Email");

  const handleResendOTP = async () => {
    // التحقق من وجود إيميل
    if (!watchedEmail) {
      toast.error("يرجى إدخال البريد الإلكتروني أولاً");
      return;
    }

    // منع الإرسال المتكرر
    if (loadingResend) {
      toast.warning("جاري الإرسال، يرجى الانتظار...");
      return;
    }

    setLoadingResend(true);
    
    try {
      const resendData: ResendOTP = {
        Email: watchedEmail,
        isForResetPassword: false,
      };

      console.log("إرسال طلب إعادة إرسال OTP:", resendData);

      const response = await axios.post(
        authEndPoint.ResendOtp,
        resendData
      );

      console.log("استجابة إعادة إرسال OTP:", response.data);

      if (response.data.successed) {
        toast.success("تم إرسال رمز تحقق جديد إلى بريدك الإلكتروني");
        setExpiredOTP(false);
        setValue("otp", "");
        setFocus("otp");
      } else {
        toast.error("حدث خطأ أثناء إعادة إرسال رمز التحقق");
      }
    } catch (error) {
      console.error("خطأ في إعادة إرسال OTP:", error);
      
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response?.data && typeof axiosError.response.data === 'object') {
          const errorData = axiosError.response.data as any;
          if (errorData.Errors && Array.isArray(errorData.Errors) && errorData.Errors.length > 0) {
            toast.error(errorData.Errors[0]);
          } else if (errorData.message) {
            toast.error(errorData.message);
          } else {
            toast.error("حدث خطأ أثناء إعادة إرسال رمز التحقق");
          }
        } else {
          toast.error("حدث خطأ في الاتصال");
        }
      } else {
        toast.error("حدث خطأ غير متوقع");
      }
    } finally {
      setLoadingResend(false);
    }
  };

  const onSubmit = async (data: IFormInput) => {
    // منع الإرسال المتكرر
    if (loadingSubmit) {
      toast.warning("جاري المعالجة، يرجى الانتظار...");
      return;
    }

    setLoadingSubmit(true);
    
    try {
      console.log("إرسال طلب التحقق من OTP:", data);

      const response = await axios.post(
        authEndPoint.Verify,
        data
      );

      console.log("استجابة التحقق من OTP:", response.data);

      if (response.data.successed) {
        toast.success("تم تأكيد الحساب بنجاح");
        navigate("/auth");
      } else {
        toast.error("فشل في تأكيد الحساب");
      }
    } catch (error) {
      console.error("خطأ في التحقق من OTP:", error);
      
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response?.data && typeof axiosError.response.data === 'object') {
          const errorData = axiosError.response.data as any;
          
          if (errorData.successed === false) {
            setExpiredOTP(true);
            toast.error("رمز التحقق منتهي الصلاحية، يرجى إعادة إرساله");
          } else if (errorData.Errors && Array.isArray(errorData.Errors) && errorData.Errors.length > 0) {
            toast.error(errorData.Errors[0]);
          } else if (errorData.message) {
            toast.error(errorData.message);
          } else {
            toast.error("حدث خطأ في التحقق من رمز التحقق");
          }
        } else {
          toast.error("حدث خطأ في الاتصال");
        }
      } else {
        toast.error("حدث خطأ غير متوقع");
      }
    } finally {
      setLoadingSubmit(false);
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
            <h1>خطوه واحده !</h1>
            <p>اكد هذا الحساب لكي تستطيع ان تصل اليه في اي وقت</p>
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
              <h3>نشط حسابك</h3>
              <Link className="link-to" to="/auth">
                <p className={`${Style.TitleNavigate}`}> سجل من هنا !</p>
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
                error={errors?.Email?.message}
                {...register("Email", {
                  required: "البريد الالكتروني مطلوب",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "يجب أن يكون البريد الالكتروني بصيغة صحيحة",
                  },
                })}
              />
              <TextFeild
                label="رمز التحقق"
                placeholder="أدخل رمز التحقق"
                type="text"
                id="otp"
                error={errors?.otp?.message}
                {...register("otp", {
                  required: "رمز التحقق مطلوب",
                  pattern: {
                    value: /^[0-9]{6}$/,
                    message: "يجب أن يكون رمز التحقق مكونًا من 6 أرقام",
                  },
                })}
              />

              {/* زر إعادة إرسال OTP */}
              <div className="d-flex justify-content-center">
                {expiredOTP ? (
                  <button
                    type="button"
                    className={`${Style.resendButton} ${loadingResend ? Style.disabled : ''}`}
                    onClick={handleResendOTP}
                    disabled={loadingResend}
                  >
                    {loadingResend ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        جاري الإرسال...
                      </>
                    ) : (
                      "إعادة إرسال رمز التحقق"
                    )}
                  </button>
                ) : (
                  <button
                    type="button"
                    className={`${Style.resendButton} ${Style.secondary}`}
                    onClick={handleResendOTP}
                    disabled={loadingResend || !watchedEmail}
                  >
                    {loadingResend ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        جاري الإرسال...
                      </>
                    ) : (
                      "إعادة إرسال رمز التحقق"
                    )}
                  </button>
                )}
              </div>
              <button
                type="submit"
                className={`${Style.BttnSubmit} p-3 ${loadingSubmit ? Style.disabled : ''}`}
                disabled={loadingSubmit}
              >
                {loadingSubmit ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    جاري التفعيل...
                  </>
                ) : (
                  "تفعيل الحساب"
                )}
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
