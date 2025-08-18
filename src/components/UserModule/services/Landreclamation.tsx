import React from "react";
import Style from "./style/style.module.css";

export default function Landreclamation() {
  return (
    <div className={Style.landReclamationPage}>
      {/* Hero Section */}
      <div className={Style.heroSection}>
        <div className={Style.heroContent}>
          <h1 className={Style.heroTitle}>خدمة استصلاح الأراضي</h1>
          <p className={Style.heroDescription}>
            تحويل الأراضي غير الصالحة إلى أراضي زراعية منتجة
          </p>
          <div className={Style.comingSoonBadge}>قريباً</div>
        </div>
      </div>
      
      {/* Services Preview */}
      <div className={Style.servicesPreview}>
        <h2 className={Style.servicesTitle}>الخدمات التي سنقدمها:</h2>
        <div className={Style.servicesList}>
          <div className={Style.serviceItem}>
            <span className={Style.serviceIcon}>🔬</span>
            <p className={Style.serviceText}>تحليل التربة وتشخيص المشاكل</p>
          </div>
          <div className={Style.serviceItem}>
            <span className={Style.serviceIcon}>🧂</span>
            <p className={Style.serviceText}>إزالة الأملاح الزائدة</p>
          </div>
          <div className={Style.serviceItem}>
            <span className={Style.serviceIcon}>💧</span>
            <p className={Style.serviceText}>تحسين نظام الصرف</p>
          </div>
          <div className={Style.serviceItem}>
            <span className={Style.serviceIcon}>🌱</span>
            <p className={Style.serviceText}>إضافة الأسمدة العضوية</p>
          </div>
        </div>
      </div>
      
      {/* Notification Form */}
      <div className={Style.notificationForm}>
        <div className={Style.formContainer}>
          <h3 className={Style.formTitle}>أخبرنا عند الإطلاق</h3>
          <p className={Style.formDescription}>
            سجل بريدك الإلكتروني لتصلك إشعارات عند إطلاق الخدمة
          </p>
          <div className={Style.formGroup}>
            <input 
              type="email" 
              placeholder="البريد الإلكتروني" 
              className={Style.formInput}
            />
            <button className={Style.formButton}>إشعار عند الإطلاق</button>
          </div>
        </div>
      </div>
    </div>
  );
}
