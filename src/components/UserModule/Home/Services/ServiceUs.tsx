import React from "react";
import Style from "../Style.module.css";
import icon1 from "../svg/service1.svg";
import icon2 from "../svg/caticon2.svg";
import { useNavigate } from "react-router-dom";
export default function ServiceUs() {
  // handleToservice
  const navigate = useNavigate();

  const data = {
    title: "استصلاح اراضي",
  };
  return (
    <>
      <div className={`${Style.captionServices} `}>
        <h1 className="">الخدمات</h1>
        <p>
          نوفر لك كل ما تحتاجه من أدوات، بذور، مبيدات، وخدمات استصلاح وتصنيع
          لتجربة زراعية ناجحة ومستدامة!{" "}
        </p>
      </div>
      <div className={`${Style.cardServices} `}>
        <div
          className={`${Style.cards}`}
          onClick={() =>
            navigate("service/landre-clamation", { state: "استصلاح اراضي" })
          }
        >
          <h6>استصلاح أراضي</h6>
          <img src={icon1} alt="" />
        </div>
        <div
          className={`${Style.cards}`}
          onClick={() =>
            navigate("service/Tasahil-service", { state: " خدمة تساهيل" })
          }
        >
          <h6>
            {" "}
            خدمة تساهيل{" "}
            <span className={Style.destaruction}>(التصنيع للغير)</span>
          </h6>
          <img src={icon2} alt="" />
        </div>
        <div
          className={`${Style.cards}`}
          onClick={() =>
            navigate("service/castomer-Support", { state: " دعم فني" })
          }
        >
          <h6>دعم فني مجاني </h6>
          <img src={icon2} alt="" />
        </div>
      </div>
    </>
  );
}
