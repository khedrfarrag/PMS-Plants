import React from "react";
import { Helmet } from "react-helmet-async";

// Import local styles and assets
import Style from "./Style/Style.module.css";
import img from "./Style/img/aboutus.svg";
import imgVision from "./Style/img/ourfocus.svg";
import imgService1 from "./Style/img/distruction.svg";
import imgService2 from "./Style/img/green.svg";
import imgWhy1 from "./Style/img/seal.svg";
import imgWhy2 from "./Style/img/sevise.svg";
import imgWhy3 from "./Style/img/payment.svg";
import imgWhy4 from "./Style/img/visetor.svg";

// Import team member images
import imgMember1 from "./img/م حامد.jpg";
import imgMember2 from "./img/FB_IMG_1754312691134.jpg";
import imgMember3 from "./img/FB_IMG_1754312749856.jpg";

// --- Data for Team Members ---
const teamMembers = [
  {
    name: "المهندس / حامد محمد عبدالعزيز",
    position: "المدير التنفيذي للشركة الخليجية",
    image: imgMember1,
    phone: "+201080031628",
    whatsapp: "+201080031628",
    facebook: "https://facebook.com",
    email: "hamed.abdelaziz@example.com",
  },
  {
    name: "الدكتور / أحمد الشافعي",
    position: "رئيس مجلس إدارة الشركة الخليجية",
    image: imgMember2,
    phone: "+201154211644",
    whatsapp: "+201154211644",
    facebook: "https://facebook.com",
    email: "ahmed.elshafei@example.com",
  },
  {
    name: "المهندس / عطيه المحص",
    position: "مدير خدمة تساهيل للتصنيع الزراعي",
    image: imgMember3,
    phone: "+201070778896",
    whatsapp: "+201070778896",
    facebook: "https://facebook.com",
    email: "atieh.elmohs@example.com",
  },
];

// --- Reusable Team Member Card Component (Styled, No Animation) ---
const TeamMemberCard = ({ member }) => {
  return (
    <div className={Style.teamCard}>
      <div className={Style.cardImageContainer}>
        <img src={member.image} alt={member.name} className={Style.cardImage} />
      </div>
      <div className={Style.cardContent}>
        <h3 className={Style.cardTitle}>{member.name}</h3>
        <p className={Style.cardPosition}>{member.position}</p>
        <div className={Style.contactInfo}>
          <div className={Style.contactLinks}>
            <a href={`tel:${member.phone}`} className={Style.phoneButton} aria-label="Phone">
              <i className="fas fa-phone-alt"></i>
            </a>
            <a
              href={`https://wa.me/${member.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className={Style.whatsappButton}
              aria-label="WhatsApp"
            >
              <i className="fab fa-whatsapp"></i>
            </a>
            <a
              href={member.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className={Style.facebookButton}
              aria-label="Facebook"
            >
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href={`mailto:${member.email}`} className={Style.gmailButton} aria-label="Email">
              <i className="fas fa-envelope"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main About Component ---
function About() {
  return (
    <>
      <Helmet>
        <title>من نحن - الخليجية للتنمية الزراعية</title>
        <meta
          name="description"
          content="تعرف على الشركة الخليجية للتنمية الزراعية، رؤيتنا، خدماتنا، وفريق خبرائنا المتخصص في تقديم أفضل الحلول الزراعية."
        />
      </Helmet>

      <div className={Style.aboutPage}>
        {/* ... Other sections ... */}
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

        <section className={Style.visionSection}>
          <div className={Style.imageContent}>
            <img src={imgVision} alt="Vision" />
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
                <img src={imgService1} alt="Service 1" />
                استصلاح أراضي
              </div>
              <div className={Style.Service2}>
                <img src={imgService2} alt="Service 2" />
                تصنيع العلف
              </div>
            </div>
          </div>
        </section>

        <section className={Style.whyUsSection}>
          <h1>لماذا نحن؟!</h1>
          <div className={Style.whyUsGrid}>
            <div className={Style.whyUsItem}>
              <img src={imgWhy1} alt="24-hour service" />
              <p>خدمة 24 ساعة</p>
            </div>
            <div className={Style.whyUsItem}>
              <img src={imgWhy2} alt="Offers and discounts" />
              <p>عروض وخصومات</p>
            </div>
            <div className={Style.whyUsItem}>
              <img src={imgWhy3} alt="Electronic payment grants" />
              <p>متاح دفع إلكتروني</p>
            </div>
            <div className={Style.whyUsItem}>
              <img src={imgWhy4} alt="Field visit booking" />
              <p>حجز زيارة ميدانية</p>
            </div>
          </div>
        </section>

        {/* Team Section with local styles */}
        <section className={Style.teamSection}>
            <h1>خبراء الزراعة لدينا</h1>
            <p className={Style.subtitle}>
                فريق من المتخصصين لمساعدتك في اختيار أفضل المنتجات وتقديم النصائح
                لضمان زراعة ناجحة ومحاصيل مثمرة.
            </p>
            <div className={Style.teamContainer}>
                {teamMembers.map((member, index) => (
                    <TeamMemberCard key={index} member={member} />
                ))}
            </div>
        </section>
      </div>
    </>
  );
}

export default About;