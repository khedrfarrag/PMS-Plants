import React, { useContext, useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../../../context/Context";
import NavUser from "../Nav/NavUser";
import Style from "./Style/Style.module.css";
import Footer from "../Footer/Footer";
import { faComment } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SessionModalWrapper from "../../SessionModalWrapper";
import ChatModal from "../../UserModule/OpinAiChat/ChatModal";
// import NavBar from "../Nav/NavBar";
function UserMaster() {
  const { userData }: any = useContext(AuthContext);
  console.log(userData);
  const [loading, setLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <>
      <SessionModalWrapper />
      {loading ? (
        <div className="d-flex justify-content-center align-items-center vh-100">
          <div className="spinner-grow text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className={`${Style.contaner}`}>
          <div>
            <button className={Style.buttoncontactus} onClick={() => setShowChat(true)}>
              <FontAwesomeIcon icon={faComment} />
            </button>
            {showChat && <ChatModal onClose={() => setShowChat(false)} />}
          </div>
          <NavUser />
          {userData?.role === "Admin" || userData?.role === "SuperAdmin" ? <Navigate to={"/admin"} /> : ""}
          <Outlet />
          <Footer />
        </div>
      )}
    </>
  );
}

export default UserMaster;
