import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/Context";
import GlobalSessionModal from "./GlobalSessionModal";

const SessionModalWrapper: React.FC = () => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  if (!authContext || !authContext.sessionExpired) return null;

  return (
    <GlobalSessionModal
      onContinueAsGuest={() => {
        authContext.logout();
        authContext.setSessionExpired(false);
        navigate("/");
      }}
      onLoginAgain={() => {
        authContext.logout();
        authContext.setSessionExpired(false);
        navigate("/auth/login");
      }}
    />
  );
};

export default SessionModalWrapper; 