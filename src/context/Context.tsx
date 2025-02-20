import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

// تعريف نوع البيانات داخل السياق
type AuthContextType = {
  userData: UserData | null;
  saveUserData: () => void;
  logout: () => void;
};

type UserData = {
  email: string;
  name: string;
  role: string;
};

// إنشاء السياق
export const AuthContext = createContext<AuthContextType | null>(null);

// مزود السياق لتغليف التطبيق
export default function AuthContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userData, setUserData] = useState<UserData | null>(null);

  // دالة لاستخراج بيانات المستخدم من الـ token
  const saveUserData = () => {
    const enCodedToken: any = localStorage.getItem("token");
    if (enCodedToken) {
      const deCodedToken: UserData = jwtDecode<UserData>(enCodedToken);
      setUserData(deCodedToken);
    }
  };

  // دالة تسجيل الخروج
  const logout = () => {
    localStorage.removeItem("token");
    setUserData(null);
  };

  // تحميل بيانات المستخدم عند تشغيل التطبيق أو عند تغيير التوكن
  useEffect(() => {
    if (localStorage.getItem("token")) {
      saveUserData();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ userData, saveUserData, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
