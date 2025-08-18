import React from "react";
import Style from "./Style/Style.module.css";
import img from "./Style/img/aboutus.svg";
import img2 from "./Style/img/distruction.svg";
import img3 from "./Style/img/green.svg";
import im4 from "./Style/img/ourfocus.svg";
import im5 from "./Style/img/seal.svg";
import im6 from "./Style/img/sevise.svg";
import im7 from "./Style/img/payment.svg";
import im8 from "./Style/img/visetor.svg";
import teamImg from "../../../assets/svg/userimg.svg"; // Replace with actual image paths

function About() {
  return (
    <div className={Style.aboutPage}>
      {/* Introduction Section */}
      <section className={Style.introSection}>
        <div className={Style.textContent}>
          <h1>من نحن</h1>
          <p>
            مرحبًا بك في الخليجية للتنمية الزراعية، وجهتك الأولى لكل ما تحتاجه
            في عالم الزراعة. نحن متخصصون في توفير الأدوات، البذور، والمعدات
            بجودة عالية وأسعار تنافسية.
          </p>
        </div>
        <div className={Style.imageContent}>
          <img src={img} alt="Introduction" />
        </div>
      </section>

      {/* Vision Section */}
      <section className={Style.visionSection}>
        <div className={Style.imageContent}>
          <img src={im4} alt="Vision" />
        </div>
        <div className={Style.textContent}>
          <h1>رؤيتنا</h1>
          <p>
            نطمح إلى أن نكون الشريك الأول للمزارعين والمهتمين بالزراعة من خلال
            تقديم حلول مبتكرة تساهم في تطوير القطاع الزراعي وتحقيق الأمن
            الغذائي.
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section className={Style.servicesSection}>
        <div className={Style.textContentservice}>
          <div className={Style.textsevice}>
            <h1>الخدمات</h1>
            <p>
              نوفر لك كل ما تحتاجه للزراعة من أدوات، بذور، ومعدات بجودة عالية.
              خدماتنا تشمل استصلاح الأراضي وتصنيع العلف.
            </p>
          </div>
          <div className={Style.serviceButtons}>
            <div className={Style.Service1}>
              <img src={img2} alt="Service 1" />
              استصلاح أراضي
            </div>
            <div className={Style.Service2}>
              <img src={img3} alt="Service 2" />
              تصنيع العلف
            </div>
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section className={Style.whyUsSection}>
        <h1>لماذا نحن؟!</h1>
        <div className={Style.whyUsGrid}>
          <div className={Style.whyUsItem}>
            <img src={im5} alt="24-hour service" />
            <p>خدمة 24 ساعة</p>
          </div>
          <div className={Style.whyUsItem}>
            <img src={im6} alt="Offers and discounts" />
            <p>عروض وخصومات</p>
          </div>
          <div className={Style.whyUsItem}>
            <img src={im7} alt="Electronic payment grants" />
            <p>متاح دفع إلكتروني</p>
          </div>
          <div className={Style.whyUsItem}>
            <img src={im8} alt="Field visit booking" />
            <p>حجز زيارة ميدانية</p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className={Style.teamSection}>
        <h1>خبراء الزراعة لدينا</h1>
        <p>
          فريق من المتخصصين لمساعدتك في اختيار أفضل المنتجات وتقديم النصائح
          لضمان زراعة ناجحة ومحاصيل مثمرة.
        </p>
        <div className={Style.teamGrid}>
          {[1, 2, 3].map((item) => (
            <div key={item} className={Style.teamCard}>
              <img src={teamImg} alt="Team Member" />
              <h3>حامد محمد حامد</h3>
              <p>مهندس زراعي</p>
              <p>
                متخصص في زراعة المحاصيل العضوية وإدارة نظم الري الحديثة مع خبرة
                طويلة في استراتيجيات زراعية مستدامة.
              </p>
              <div className={Style.socialIcons}>
                <a href="#facebook" aria-label="Facebook">
                  <i className="fab fa-facebook"></i>
                </a>
                <a href="#twitter" aria-label="Twitter">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#linkedin" aria-label="LinkedIn">
                  <i className="fab fa-linkedin"></i>
                </a>
              </div>
            </div>
            // {/* Duplicate the above card for additional team members */}
          ))}
        </div>
      </section>
    </div>
  );
}

export default About;
