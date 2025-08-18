import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// --------- أنواع البيانات ---------
export type AuthContextType = {
  userData: UserData | null;
  saveUserData: () => void;
  logout: (expired?: boolean, navigateFn?: () => void) => void;
  sessionExpired: boolean;
  setSessionExpired: React.Dispatch<React.SetStateAction<boolean>>;
};

type UserData = {
  email: string;
  name: string;
  role: string;
  image: string;
  userId: string;
  expired: string;
};

// --------- إنشاء السياق ---------
export const AuthContext = createContext<AuthContextType | null>(null);

// --------- مزود السياق ---------
export default function AuthContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [sessionExpired, setSessionExpired] = useState(false);
  const logoutTimer = React.useRef<number | null>(null);
  // const navigate = useNavigate();

  // --------- فك التوكن وفحص الصلاحية ---------
  const saveUserData = () => {
    const enCodedToken =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (enCodedToken) {
      try {
        const decoded: any = jwtDecode(enCodedToken);
        const currentTime = Math.floor(Date.now() / 1000);

        if (decoded.exp < currentTime) {
          // 🟥 التوكن منتهي
          logout(true);
          setSessionExpired(true);
          return;
        }

        // ✅ التوكن صالح، تحقق من المستخدم أولاً
        const existingPendingCheckout = localStorage.getItem("pendingCheckout") || sessionStorage.getItem("pendingCheckout");
        if (existingPendingCheckout) {
          try {
            const sessionId = sessionStorage.getItem("session-Id");
            const pendingData = JSON.parse(existingPendingCheckout);
            
            // امسح فقط إذا كان المستخدم مختلف أو sessionId مختلف
            if (pendingData.userId && pendingData.userId !== decoded.sub) {
              // مستخدم مختلف، امسح البيانات
              sessionStorage.removeItem("pendingCheckout");
              localStorage.removeItem("pendingCheckout");
              sessionStorage.removeItem("session-Id");
            } else if (pendingData.sessionId && pendingData.sessionId !== sessionId) {
              // sessionId مختلف، امسح البيانات
              sessionStorage.removeItem("pendingCheckout");
              localStorage.removeItem("pendingCheckout");
              sessionStorage.removeItem("session-Id");
            }
            // إذا كان نفس المستخدم ونفس sessionId، لا تمسح شيئاً
          } catch (error) {
            // امسح إذا كان هناك خطأ في البيانات
            sessionStorage.removeItem("pendingCheckout");
            localStorage.removeItem("pendingCheckout");
            sessionStorage.removeItem("session-Id");
          }
        
        }

        // خزّن بيانات المستخدم
        const userInfo: UserData = {
          email: decoded.email,
          name: decoded.name || "",
          userId: decoded.sub,
          expired: decoded.exp,
          image: decoded.image,
          role:
            decoded[
              "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
            ] || decoded.role,
        };

        setUserData(userInfo);

        // حساب الوقت المتبقي لانتهاء التوكن
        const timeLeft = (decoded.exp - currentTime) * 1000;
        if (logoutTimer.current) clearTimeout(logoutTimer.current);
        logoutTimer.current = setTimeout(() => {
          logout(true);
          setSessionExpired(true);
        }, timeLeft);
      } catch (err) {
        console.error("فشل في فك التوكن:", err);
        logout(true);
        setSessionExpired(true);
      }
    }
  };

  // --------- تسجيل الخروج ---------
  const logout = (expired = false, navigateFn?: () => void) => {
    // مسح pendingCheckout
    sessionStorage.removeItem("pendingCheckout");
    localStorage.removeItem("pendingCheckout");
    sessionStorage.removeItem("session-Id");
    
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    localStorage.removeItem("remember");

    setUserData(null);
    if (expired) {
      toast.error("انتهت الجلسة، الرجاء تسجيل الدخول مرة أخرى");
      setSessionExpired(true);
    } else {
      toast.success("تم تسجيل الخروج بنجاح");
      setSessionExpired(false);
    }
    navigateFn?.();
    window.location.reload();

  };
  // --------- التحقق من التوكن عند بدء التشغيل ---------
  useEffect(() => {
    if (localStorage.getItem("token") || sessionStorage.getItem("token")) {
      saveUserData();
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        userData,
        saveUserData,
        logout,
        sessionExpired,
        setSessionExpired,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
