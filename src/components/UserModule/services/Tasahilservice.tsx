import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Style from "./style/style.module.css";
import img100 from "../../../assets/عبوات/بلاستيك 100مج (10).jpg";
import img1L from "../../../assets/عبوات/1لتر(8).jpg";
import img500 from "../../../assets/عبوات/بلاستيك 500مج.jpg";
import img250 from "../../../assets/عبوات/بلاستيك 250مج (13).jpg";
import img5L from "../../../assets/عبوات/بلاستيك5لتر (4).jpg";
import imgcardboard2 from "../../../assets/عبوات/كارتون 1 لتر.jpg";
import imgcardboard3 from "../../../assets/عبوات/كارتون نص لتر.jpg";
import imgcardboard4 from "../../../assets/عبوات/كارتون ربع لتر.jpg";
import imgcardboard1 from "../../../assets/عبوات/كارتون خمسه لتر.jpg";
import imgSticker1 from "../../../assets/عبوات/ستيكر 4.jpg";
import imgSticker2 from "../../../assets/عبوات/ستيكر 2.jpg";
import imgSticker3 from "../../../assets/عبوات/ستيكر 3.jpg";

interface ContainerData {
  id: number;
  name: string;
  capacity: string;
  dimensions: string;
  material: string;
  features: string[];
  image: string;
}

interface StickerData {
  id: number;
  name: string;
  features: string[];
  image: string;
}

interface MaterialData {
  id: number;
  name: string;
  features: string[];
  image: string;
}

