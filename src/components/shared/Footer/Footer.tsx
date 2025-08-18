import Style from "../UserMasterLayout/Style/Style.module.css";
import Logo from "../../../assets/svg/userimg.svg";

export default function Footer() {
  return (
    <footer className={Style.footerSectionCustom}>
      <div className={Style.footerContentCustom}>
        <div className={Style.footerBrandBlock}>
          <div className={Style.logoFooterCustom}>
            <img src={Logo} alt="Logo" className={Style.logoImgFooterCustom} />
            <div className={Style.logonameFooterCustom}>
              <h6>الخليجية</h6>
              <p>للتنمية الزراعية</p>
            </div>
          </div>
          <p className={Style.captionlogoFooterCustom}>
            نحن نضمن لك أسرع النتائج وأفضل إنتاج
          </p>
        </div>
        <div className={Style.footerLinksBlock}>
          <h2 className={Style.footerLinksTitleCustom}>أقسام الموقع</h2>
          <ul className={Style.footerLinksListCustom}>
            <li>
              <a href="/" className={Style.footerLinkCustom}>
                الصفحة الرئيسية
              </a>
            </li>
            <li>
              <a href="/about-us" className={Style.footerLinkCustom}>
                من نحن
              </a>
            </li>
            <li>
              <a href="/store" className={Style.footerLinkCustom}>
                منتجاتنا
              </a>
            </li>
            <li>
              <a href="/favorites" className={Style.footerLinkCustom}>
                المفضلة
              </a>
            </li>
            <li>
              <a href="/shoppingcart" className={Style.footerLinkCustom}>
                عربة التسوق
              </a>
            </li>
            <li>
              <a href="/contact-us" className={Style.footerLinkCustom}>
                تواصل معنا
              </a>
            </li>
          </ul>
        </div>
        <div className={Style.footerCategoriesBlock}>
          <h2 className={Style.footerLinksTitleCustom}>الفئات</h2>
          <ul className={Style.footerLinksListCustom}>
            <li>تقاوي</li>
            <li>مبيدات زراعية</li>
            <li>أسمدة زراعية</li>
            <li>استصلاح أراضي</li>
            <li>تصنيع</li>
          </ul>
        </div>
        <div className={Style.footerContactBlock}>
          <h2 className={Style.footerLinksTitleCustom}>تواصل معنا</h2>
          <div className={Style.footerContactItemCustom}>
            <i className="fa-regular fa-envelope"></i>
            <a
              href="mailto:support@alkhalgya.id"
              className={Style.footerLinkCustom}
            >
              support@alkhalgya.id
            </a>
          </div>
          <div className={Style.footerContactItemCustom}>
            <i className="fa-solid fa-phone"></i>
            <a href="tel:+201000000000" className={Style.footerLinkCustom}>
              +20 - 1000-000 - 000
            </a>
          </div>
          <p className={Style.footerSocialTextCustom}>
            ويمكنكم التواصل معنا أيضا أو متابعتنا عبر
          </p>
          <div className={Style.footerSocialIconsCustom}>
            <a
              href="https://wa.me/201000000000"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="واتساب"
              className={Style.socialIconLinkCustom}
            >
              <i className="fa-brands fa-whatsapp"></i>
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="فيسبوك"
              className={Style.socialIconLinkCustom}
            >
              <i className="fa-brands fa-facebook-f"></i>
            </a>
            <a
              href="mailto:support@alkhalgya.id"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="بريد إلكتروني"
              className={Style.socialIconLinkCustom}
            >
              <i className="fa-regular fa-envelope"></i>
            </a>
          </div>
        </div>
      </div>
      <div className={Style.footerCopyrightCustom}>
        <span>
          جميع الحقوق محفوظة &copy; {new Date().getFullYear()} الخليجية للتنمية
          الزراعية
        </span>
      </div>
    </footer>
  );
}
