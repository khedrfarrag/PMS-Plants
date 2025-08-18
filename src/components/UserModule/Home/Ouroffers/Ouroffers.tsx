import React from "react";
import Style from "../Style.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
export default function Ouroffers() {
  return (
    <>
      <div className={Style.layoutouroffer}>
        <div className={Style.Herocaption}>
          <h1>Our Offers</h1>
          {/* <p>Get the best deals and discounts on our products</p> */}
          <button className="btn btn-primary ">
            أكتشف الأن <FontAwesomeIcon icon={faChevronLeft} />
          </button>
        </div>

        {/* العمود الأيسر (الصورة + تفاصيل العرض) */}
        <div className={`${Style.Herooffers} col-md-6`}>
          {/* بطاقة العرض أو الصندوق الذي يضم العنوان والتفاصيل */}
          <div
            className="p-4 shadow-sm rounded mb-4"
            // style={{ backgroundColor: "#fff" }}
          >
            {/* العنوان الفرعي */}
            <h6 className="mb-3">عرض خاص لليوم فقط</h6>

            {/* النص التوضيحي */}
            <p className="mb-3">
              اغتنم الفرصة واستمتع بأفضل الأسعار على منتجاتنا الزراعية لفترة
              محدودة!
            </p>

            {/* العنوان الذي يوضح ما يشمله العرض */}
            <p className="fw-bold mb-2">العرض يشمل:</p>
            <ul className="list-unstyled mb-3">
              <li>أسمدة عضوية</li>
              <li>أدوات بستنة</li>
            </ul>

            {/* جزء الخصم */}
            <div className="d-flex align-items-center mb-3">
              <div className="bg-success text-white px-3 py-1 rounded me-2">
                خصم 40%
              </div>
              <span className="fw-bold">وفر حتى 40%</span>
            </div>

            {/* زر "اعرف أكثر" */}
            <button className="btn btn-outline-success mb-3">اعرف أكثر</button>

            {/* أسهم التنقل مع مؤشر الصفحات (1/4) */}
            <div className="d-flex align-items-center">
              <button className="btn btn-link text-decoration-none me-2 fs-5">
                &lt;
              </button>
              <span>1 / 4</span>
              <button className="btn btn-link text-decoration-none ms-2 fs-5">
                &gt;
              </button>
            </div>
          </div>

          {/* صورة العرض (أصيص الزهور والأدوات) */}
          <img
            src="https://via.placeholder.com/350x250?text=Product+Image"
            alt="عرض زراعي"
            className="img-fluid"
          />
        </div>
      </div>
    </>
  );
}
