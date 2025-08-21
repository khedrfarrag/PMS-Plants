import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import Style from "../Style.module.css";
import img from "../../../../assets/d30086e409d90d8b73a450a01874f65c.jpg";
import { useNavigate } from "react-router-dom";
export default function Booking() {
  const navigate = useNavigate();
  const handleToCotact = () => {
    navigate("/contact-us", {
      state: { serviceType: "زياره" },
    });
  };
  return (
    <>
      <div className={`${Style.Herobookimg} `}>
        <div className={`${Style.FriImg} `}>
          <img src={img} />
        </div>
      </div>
      <div className={`${Style.Herobookcaption} `}>
        <div className={` ${Style.captions}`}>
          <h1>
            أحجز زيارتك <span>الآن</span>!
          </h1>
          <p>استكشف منتجاتنا عن قرب واحصل على استشارة زراعية مخصصة لمزرعتك</p>
          <button className="btn btn-success " onClick={handleToCotact}>
            احجز الأن <FontAwesomeIcon icon={faChevronLeft} />
          </button>
        </div>
      </div>
    </>
  );
}
