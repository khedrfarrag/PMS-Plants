import React, { useContext, useState, useEffect, useRef } from "react";
import Style from "../Nav/NavBar.module.css";
import { NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Logonav from "../../../assets/صورة_واتساب_بتاريخ_2024-11-10_في_22.53.07_158af9f7-removebg-preview.png";
import Imguser from "../../../assets/svg/userimg.svg";
import {
  faShoppingCart,
  faHeart,
  faList,
  faArrowRightToBracket,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { ImgURLBeasd } from "../../../constant/Const";
import { AuthContext } from "../../../context/Context";
import {
  CartshopContext,
  CartshopContextType,
} from "../../../context/CartshopContext";

export default function NavUser() {
  const navigate = useNavigate();
  const navgatecart = () => {
    navigate("/store/productcart");
  };
  const { userData, logout }: null | any = useContext(AuthContext);
  const handleLogout = () => {
    logout(false, () => navigate("/"));
  };
  // تحقق من تسجيل الدخول بناءً على وجود التوكن
  const isLoggedIn = Boolean(
    localStorage.getItem("token") || sessionStorage.getItem("token")
  );
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1200);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileMenuClosing, setMobileMenuClosing] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const cartContext = useContext(CartshopContext) as CartshopContextType;
  const cartCount = cartContext?.cartCount || 0;
  const cartChanged = cartContext?.cartChanged || false;

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 1200);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // إغلاق القائمة عند الضغط خارجها
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mouseenter", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  // إغلاق قائمة الموبايل عند الضغط خارجها
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        handleCloseMenu();
      }
    }
    if (mobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      // منع scroll للصفحة
      document.body.style.overflow = "hidden";
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      // إعادة scroll للصفحة
      document.body.style.overflow = "auto";
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "auto";
    };
  }, [mobileMenuOpen]);

  // في الموبايل: القائمة تظهر عند الضغط على المنيو فقط
  // في الديسكتوب: القائمة تظهر عند الضغط على الصورة فقط
  const handleAvatarClick = () => {
    if (!isMobile) {
      // إذا كانت القائمة مفتوحة، أغلقها
      if (dropdownOpen) {
        setDropdownOpen(false);
      } else {
        // إذا كانت مغلقة، افتحها
        setDropdownOpen(true);
      }
    }
  };

  const handleMenuIconClick = () => {
    if (isMobile) {
      if (mobileMenuOpen) {
        setMobileMenuClosing(true);
        setTimeout(() => {
          setMobileMenuOpen(false);
          setMobileMenuClosing(false);
        }, 300);
      } else {
        setMobileMenuOpen(true);
      }
    }
  };

  const handleMenuClick = (route: string, options?: { state?: any }) => {
    setDropdownOpen(false);
    if (mobileMenuOpen) {
      setMobileMenuClosing(true);
      setTimeout(() => {
        setMobileMenuOpen(false);
        setMobileMenuClosing(false);
      }, 300);
    }
    if (route === "/auth/login" || route === "/auth") {
      sessionStorage.removeItem("session-Id");
    }
    navigate(route, options);
  };

  const handleLogoutMobile = () => {
    if (mobileMenuOpen) {
      setMobileMenuClosing(true);
      setTimeout(() => {
        setMobileMenuOpen(false);
        setMobileMenuClosing(false);
      }, 300);
    }
    handleLogout();
  };

  const handleCloseMenu = () => {
    setMobileMenuClosing(true);
    setTimeout(() => {
      setMobileMenuOpen(false);
      setMobileMenuClosing(false);
    }, 300);
  };

  return (
    <div className={`${Style.HeroNavuser} `}>
      <div className={`${Style.contanernav} d-flex align-items-center`}>
        <div className="d-flex align-items-center  gap-5">
          <div className={`${Style.heroLogo} d-flex align-items-center gap-2`}>
            <img src={Logonav} className={`${Style.imglogo} `} alt="Logo" />

            <div className={`${Style.captiontitle}`}>
              <h3>الخليجية</h3>
              <p>للتنمية الزراعية</p>
            </div>
          </div>
          <ul className={`${Style.LinksNav} d-flex mt-3 list-unstyled gap-5 `}>
            <li>
              <NavLink
                to={"/"}
                className={({ isActive }) =>
                  isActive ? "active" : "text-decoration-none text-dark"
                }
              >
                الصفحة الرئيسية
              </NavLink>
            </li>
            <li>
              <NavLink
                to={"/store"}
                className={({ isActive }) =>
                  isActive ? "active" : "text-decoration-none text-dark"
                }
              >
                المتجر
              </NavLink>
            </li>
            <li>
              <NavLink
                to={"/offers"}
                className={({ isActive }) =>
                  isActive ? "active" : "text-decoration-none text-dark"
                }
              >
                العروض والخصومات
              </NavLink>
            </li>
            <li>
              <NavLink
                to={"/populer"}
                className={({ isActive }) =>
                  isActive ? "active" : "text-decoration-none text-dark"
                }
              >
                منتجات الموسم الحالي
              </NavLink>
            </li>
            <li>
              <NavLink
                to={"/about-us"}
                className={({ isActive }) =>
                  isActive ? "active" : "text-decoration-none text-dark"
                }
              >
                من نحن
              </NavLink>
            </li>
            <li>
              <NavLink
                to={"/contact-us"}
                className={({ isActive }) =>
                  isActive ? "active" : "text-decoration-none text-dark"
                }
              >
                تواصل معنا
              </NavLink>
            </li>
            <li>
              <NavLink
                to={"/payment"}
                className={({ isActive }) =>
                  isActive ? "active" : "text-decoration-none text-dark"
                }
              >
                طلباتك
              </NavLink>
            </li>
          </ul>
        </div>

        <div className={`${Style.contanersearching}`}>
          {/* ترتيب العناصر: cartIcon ثم LoginNav/userImg بجانب بعض */}
          {isLoggedIn ? (
            <>
              <span className={`${Style.cartIcon} `} onClick={navgatecart}>
                <span className={Style.cartCount}>{cartCount}</span>
                <FontAwesomeIcon
                  className={
                    cartChanged
                      ? `${Style.icons} ${Style.cartIconChanged}`
                      : Style.icons
                  }
                  icon={faShoppingCart}
                  style={{
                    color: cartChanged ? "red" : "white",
                    transition: "color 0.3s",
                  }}
                />
              </span>
              <div className={`${Style.userImg} `}>
                <FontAwesomeIcon
                  className={Style.icons}
                  icon={faHeart}
                  onClick={() => handleMenuClick("/favorites")}
                />
                <img
                  src={userData ? `${ImgURLBeasd}/${userData?.image}` : Imguser}
                  alt="User Avatar"
                  className="rounded-circle"
                  style={{
                    width: "40px",
                    height: "40px",
                    cursor: isMobile ? "default" : "pointer",
                  }}
                  onClick={handleAvatarClick}
                />
                {/* القائمة المنسدلة في الديسكتوب */}
                {dropdownOpen && !isMobile && (
                  <div
                    ref={dropdownRef}
                    className="shadow bg-white rounded position-absolute"
                    style={{
                      top: "50px",
                      left: 0,
                      minWidth: "220px",
                      zIndex: 1000,
                      border: "1px solid #eee",
                    }}
                  >
                    {/* روابط الحساب */}
                    <button
                      className="dropdown-item w-100 text-end py-2 px-3 border-bottom bg-transparent"
                      onClick={() => handleMenuClick("/account-settings")}
                    >
                      إدارة الحساب
                    </button>
                    <button
                      className="dropdown-item w-100 text-end py-2 px-3 border-bottom bg-transparent"
                      onClick={() => handleMenuClick("store/productcart")}
                    >
                      عربة التسوق
                    </button>
                    <button
                      className="dropdown-item w-100 text-end py-2 px-3 border-bottom bg-transparent"
                      onClick={() =>
                        handleMenuClick("/contact-us", {
                          state: { serviceType: "دعم فني" },
                        })
                      }
                    >
                      الدعم الفني
                    </button>
                    <button
                      className="dropdown-item w-100 text-end py-2 px-3 bg-transparent text-danger"
                      onClick={handleLogout}
                    >
                      تسجيل خروج
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <span className={`${Style.cartIcon} `} onClick={navgatecart}>
                <span className={Style.cartCount}>{cartCount}</span>
                <FontAwesomeIcon
                  className={
                    cartChanged
                      ? `${Style.icons} ${Style.cartIconChanged}`
                      : Style.icons
                  }
                  icon={faShoppingCart}
                  style={{
                    color: cartChanged ? "red" : "white",
                    transition: "color 0.3s",
                  }}
                />
              </span>
              <div
                className={`${Style.LoginNav} d-flex align-items-center justify-content-center `}
                onClick={() => handleMenuClick("/auth/login")}
              >
                <FontAwesomeIcon icon={faArrowRightToBracket} />
              </div>
            </>
          )}
        </div>
        <div
          className={`${Style.iconbars} `}
          style={{ cursor: isMobile ? "pointer" : "default" }}
          onClick={handleMenuIconClick}
        >
          <FontAwesomeIcon
            icon={faList}
            style={{
              color: "black",
              transition: "color 0.3s",
            }}
          />
          {/* Mobile Menu Overlay */}
          {mobileMenuOpen && isMobile && (
            <>
              {/* Dark Overlay */}
              <div
                className={`position-fixed ${Style.mobileMenuOverlay}`}
                style={{
                  top: 0,
                  left: 0,
                  width: "100vw",
                  height: "100vh",
                  backgroundColor: "rgba(0, 0, 0, 0.7)",
                  backdropFilter: "blur(4px)",
                  zIndex: 999,
                }}
                onClick={handleCloseMenu}
              />

              {/* Mobile Menu */}
              <div
                ref={mobileMenuRef}
                className={`position-fixed d-flex flex-column ${
                  mobileMenuClosing ? Style.mobileMenuClosing : Style.mobileMenu
                }`}
                style={{
                  top: 0,
                  left: 0,
                  width: "85%",
                  height: "100vh",
                  backgroundColor: "#ffffff",
                  zIndex: 1000,
                  boxShadow: "2px 0 10px rgba(0, 0, 0, 0.1)",
                }}
              >
                {/* Header with Close Button */}
                <div
                  className="d-flex justify-content-between align-items-center p-3 border-bottom"
                  style={{ backgroundColor: "#f8f9fa" }}
                >
                  <h6
                    className="mb-0"
                    style={{ color: "#333", fontWeight: "600" }}
                  >
                    القائمة
                  </h6>
                  <button
                    className="btn btn-link p-0"
                    onClick={handleCloseMenu}
                    style={{ color: "#666", fontSize: "20px" }}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>

                {/* Menu Items */}
                <div className="flex-grow-1 d-flex flex-column">
                  {/* Main Navigation Links */}
                  <div className="p-0">
                    <button
                      className="w-100 text-start py-3 px-4 border-bottom "
                      style={{
                        color: "green",
                        fontSize: "16px",
                        fontWeight: "500",
                        border: "none",
                        borderBottom: "1px solid #e0e0e0",
                        // transition: "background-color 0.2s ease",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "green")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "transparent")
                      }
                      onClick={() => handleMenuClick("/")}
                    >
                      الصفحة الرئيسية
                    </button>
                    <button
                      className="w-100 text-start py-3 px-4 border-bottom "
                      style={{
                        color: "#333",
                        fontSize: "16px",
                        fontWeight: "500",
                        border: "none",
                        borderBottom: "1px solid #e0e0e0",
                        // transition: "background-color 0.2s ease",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "green")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "transparent")
                      }
                      onClick={() => handleMenuClick("/store")}
                    >
                      المتجر
                    </button>
                    <button
                      className="w-100 text-start py-3 px-4 border-bottom "
                      style={{
                        color: "#333",
                        fontSize: "16px",
                        fontWeight: "500",
                        border: "none",
                        borderBottom: "1px solid #e0e0e0",
                        // transition: "background-color 0.2s ease",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "green")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "transparent")
                      }
                      onClick={() => handleMenuClick("/offers")}
                    >
                      العروض والخصومات
                    </button>
                    <button
                      className="w-100 text-start py-3 px-4 border-bottom "
                      style={{
                        color: "#333",
                        fontSize: "16px",
                        fontWeight: "500",
                        border: "none",
                        borderBottom: "1px solid #e0e0e0",
                        // transition: "background-color 0.2s ease",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "green")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "transparent")
                      }
                      onClick={() => handleMenuClick("/about-us")}
                    >
                      من نحن
                    </button>
                    <button
                      className="w-100 text-start py-3 px-4 border-bottom "
                      style={{
                        color: "#333",
                        fontSize: "16px",
                        fontWeight: "500",
                        border: "none",
                        borderBottom: "1px solid #e0e0e0",
                        // transition: "background-color 0.2s ease",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "green")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "transparent")
                      }
                      onClick={() => handleMenuClick("/populer")}
                    >
                      منتجات الموسم الحالي
                    </button>
                    <button
                      className="w-100 text-start py-3 px-4 border-bottom "
                      style={{
                        color: "#333",
                        fontSize: "16px",
                        fontWeight: "500",
                        border: "none",
                        borderBottom: "1px solid #e0e0e0",
                        // transition: "background-color 0.2s ease",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "green")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "transparent")
                      }
                      onClick={() => handleMenuClick("/contact-us")}
                    >
                      تواصل معنا
                    </button>
                  </div>

                  {/* Account Links */}
                  <div className=" p-0">
                    {isLoggedIn && (
                      <button
                        className="w-100 text-start py-3 px-4 border-bottom "
                        style={{
                          color: "#333",
                          fontSize: "16px",
                          fontWeight: "500",
                          border: "none",
                          borderBottom: "1px solid #e0e0e0",
                          // transition: "background-color 0.2s ease",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "green")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor =
                            "transparent")
                        }
                        onClick={() => handleMenuClick("/account-settings")}
                      >
                        إدارة الحساب
                      </button>
                    )}

                    <button
                      className="w-100 text-start py-3 px-4 border-bottom "
                      style={{
                        color: "#333",
                        fontSize: "16px",
                        fontWeight: "500",
                        border: "none",
                        borderBottom: "1px solid #e0e0e0",
                        // transition: "background-color 0.2s ease",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "green")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "transparent")
                      }
                      onClick={() => handleMenuClick("store/productcart")}
                    >
                      عربة التسوق
                    </button>

                    <button
                      className="w-100 text-start py-3 px-4 border-bottom "
                      style={{
                        color: "#333",
                        fontSize: "16px",
                        fontWeight: "500",
                        border: "none",
                        borderBottom: "1px solid #e0e0e0",
                        // transition: "background-color 0.2s ease",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "green")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "transparent")
                      }
                      onClick={() =>
                        handleMenuClick("/contact-us", {
                          state: { serviceType: "دعم فني" },
                        })
                      }
                    >
                      الدعم الفني
                    </button>
                    {isLoggedIn ? (
                      <button
                        className="w-100 text-start py-3 px-4 "
                        style={{
                          color: "#dc3545",
                          fontSize: "16px",
                          fontWeight: "500",
                          border: "none",
                          // transition: "background-color 0.2s ease",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#dc3545")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor =
                            "transparent")
                        }
                        onClick={handleLogoutMobile}
                      >
                        تسجيل خروج
                      </button>
                    ) : (
                      <button
                        className="w-100 text-start py-3 px-4 "
                        style={{
                          color: "#018f2c",
                          fontSize: "16px",
                          fontWeight: "500",
                          border: "none",
                          // transition: "background-color 0.2s ease",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "green")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor =
                            "transparent")
                        }
                        onClick={() => handleMenuClick("/auth/login")}
                      >
                        تسجيل الدخول
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
