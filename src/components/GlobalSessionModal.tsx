import React from "react";

interface GlobalSessionModalProps {
  onContinueAsGuest: () => void;
  onLoginAgain: () => void;
}

const modalStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  background: "rgba(0,0,0,0.35)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
};

const boxStyle: React.CSSProperties = {
  background: "#fff",
  borderRadius: 16,
  padding: "2rem 1.5rem",
  minWidth: 320,
  maxWidth: "90vw",
  boxShadow: "0 8px 40px rgba(1,143,44,0.18)",
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  gap: 24,
  alignItems: "center",
};

const buttonStyle: React.CSSProperties = {
  padding: "12px 28px",
  borderRadius: 10,
  border: "none",
  fontWeight: 700,
  fontSize: "1rem",
  margin: "8px 0",
  cursor: "pointer",
  transition: "all 0.2s",
};

const GlobalSessionModal: React.FC<GlobalSessionModalProps> = ({ onContinueAsGuest, onLoginAgain }) => {
  return (
    <div style={modalStyle}>
      <div style={boxStyle}>
        <h2 style={{ color: "#018f2c", marginBottom: 12 }}>انتهت الجلسة</h2>
        <p style={{ color: "#495057", marginBottom: 24 }}>
          انتهت صلاحية الجلسة الخاصة بك.<br />يمكنك المتابعة كزائر أو تسجيل الدخول مجددًا.
        </p>
        <button
          style={{ ...buttonStyle, background: "linear-gradient(135deg, #018f2c 0%, #00c97b 100%)", color: "#fff" }}
          onClick={onContinueAsGuest}
        >
          المتابعة كزائر
        </button>
        <button
          style={{ ...buttonStyle, background: "linear-gradient(135deg, #dc3545 0%, #c82333 100%)", color: "#fff" }}
          onClick={onLoginAgain}
        >
          تسجيل الدخول
        </button>
      </div>
    </div>
  );
};

export default GlobalSessionModal; 