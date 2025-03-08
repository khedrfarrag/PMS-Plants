import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import Style from "./SlideBar.module.css";
import imgCompony from "../../../assets/svg/dashsvg/imgcompony.svg";
import {
  faTh,
  faUsers,
  faEnvelope,
  faShoppingCart,
  faCog,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";

export default function SideBar() {
  const [isPopupVisible, setPopupVisible] = useState(false);

  const togglePopup = () => {
    setPopupVisible(!isPopupVisible);
  };

  return (
    <>
      {/* <div className={`d-flex flex-column ${Style.sidebarWrapper}`}> */}
      {/* <div > */}
      <div
        className={`${Style.sidebar} d-flex flex-column align-items-center bg-success vh-100 p-3`}
        style={{ width: "80px" }}
      >
        {/* الشعار */}
        <div className="mb-4">
          <img src={imgCompony} alt="Logo" className="img-fluid" />
        </div>

        {/* القائمة */}
        <div className="nav flex-column text-center w-100">
          <div
            className="py-2 bg-gradient"
            style={{
              background: "linear-gradient(to right, #A3C644, #6BAE45)",
            }}
          >
            <FontAwesomeIcon icon={faTh} size="lg" className="text-white" />
          </div>
          <div className="py-2">
            <FontAwesomeIcon icon={faUsers} size="lg" className="text-white" />
          </div>
          <div className="py-2">
            <FontAwesomeIcon
              icon={faEnvelope}
              size="lg"
              className="text-white"
            />
          </div>
          <div className="py-2">
            <FontAwesomeIcon
              icon={faShoppingCart}
              size="lg"
              className="text-white"
            />
          </div>
          <div className="py-2">
            <FontAwesomeIcon icon={faCog} size="lg" className="text-white" />
          </div>
        </div>

        {/* تسجيل الخروج */}
        <div className="mt-auto py-3">
          <FontAwesomeIcon
            icon={faSignOutAlt}
            size="lg"
            className="text-white"
          />
        </div>
      </div>
      {/* </div> */}
      {/* </div> */}
      <div className="d-block d-md-none">
        <FontAwesomeIcon
          icon={faBars}
          className="text-primary position-absolute start-0 top-0 mt-4 ms-5"
          style={{ fontSize: "24px", cursor: "pointer" }}
          onClick={togglePopup}
        />
        {isPopupVisible && (
          <div className="position-absolute z-3 top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 d-flex justify-content-center align-items-center">
            <div
              className="bg-white p-4 rounded shadow-lg"
              style={{ width: "80%", maxWidth: "400px" }}
            >
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="m-0">Menu</h5>
                <FontAwesomeIcon
                  icon={faTimes}
                  className="text-secondary"
                  style={{ fontSize: "24px", cursor: "pointer" }}
                  onClick={togglePopup}
                />
              </div>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <a href="#item1" className="text-dark text-decoration-none">
                    Item 1
                  </a>
                </li>
                <li className="mb-2">
                  <a href="#item2" className="text-dark text-decoration-none">
                    Item 2
                  </a>
                </li>
                <li className="mb-2">
                  <a href="#item3" className="text-dark text-decoration-none">
                    Item 3
                  </a>
                </li>
                <li className="mb-2">
                  <a href="#item4" className="text-dark text-decoration-none">
                    Item 4
                  </a>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
