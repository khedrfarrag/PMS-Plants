import React, { useContext, useEffect } from "react";
import styles from "./Style/Style.module.css";
import img from "./Style/svg/contactus.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelopesBulk, faPhone } from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../../context/Context";
import axios from "axios";
import { contactMessagesPoint } from "../../../constant/Const";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";

interface Contact {
  Name: string;
  Email: string;
  Phone: string;
  Message: string;
  User_type: string;
  Service_type: string;
  Government: string;
  Address: string;
}
function ContactUs() {
  const location = useLocation();
  const state = location?.state as { serviceType: string; userType: string } | null;
  const { userData }: any = useContext(AuthContext);
  const UserId: string | null = userData?.userId;
  const navigate = useNavigate();
  useEffect(() => {
    const scrolltopPage = () => {
      window.scrollTo({ top: 0 });
    };
    scrolltopPage();
  }, []);
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      Name: "",
      Email: "",
      Phone: "",
      Message: "",
      UserId: !UserId ? null : UserId,
      User_type: state?.userType || "",
      Service_type: state?.serviceType || "",
      Government: "",
      Address: "",
    },
    mode: "onSubmit",
  });
  const onSubmit = async (data: Contact) => {
    console.log(data);
    try {
      const response = await axios.post(contactMessagesPoint.Post, data, {
        headers: {
          Authorization: `Bearer ${
            localStorage.getItem("token") || sessionStorage.getItem("token")
          }`,
        },
      });
      reset();
      toast.success(response.data);
      navigate("/");
    } catch (errors) {
      toast.error(errors.response.data.Errors[0]);
    }
  };

  return (
    <>
      <div className={styles.contactUsContainer}>
        {/* Right Section */}
        <div className={styles.rightSection}>
          <h2 className={styles.title}>تواصل معنا</h2>
          <form
            className={styles.contactForm}
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className={styles.fieldname}>
              <label className={styles.label}>الاسم</label>
              <input
                type="text"
                placeholder="ادخل اسمك "
                className={!errors.Name ? styles.input : styles.error}
                {...register("Name", { required: "الاسم مطلوب" })}
              />
              {errors.Name && (
                <p className={styles.Errormessage}>{errors.Name?.message}</p>
              )}
            </div>
            <div className={styles.fieldchoose}>
              <div className={styles.typeuser}>
                <select
                  aria-label="User_type"
                  id="User_type"
                  className={styles.select}
                  {...register("User_type", { required: "نوع المستخدم مطلوب" })}
                >
                  <option value="" disabled selected>
                    اختر نوع المستخدم
                  </option>
                  <option value="مزارع">مزارع</option>
                  <option value="تاجر">تاجر</option>
                </select>
                {errors.User_type && (
                  <p className={styles.Errormessage}>
                    {errors.User_type?.message}
                  </p>
                )}
              </div>
              <div className={styles.typeuser}>
                <select
                  aria-label="Service_type"
                  id="Service_type"
                  className={styles.select}
                  {...register("Service_type", {
                    required: "نوع الخدمة مطلوب",
                  })}
                >
                  <option value="" disabled selected>
                    اختر نوع الخدمة
                  </option>
                  <option value="زياره"> زيارة مجانيه</option>
                  <option value="دعم فني">دعم فني</option>
                  <option value="استصلاح">استصلاح</option>
                  <option value="تساهيل">تساهيل </option>
                </select>
                {errors.Service_type && (
                  <p className={styles.Errormessage}>
                    {errors.Service_type?.message}
                  </p>
                )}
              </div>
              <div className={styles.address}>
                <select
                  aria-label="Government"
                  id="Government"
                  className={styles.select}
                  {...register("Government", { required: "المدينة مطلوبة" })}
                >
                  <option value="" disabled selected>
                    اختر المحافظه
                  </option>
                  <option value="cairo">القاهرة</option>
                  <option value="giza">الجيزة</option>
                  <option value="alexandria">الإسكندرية</option>
                  <option value="aswan">أسوان</option>
                  <option value="asiyut">أسيوط</option>
                  <option value="beheira">البحيرة</option>
                  <option value="beni-suef">بني سويف</option>
                  <option value="dakahlia">الدقهلية</option>
                  <option value="damietta">دمياط</option>
                  <option value="faiyum">الفيوم</option>
                  <option value="gharbia">الغربية</option>
                  <option value="ismailia">الإسماعيلية</option>
                  <option value="kafr-el-sheikh">كفر الشيخ</option>
                  <option value="luxor">الأقصر</option>
                  <option value="matruh">مطروح</option>
                  <option value="minya">المنيا</option>
                  <option value="monufia">المنوفية</option>
                  <option value="new-valley">الوادي الجديد</option>
                  <option value="north-sinai">شمال سيناء</option>
                  <option value="port-said">بورسعيد</option>
                  <option value="qalyubia">القليوبية</option>
                  <option value="qena">قنا</option>
                  <option value="red-sea">البحر الأحمر</option>
                  <option value="sharqia">الشرقية</option>
                  <option value="sohag">سوهاج</option>
                  <option value="south-sinai">جنوب سيناء</option>
                  <option value="suez">السويس</option>
                </select>
                {errors.Government && (
                  <p className={styles.Errormessage}>
                    {errors.Government?.message}
                  </p>
                )}
              </div>
            </div>
            <div className={styles.fieldLocation}>
              <label className={styles.label}>العنوان</label>
              <input
                type="text"
                placeholder="العنوان"
                className={styles.input}
                {...register("Address", { required: "العنوان مطلوب" })}
              />
              {errors.Address && (
                <p className={styles.Errormessage}>{errors.Address?.message}</p>
              )}
            </div>
            <div className={styles.fieldeboth}>
              <div className={styles.email}>
                <label className={styles.label}>البريد الالكتروني</label>
                <input
                  type="email"
                  placeholder="ادخل بريدك الإلكتروني"
                  className={styles.input}
                  {...register("Email", {
                    required: "البريد الالكتروني مطلوب",
                  })}
                />
                {errors.Email && (
                  <p className={styles.Errormessage}>{errors.Email?.message}</p>
                )}
              </div>
              <div className={styles.phone}>
                <label className={styles.label}>رقم الهاتف</label>
                <input
                  type="phone"
                  placeholder="ادخل رقم هاتفك "
                  className={styles.input}
                  {...register("Phone", {
                    required: "رقم الهاتف مطلوب",
                  })}
                />
                {errors.Phone && (
                  <p className={styles.Errormessage}>{errors.Phone?.message}</p>
                )}
              </div>
            </div>

            <div className={styles.textmessage}>
              <label className={styles.label}> تفاصيل الطلب</label>
              <textarea
                placeholder="ادخل رسالتك"
                className={styles.textarea}
                {...register("Message", {
                  required: "الرسالة مطلوبة",
                })}
              ></textarea>
              {errors.Message && (
                <p className={styles.Errormessage}>{errors.Message?.message}</p>
              )}
            </div>
            <button type="submit" className={styles.submitButton}>
              إرسال
            </button>
          </form>
        </div>
        {/* Left Section */}
        <div className={styles.leftSection}>
          <img src={img} alt="Contact Us" className={styles.contactImage} />
        </div>
      </div>
      {/* Footer Section */}
    </>
  );
}

export default ContactUs;
