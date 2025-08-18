import React, { useEffect } from "react";
import img1 from "./img/م حامد.jpg";
import img2 from "./img/FB_IMG_1754312691134.jpg";
import img3 from "./img/FB_IMG_1754312749856.jpg";
import Style from "./style/style.module.css";

export default function CastomerSupport() {

 
  return (
    <div className={Style.customerSupportPage}>
      {/* Header Section */}
      <div className={Style.supportHeader}>
        <h1 className={Style.supportTitle}>دعم العملاء</h1>
        <p className={Style.supportSubtitle}>
          تواصل مع فريقنا المتخصص للحصول على أفضل الخدمات والدعم الفني
        </p>
      </div>

      {/* Support Cards */}
      <div className={Style.supportCards}>
        {/* Card 1 - المهندس عطيه المحص */}
        <div className={Style.supportCard}>
          <div className={Style.cardImageContainer}>
            <img src={img3} alt="المهندس عطيه المحص" className={Style.cardImage} />
            <div className={Style.cardOverlay}>
              <span className={Style.overlayText}>تواصل معنا</span>
            </div>
          </div>
          <div className={Style.cardContent}>
            <h3 className={Style.cardTitle}>المهندس / عطيه المحص</h3>
            <p className={Style.cardPosition}>مدير خدمة تساهيل لخدمات التصنيع الزراعي</p>
            
            <div className={Style.contactInfo}>
              <div className={Style.contactLinks}>
                <a href="tel:+201070778896" className={` ${Style.phoneButton}`}>
                  <i className="fas fa-phone-alt"
                  style={{
                    borderRadius:"5px",
                    padding:"10px"
                  }}
                  ></i>
                </a>
                <a href="https://wa.me/201070778896" target="_blank" rel="noopener noreferrer" className={` ${Style.whatsappButton}`}>
                  <i className="fab fa-whatsapp"
                  style={{
                    color:"green",
                    borderRadius:"5px",
                    padding:"10px"
                  }}
                  >
                  </i>
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={` ${Style.facebookButton}`}>
                  <i className="fab fa-facebook-f"
                   style={{
                    borderRadius:"5px",
                    padding:"10px",
                  }}
                  
                  ></i>
                </a>
                <a href="mailto:contact@company.com" className={` ${Style.gmailButton}`}>
                  <i className="fas fa-envelope"
                  style={{
                    color:"red",
                    borderRadius:"5px",
                    padding:"10px"
                  }}
                  
                  ></i>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2 - الدكتور أحمد الشافعي */}
        <div className={Style.supportCard}>
          <div className={Style.cardImageContainer}>
            <img src={img2} alt="الدكتور أحمد الشافعي" className={Style.cardImage} />
            <div className={Style.cardOverlay}>
              <span className={Style.overlayText}>تواصل معنا</span>
            </div>
          </div>
          <div className={Style.cardContent}>
            <h3 className={Style.cardTitle}>الدكتور / أحمد الشافعي</h3>
            <p className={Style.cardPosition}>رئيس مجلس إدارة الشركة الخليجية</p>
            
            <div className={Style.contactInfo}>
              <div className={Style.contactLinks}>
                <a href="tel:+201154211644" className={` ${Style.phoneButton}`}>
                  <i className="fas fa-phone-alt"
                    style={{
                      borderRadius:"5px",
                      padding:"10px"
                    }}
                  ></i>
                </a>
                <a href="https://wa.me/201154211644" target="_blank" rel="noopener noreferrer" className={` ${Style.whatsappButton}`}>
                  <i className="fab fa-whatsapp"
                    style={{
                      color:"green",
                      borderRadius:"5px",
                      padding:"10px"
                    }}
                  ></i>
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={` ${Style.facebookButton}`}>
                  <i className="fab fa-facebook-f"
                    style={{
                      borderRadius:"5px",
                      padding:"10px"
                    }}
                  ></i>
                  
                </a>
                <a href="mailto:contact@company.com" className={` ${Style.gmailButton}`}>
                  <i className="fas fa-envelope"
                    style={{
                      color:"red",
                      borderRadius:"5px",
                      padding:"10px"
                    }}
                  ></i>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3 - المهندس حامد محمد عبدالعزيز */}
        <div className={Style.supportCard}>
          <div className={Style.cardImageContainer}>
            <img src={img1} alt="المهندس حامد محمد عبدالعزيز" className={Style.cardImage} />
            <div className={Style.cardOverlay}>
              <span className={Style.overlayText}>تواصل معنا</span>
            </div>
          </div>
          <div className={Style.cardContent}>
            <h3 className={Style.cardTitle}>المهندس / حامد محمد عبدالعزيز</h3>
            <p className={Style.cardPosition}>المدير التنفيذي للشركة الخليجية</p>
            
            <div className={Style.contactInfo}>
              <div className={Style.contactLinks}>
                <a href="tel:+201080031628" className={` ${Style.phoneButton}`}>
                  <i className="fas fa-phone-alt"
                    style={{
                      borderRadius:"5px",
                      padding:"10px"
                    }}
                  ></i>
                </a>
                <a href="https://wa.me/201080031628" target="_blank" rel="noopener noreferrer" className={` ${Style.whatsappButton}`}>
                  <i className="fab fa-whatsapp"
                    style={{
                      color:"green",
                      borderRadius:"5px",
                      padding:"10px"
                    }}
                  ></i>
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={` ${Style.facebookButton}`}>
                  <i className="fab fa-facebook-f"
                    style={{
                      borderRadius:"5px",
                      padding:"10px"
                    }}
                  ></i>
                  
                </a>
                <a href="mailto:contact@company.com" className={` ${Style.gmailButton}`}>
                  <i className="fas fa-envelope"
                    style={{
                      color:"red",
                      borderRadius:"5px",
                      padding:"10px"
                    }}
                  ></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