export default function Tasahilservice() {
  useEffect(() => {
    const scrolltopPage = () => {
      window.scrollTo({ top: 0 });
    };
    scrolltopPage();
  }, []);
  const navigate = useNavigate();
  const hahndleTocontact = () => {
    navigate("/contact-us", {
      state: { serviceType: "تساهيل", userType: "تاجر" },
    });
  };

  const [activeTab, setActiveTab] = useState<
    "plastic" | "cardboard" | "materials" | "stickers"
  >("plastic");

  const plasticContainers: ContainerData[] = [
    {
      id: 1,
      name: "عبوة 100 مل",
      capacity: "100 مل",
      dimensions: "ارتفاع: 10 سم",
      material: "بلاستيك باير عالي الجودة",
      features: ["مقاوم للأحماض", "آمن غذائياً", "قابل لإعادة التدوير"],
      image: img100,
    },
    {
      id: 2,
      name: "عبوة 250 مل",
      capacity: "250 مل",
      dimensions: "ارتفاع: 15 سم",
      material: "بلاستيك باير عالي الجودة",
      features: ["مقاوم للأحماض", "آمن غذائياً", "قابل لإعادة التدوير"],
      image: img250,
    },
    {
      id: 3,
      name: "عبوة 500 مل",
      capacity: "500 مل",
      dimensions: "ارتفاع: 16 سم",
      material: "بلاستيك باير عالي الجودة",
      features: ["مقاوم للأحماض", "آمن غذائياً", "قابل لإعادة التدوير"],
      image: img500,
    },
    {
      id: 4,
      name: "عبوة 1 لتر",
      capacity: "1 لتر",
      dimensions: "ارتفاع: 24 سم",
      material: "بلاستيك باير عالي الجودة",
      features: ["مقاوم للأحماض", "آمن غذائياً", "قابل لإعادة التدوير"],
      image: img1L,
    },
    {
      id: 5,
      name: "عبوة 5 لتر",
      capacity: "5 لتر",
      dimensions: "ارتفاع: 24 سم",
      material: "بلاستيك باير عالي الجودة",
      features: ["مقاوم للأحماض", "آمن غذائياً", "قابل لإعادة التدوير"],
      image: img5L,
    },
  ];

  const cardboardContainers: ContainerData[] = [
    {
      id: 6,
      name: "عبوة 5 لتر",
      capacity: "حجم كبير",
      dimensions: "33×36×30 سم",
      material: "كارتون 5 طبقات دوبليكس",
      features: ["مقاوم للرطوبة", "صديق للبيئة", "قوة تحمل عالية"],
      image: imgcardboard1,
    },
    {
      id: 7,
      name: "عبوة 1 لتر",
      capacity: "حجم متوسط",
      dimensions: "39×36 سم",
      material: "كارتون 5 طبقات دوبليكس",
      features: ["مقاوم للرطوبة", "صديق للبيئة", "قوة تحمل عالية"],
      image: imgcardboard2,
    },
    {
      id: 8,
      name: "عبوة 1/4",
      capacity: "ربع حجم",
      dimensions: "21×33 سم",
      material: "كارتون 5 طبقات دوبليكس",
      features: ["مقاوم للرطوبة", "صديق للبيئة", "قوة تحمل عالية"],
      image: imgcardboard3,
    },
    {
      id: 9,
      name: "عبوة 1/2",
      capacity: "نصف حجم",
      dimensions: "16×33 سم",
      material: "كارتون 5 طبقات دوبليكس",
      features: ["مقاوم للرطوبة", "صديق للبيئة", "قوة تحمل عالية"],
      image: imgcardboard4,
    },
  ];
  const stickerContainers: StickerData[] = [
    {
      id: 6,
      name: "الملصقات",
      features: [
        "تصميم مخصص بالكامل.",
        "طباعة بالاسم التجاري اللي تختاره.",
        "جاذبية بصرية عالية.",
      ],
      image: imgSticker1,
    },
    {
      id: 7,
      name: "الملصقات",
      features: [
        "تصميم مخصص بالكامل.",
        "طباعة بالاسم التجاري اللي تختاره.",
        "جاذبية بصرية عالية.",
      ],
      image: imgSticker2,
    },
    {
      id: 8,
      name: "الملصقات",
      features: [
        "تصميم مخصص بالكامل.",
        "طباعة بالاسم التجاري اللي تختاره.",
        "جاذبية بصرية عالية.",
      ],
      image: imgSticker3,
    },
  ];
  const materialsContainers: MaterialData[] = [
    {
      id: 1,
      name: "الخامات الزراعية",
      features: [
        "المواد المذبيات",
        "خامات المواد الفعاله الفطرية والحشرية",
        "خامات تصنيع المغذيات",
        "المواد الحاملة",
      ],
      image: "/images/materials-large.jpg",
    },
  ];
  const currentContainers =
    activeTab === "plastic"
      ? plasticContainers
      : activeTab === "cardboard"
      ? cardboardContainers
      : activeTab === "stickers"
      ? stickerContainers
      : activeTab === "materials"
      ? materialsContainers
      : [];

  return (
    <div className={Style.containerService}>
      {/* Hero Section */}
      <div className={Style.heroSection}>
        <div className={Style.heroContent}>
          <h1 className={Style.heroTitle}> خدمات </h1>
          <p className={Style.heroDescription}>
            نوفر لك أفضل أنواع العبوات البلاستيكية والكارتونية ,مواد الخام
            ,الملصقات لتلبية جميع احتياجاتك في القطاع الزراعي
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className={Style.tabsContainer}>
        <div className={Style.tabsWrapper}>
          <button
            className={`${Style.tab} ${
              activeTab === "plastic" ? Style.activeTab : ""
            }`}
            onClick={() => setActiveTab("plastic")}
          >
            <span className={Style.tabIcon}></span>
            العبوات البلاستيكية
          </button>
          <button
            className={`${Style.tab} ${
              activeTab === "cardboard" ? Style.activeTab : ""
            }`}
            onClick={() => setActiveTab("cardboard")}
          >
            <span className={Style.tabIcon}></span>
            العبوات الكارتونية
          </button>
          <button
            className={`${Style.tab} ${
              activeTab === "materials" ? Style.activeTab : ""
            }`}
            onClick={() => setActiveTab("materials")}
          >
            <span className={Style.tabIcon}></span>
            المواد الخام
          </button>
          <button
            className={`${Style.tab} ${
              activeTab === "stickers" ? Style.activeTab : ""
            }`}
            onClick={() => setActiveTab("stickers")}
          >
            <span className={Style.tabIcon}></span>
            الملصقات
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <div className={Style.productsSection}>
        <div className={Style.sectionHeader}>
          <h2 className={Style.sectionTitle}>
            {activeTab === "plastic"
              ? "عبوات بلاستيكية"
              : activeTab === "cardboard"
              ? "عبوات كارتونية"
              : activeTab === "materials"
              ? "مواد خام"
              : activeTab === "stickers"
              ? "الملصقات"
              : ""}
          </h2>
          <p className={Style.sectionSubtitle}>
            {activeTab === "plastic"
              ? "مصنوعة من خامة باير عالية الجودة"
              : activeTab === "cardboard"
              ? "مصنوعة من كارتون 5 طبقات دوبليكس"
              : activeTab === "materials"
              ? "توفر جميع خامات التصنيع الزراعي"
              : activeTab === "stickers"
              ? "صمّم استيكر منتجك زي ما تحب! نوفر لك التنفيذ بالشكل والاسم التجاري اللي تختاره، علشان يعبر عن علامتك ويشد انتباه عميلك"
              : ""}
          </p>
        </div>

        <div className={Style.productsGrid}>
          {currentContainers.map((container: any) => (
            <div key={container.id} className={Style.productCard}>
              <div className={Style.cardImageContainer}>
                <img
                  src={container.image}
                  alt={container.name}
                  className={Style.cardImage}
                  onError={(e) => {
                    e.currentTarget.src = "/images/placeholder-container.jpg";
                  }}
                />
                {activeTab === "cardboard" || activeTab === "plastic" ? (
                  <div className={Style.cardBadge}>{container.capacity}</div>
                ) : (
                  ""
                )}
              </div>

              <div className={Style.cardContent}>
                <h3 className={Style.cardTitle}>{container.name}</h3>

                <div className={Style.cardDetails}>
                  {activeTab === "cardboard" || activeTab === "plastic" ? (
                    <div className={Style.detailItem}>
                      <span className={Style.detailLabel}>المقاسات:</span>
                      <span className={Style.detailValue}>
                        {container.dimensions}
                      </span>
                    </div>
                  ) : (
                    ""
                  )}

                  {activeTab === "cardboard" || activeTab === "plastic" ? (
                    <div className={Style.detailItem}>
                      <span className={Style.detailLabel}>الخامة:</span>
                      <span className={Style.detailValue}>
                        {container.material}
                      </span>
                    </div>
                  ) : (
                    ""
                  )}
                </div>

                <div className={Style.cardFeatures}>
                  <h4 className={Style.featuresTitle}>
                    {activeTab === "cardboard" ||
                    activeTab === "plastic" ||
                    activeTab === "stickers"
                      ? "المميزات"
                      : "متوفر"}
                    :
                  </h4>
                  <ul className={Style.featuresList}>
                    {container.features.map((feature: any, index: any) => (
                      <li key={index} className={Style.featureItem}>
                        <span className={Style.featureIcon}>✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <button className={Style.cardButton} onClick={hahndleTocontact}>
                  {" "}
                  أطلب الأن{" "}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className={Style.whyChooseSection}>
        <div className={Style.whyChooseContent}>
          <h2 className={Style.whyChooseTitle}>لماذا تختار منتجاتنا؟</h2>
          <div className={Style.advantagesGrid}>
            <div className={Style.advantageCard}>
              <div className={Style.advantageIcon}>🏆</div>
              <h3 className={Style.advantageTitle}>جودة عالية</h3>
              <p className={Style.advantageDescription}>
                نستخدم أفضل الخامات المستوردة لضمان جودة المنتج
              </p>
            </div>
            <div className={Style.advantageCard}>
              <div className={Style.advantageIcon}>🌱</div>
              <h3 className={Style.advantageTitle}>صديق للبيئة</h3>
              <p className={Style.advantageDescription}>
                منتجاتنا قابلة لإعادة التدوير وآمنة على البيئة
              </p>
            </div>
            <div className={Style.advantageCard}>
              <div className={Style.advantageIcon}>🔒</div>
              <h3 className={Style.advantageTitle}>آمان تام</h3>
              <p className={Style.advantageDescription}>
                مقاومة للأحماض والمواد الكيميائية الزراعية
              </p>
            </div>
            <div className={Style.advantageCard}>
              <div className={Style.advantageIcon}>💪</div>
              <h3 className={Style.advantageTitle}>قوة تحمل</h3>
              <p className={Style.advantageDescription}>
                تتحمل الظروف الجوية المختلفة والاستخدام المكثف
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
