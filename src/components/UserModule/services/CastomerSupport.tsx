import React from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

import Style from "./style/CustomerSupport.module.css";

// Import images
import img1 from "./img/م حامد.jpg";
import img2 from "./img/FB_IMG_1754312691134.jpg";
import img3 from "./img/FB_IMG_1754312749856.jpg";

const supportTeam = [
  {
    name: "المهندس / عطيه المحص",
    position: "مدير خدمة تساهيل لخدمات التصنيع الزراعي",
    image: img3,
    phone: "+201070778896",
    whatsapp: "+201070778896",
    facebook: "https://facebook.com",
    email: "atieh.elmohs@example.com",
  },
  {
    name: "الدكتور / أحمد الشافعي",
    position: "رئيس مجلس إدارة الشركة الخليجية",
    image: img2,
    phone: "+201154211644",
    whatsapp: "+201154211644",
    facebook: "https://facebook.com",
    email: "ahmed.elshafei@example.com",
  },
  {
    name: "المهندس / حامد محمد عبدالعزيز",
    position: "المدير التنفيذي للشركة الخليجية",
    image: img1,
    phone: "+201080031628",
    whatsapp: "+201080031628",
    facebook: "https://facebook.com",
    email: "hamed.abdelaziz@example.com",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const contentVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: "easeOut", delay: 0.3 },
  },
};

const SupportCard = ({ member }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <motion.div
      ref={ref}
      className={Style.supportCard}
      variants={cardVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
    >
      <div className={Style.cardImageContainer}>
        <img src={member.image} alt={member.name} className={Style.cardImage} />
      </div>
      <div className={Style.cardContent}>
        <h3 className={Style.cardTitle}>{member.name}</h3>
        <motion.p className={Style.cardPosition} variants={contentVariants}>
          {member.position}
        </motion.p>
        <motion.div className={Style.contactInfo} variants={contentVariants}>
          <div className={Style.contactLinks}>
            <a
              href={`tel:${member.phone}`}
              className={Style.phoneButton}
              aria-label="Phone"
            >
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
            <a
              href={`mailto:${member.email}`}
              className={Style.gmailButton}
              aria-label="Email"
            >
              <i className="fas fa-envelope"></i>
            </a>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default function CustomerSupport() {
  return (
    <>
      <Helmet>
        <title>دعم العملاء - الخليجية للمبيدات والكيماويات</title>
        <meta
          name="description"
          content="تواصل مع فريق الدعم الفني المتخصص في الخليجية للحصول على استشارات وحلول زراعية متكاملة. نحن هنا لمساعدتك."
        />
      </Helmet>
      <div className={Style.customerSupportPage}>
        <header className={Style.supportHeader}>
          <motion.h1
            className={Style.supportTitle}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            دعم فني متخصص في خدمتك
          </motion.h1>
          <motion.p
            className={Style.supportSubtitle}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            فريقنا من الخبراء جاهز لتقديم المساعدة والإجابة على كافة استفساراتك
            لضمان أفضل النتائج لمحاصيلك.
          </motion.p>
        </header>

        <main className={Style.supportCards}>
          {supportTeam.map((member, index) => (
            <SupportCard key={index} member={member} />
          ))}
        </main>
      </div>
    </>
  );
}
