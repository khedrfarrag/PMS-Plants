import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState, useCallback } from "react";
import Style from "./Style.module.css";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import icon1 from "./svg/icon1.svg";
import icon2 from "./svg/icon2.svg";
import icon3 from "./svg/icon3.svg";
import icon4 from "./svg/icon4.svg";
import icon5 from "./svg/greenwight.svg";
import Categoris from "./Categoris/Categoris";
import ServiceUs from "./Services/ServiceUs";
import Booking from "./Booking/Booking";
import BestSeller from "./Bestseller/BestSeller";
import Customer from "./CustomerReviews/Customer";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

// Import slider images
import img1 from "../../../assets/img_1.jpg";
import img2 from "../../../assets/img_2.jpg";

// Slider data interface
interface SlideData {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  description: string;
}

// Custom hook for slider
const useSlider = (slides: SlideData[], interval: number = 2000) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(nextSlide, interval);
    return () => clearInterval(timer);
  }, [isPlaying, interval, nextSlide]);

  return {
    currentSlide,
    nextSlide,
    prevSlide,
    goToSlide,
    setIsPlaying,
  };
};

function Home() {
  const navigate = useNavigate();
  const handleTostore = () => {
    navigate("/store");
  };
  const handleaboutus = () => {
    navigate("/about-us");
  };

  // Slider data
  const sliderData: SlideData[] = [
    {
      id: 1,
      image: img1,
      title: "الخليجية معاك من البذرة لحد الحصاد",
      subtitle: "شركاء نجاح مع صديقنا الفلاح",
      description:
        "من الأدوات والمعدات إلى أجود البذور والحلول الذكية، نوفر لك كل ما يلزم لتنمية وإدارة مزرعتك بكفاءة ونجاح",
    },
    {
      id: 2,
      image: img2, // Replace with img2 when available
      title: "حلول التغليف المتطورة",
      subtitle: "عبوات بلاستيكية وكارتونية عالية الجودة",
      description:
        "نوفر أفضل أنواع العبوات من خامة باير للبلاستيك وكارتون 5 طبقات دوبليكس، مقاومة للأحماض وصديقة للبيئة",
    },
  ];

  // Use slider hook
  const { currentSlide, nextSlide, prevSlide, goToSlide, setIsPlaying } =
    useSlider(sliderData, 5000);

  const { ref: ref1, inView: inView1 } = useInView({ triggerOnce: true });
  const { ref: ref2, inView: inView2 } = useInView({ triggerOnce: true });
  const { ref: ref3, inView: inView3 } = useInView({ triggerOnce: true });
  const { ref: ref4, inView: inView4 } = useInView({ triggerOnce: true });
  const { ref: ref5, inView: inView5 } = useInView({ triggerOnce: true });
  const { ref: ref6, inView: inView6 } = useInView({ triggerOnce: true });
  const { ref: ref7, inView: inView7 } = useInView({ triggerOnce: true });

  const animation1 = useAnimation();
  const animation2 = useAnimation();
  const animation3 = useAnimation();
  const animation4 = useAnimation();
  const animation5 = useAnimation();
  const animation6 = useAnimation();
  const animation7 = useAnimation();

  useEffect(() => {
    if (inView1) {
      animation1.start({ opacity: 1, transition: { duration: 0.5 } });
    }
    if (inView2) {
      animation2.start({
        opacity: 1,
        transition: { duration: 0.5, delay: 0.5 },
      });
    }
    if (inView3) {
      animation3.start({
        transform: "translateX(0)",
        opacity: 1,
        transition: { duration: 0.5, delay: 0.5 },
      });
    }
    if (inView4) {
      animation4.start({
        transform: "translateX(0)",
        opacity: 1,
        transition: { duration: 0.5, delay: 0.5 },
      });
    }
    if (inView5) {
      animation5.start({
        transform: "translateX(0)",
        opacity: 1,
        transition: { duration: 0.5, delay: 0.5 },
      });
    }
    if (inView6) {
      animation6.start({
        transform: "translateX(0)",
        opacity: 1,
        transition: { duration: 0.5, delay: 0.5 },
      });
    }
    if (inView7) {
      animation7.start({
        transform: "translateX(0)",
        opacity: 1,
        transition: { duration: 0.5, delay: 0.5 },
      });
    }
  }, [inView1, inView2, inView3, inView4, inView5, inView6, inView7]);

  // Animation variants for content
  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const currentSlideData = sliderData[currentSlide];

  return (
    <>
      <Helmet>
        <title>الرئيسية - الخليجية للمبيدات والكيماويات</title>
        <meta
          name="description"
          content="مرحبًا بك في الخليجية، شريكك للنجاح في الزراعة. اكتشف مجموعتنا من المبيدات، الأسمدة، والبذرو، خدمات تساهيل ،أستصلاح الاراضي الزراعية،والحلول الزراعية المبتكرة."
        />
      </Helmet>
      <motion.section
        className={`${Style.contanerf}`}
        initial={{ opacity: 0 }}
        animate={animation1}
        ref={ref1}
        style={{
          backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${currentSlideData.image})`,
        }}
        onMouseEnter={() => setIsPlaying(false)}
        onMouseLeave={() => setIsPlaying(true)}
      >
        <div className={`${Style.captionTitle} w-100 h-50 m-auto d-flex`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{ duration: 0.4 }}
              style={{ width: "100%" }}
            >
              <h1 className="text-center">{currentSlideData.title}</h1>
              <h2
                className="text-center"
                style={{
                  fontSize: "1.4rem",
                  marginBottom: "15px",
                  color: "#f0f0f0",
                  fontWeight: "500",
                }}
              >
                {currentSlideData.subtitle}
              </h2>
              <p className="text-center">{currentSlideData.description}</p>
            </motion.div>
          </AnimatePresence>

          {/* Original buttons - unchanged */}
          <div className={`${Style.herobutton}`}>
            <button className="btn btn-primary" onClick={handleTostore}>
              إلى المتجر <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <button className="btn btn-primary" onClick={handleaboutus}>
              المزيد عنا
            </button>
          </div>
        </div>

        {/* Slider Controls */}
        <div className={Style.sliderControls}>
          {/* Navigation Dots */}
          <div className={Style.sliderDots}>
            {sliderData.map((_, index) => (
              <button
                key={index}
                className={`${Style.dot} ${
                  index === currentSlide ? Style.activeDot : ""
                }`}
                onClick={() => goToSlide(index)}
                aria-label={`الانتقال إلى الشريحة ${index + 1}`}
              />
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            className={`${Style.sliderArrow} ${Style.prevArrow}`}
            onClick={prevSlide}
            aria-label="الشريحة السابقة"
          >
            ‹
          </button>
          <button
            className={`${Style.sliderArrow} ${Style.nextArrow}`}
            onClick={nextSlide}
            aria-label="الشريحة التالية"
          >
            ›
          </button>
        </div>

        {/* Original services section - unchanged */}
        <div className={`${Style.HeroOurservice}`}>
          <div className={`${Style.servicecapf}`}>
            <img src={icon1} alt="حجز زياره مجانيه" />
            <h6 className={`${Style.service} text-center`}>حجز زيارة مجانا</h6>
          </div>
          <div className={`${Style.servicecapsac}`}>
            <img src={icon2} alt="حجز زياره مجانيه" />
            <h6 className={`${Style.service} text-center`}>
              متاح دفع إلكتروني
            </h6>
          </div>
          <div className={`${Style.servicecapth}`}>
            <img src={icon3} alt="حجز زياره مجانيه" />
            <h6 className={`${Style.service} text-center`}>عروض وخصومات</h6>
          </div>
          <div className={`${Style.servicecapfort}`}>
            <img src={icon4} alt="حجز زياره مجانيه" />
            <h6 className={`${Style.service} text-center`}>خدمة 24 ساعة</h6>
          </div>
        </div>
      </motion.section>

      {/* All other sections remain exactly the same */}
      <motion.img
        src={icon5}
        alt=""
        style={{
          width: "100%",
          transform: "translateY(-100%)",
        }}
        initial={{ opacity: 0 }}
        animate={animation2}
        ref={ref2}
      />
      <motion.section
        className={`${Style.Herocategoris}`}
        initial={{ opacity: 0 }}
        animate={animation3}
        ref={ref3}
      >
        <Categoris />
      </motion.section>
      <motion.section
        className={`${Style.HeroServices}`}
        initial={{ opacity: 0 }}
        animate={animation4}
        ref={ref4}
      >
        <ServiceUs />
      </motion.section>
      <motion.section
        className={`${Style.Heroboking} shadow-lg mb-5`}
        initial={{ opacity: 0 }}
        animate={animation5}
        ref={ref5}
      >
        <Booking />
      </motion.section>
      <motion.section
        className={`${Style.HeroBestSeller}`}
        initial={{ opacity: 0 }}
        animate={animation6}
        ref={ref6}
      >
        <BestSeller />
      </motion.section>
      <motion.section
        className={Style.HeroCustomerReviws}
        initial={{ opacity: 0 }}
        animate={animation7}
        ref={ref7}
      >
        <Customer />
      </motion.section>
    </>
  );
}

export default Home;
