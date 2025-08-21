import { useContext } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";

import { AuthContext } from "../../../context/Context";
import { contactMessagesPoint } from "../../../constant/Const";
import styles from "./Style/ContactUs.module.css";
import { Helmet } from "react-helmet-async";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

function ContactUs() {
  const location = useLocation();
  const state = location?.state as {
    serviceType: string;
    userType: string;
  } | null;
  console.log("ContactUs state:", state);
  const { userData }: any = useContext(AuthContext);
  const navigate = useNavigate();

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
      UserId: userData?.userId || null,
      User_type: state?.userType || "",
      Service_type: state?.serviceType || "",
      Government: "",
      Address: "",
    },
    mode: "onSubmit",
  });

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(contactMessagesPoint.Post, data, {
        headers: {
          Authorization: `Bearer ${
            localStorage.getItem("token") || sessionStorage.getItem("token")
          }`,
        },
      });
      reset();
      toast.success(response.data.message || "تم إرسال رسالتك بنجاح!");
      navigate("/");
    } catch (error) {
      toast.error(
        error.response?.data?.Errors?.[0] || "حدث خطأ أثناء إرسال الرسالة."
      );
    }
  };

  return (
    <>
      <Helmet>
        <title>تواصل معنا - الخليجية للمبيدات والكيماويات</title>
        <meta
          name="description"
          content="هل لديك سؤال أو استفسار؟ تواصل مع فريق الخليجية. نحن هنا لمساعدتك في كل ما يتعلق بالحلول الزراعية."
        />
      </Helmet>
      <div className={styles.contactPage}>
        <motion.div
          className={styles.contactContainer}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Form Section */}
          <motion.div
            className={styles.formSection}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <form
              className={styles.contactForm}
              onSubmit={handleSubmit(onSubmit)}
              noValidate
            >
              <div className={styles.formRow}>
                <motion.div
                  className={styles.formField}
                  variants={itemVariants}
                >
                  <label className={styles.label}>الاسم الكامل</label>
                  <input
                    type="text"
                    {...register("Name", { required: "الاسم مطلوب" })}
                    className={styles.input}
                  />
                  {errors.Name && (
                    <p className={styles.errorMessage}>{errors.Name.message}</p>
                  )}
                </motion.div>
                <motion.div
                  className={styles.formField}
                  variants={itemVariants}
                >
                  <label className={styles.label}>البريد الإلكتروني</label>
                  <input
                    type="email"
                    {...register("Email", {
                      required: "بريد إلكتروني صالح مطلوب",
                      pattern: {
                        value: /\S+@\S+\.\S+/,
                        message: "صيغة البريد الإلكتروني غير صحيحة",
                      },
                    })}
                    className={styles.input}
                  />
                  {errors.Email && (
                    <p className={styles.errorMessage}>
                      {errors.Email.message}
                    </p>
                  )}
                </motion.div>
              </div>

              <div className={styles.formRow}>
                <motion.div
                  className={styles.formField}
                  variants={itemVariants}
                >
                  <label className={styles.label}>نوع المستخدم</label>
                  <select
                    {...register("User_type", {
                      required: "نوع المستخدم مطلوب",
                    })}
                    className={styles.select}
                  >
                    <option value="">اختر نوعك...</option>
                    <option value="مزارع">مزارع</option>
                    <option value="تاجر">تاجر</option>
                  </select>
                  {errors.User_type && (
                    <p className={styles.errorMessage}>
                      {errors.User_type.message}
                    </p>
                  )}
                </motion.div>
                <motion.div
                  className={styles.formField}
                  variants={itemVariants}
                >
                  <label className={styles.label}>نوع الخدمة</label>
                  <select
                    {...register("Service_type", {
                      required: "نوع الخدمة مطلوب",
                    })}
                    className={styles.select}
                  >
                    <option value="">اختر الخدمة...</option>
                    <option value="زياره">زيارة مجانية</option>
                    <option value="دعم فني">دعم فني</option>
                    <option value="استصلاح">استصلاح</option>
                    <option value="تساهيل">تساهيل</option>
                  </select>
                  {errors.Service_type && (
                    <p className={styles.errorMessage}>
                      {errors.Service_type.message}
                    </p>
                  )}
                </motion.div>
              </div>

              <div className={styles.formRow}>
                <motion.div
                  className={styles.formField}
                  variants={itemVariants}
                >
                  <label className={styles.label}>رقم الهاتف</label>
                  <input
                    type="tel"
                    {...register("Phone", { required: "رقم الهاتف مطلوب" })}
                    className={styles.input}
                  />
                  {errors.Phone && (
                    <p className={styles.errorMessage}>
                      {errors.Phone.message}
                    </p>
                  )}
                </motion.div>
                <motion.div
                  className={styles.formField}
                  variants={itemVariants}
                >
                  <label className={styles.label}>المحافظة</label>
                  <select
                    {...register("Government", {
                      required: "يرجى اختيار محافظتك",
                    })}
                    className={styles.select}
                  >
                    <option value="">اختر محافظتك...</option>
                    <option value="cairo">القاهرة</option>
                    <option value="giza">الجيزة</option>
                    {/* Add other governorates */}
                  </select>
                  {errors.Government && (
                    <p className={styles.errorMessage}>
                      {errors.Government.message}
                    </p>
                  )}
                </motion.div>
              </div>

              <motion.div className={styles.formField} variants={itemVariants}>
                <label className={styles.label}>العنوان بالتفصيل</label>
                <input
                  type="text"
                  {...register("Address", { required: "العنوان مطلوب" })}
                  className={styles.input}
                />
                {errors.Address && (
                  <p className={styles.errorMessage}>
                    {errors.Address.message}
                  </p>
                )}
              </motion.div>

              <motion.div
                className={styles.formField}
                variants={itemVariants}
                style={{ marginTop: "1.5rem" }}
              >
                <label className={styles.label}>رسالتك</label>
                <textarea
                  {...register("Message", {
                    required: "الرسالة لا يمكن أن تكون فارغة",
                  })}
                  className={styles.textarea}
                ></textarea>
                {errors.Message && (
                  <p className={styles.errorMessage}>
                    {errors.Message.message}
                  </p>
                )}
              </motion.div>

              <motion.button
                type="submit"
                className={styles.submitButton}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ marginTop: "1.5rem" }}
              >
                إرسال الرسالة
              </motion.button>
            </form>
          </motion.div>
          {/* Info Section */}
          <div className={styles.infoSection}>
            <motion.h2 className={styles.infoTitle} variants={itemVariants}>
              هل لديك استفسار؟
            </motion.h2>
            <motion.p className={styles.infoText} variants={itemVariants}>
              املأ النموذج وسيقوم أحد خبرائنا بالتواصل معك في أقرب وقت ممكن. نحن
              هنا لمساعدتك.
            </motion.p>
            <motion.ul
              className={styles.contactDetails}
              variants={itemVariants}
            >
              <li>
                <i className="fas fa-phone-alt"></i> +20 108 003 1628
              </li>
              <li>
                <i className="fas fa-envelope"></i> info@alkhalegiah.com
              </li>
              <li>
                <i className="fas fa-map-marker-alt"></i> كفرالشيخ، دسوق، مصر
              </li>
            </motion.ul>
            <motion.div className={styles.socialIcons} variants={itemVariants}>
              <a href="#">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#">
                <i className="fab fa-instagram"></i>
              </a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </>
  );
}

export default ContactUs;
