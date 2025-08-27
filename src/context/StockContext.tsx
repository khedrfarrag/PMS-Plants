import React, { createContext, useContext, ReactNode } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faExclamationTriangle,
  faTimesCircle,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";

// تعريف أنواع البيانات
interface StockStatus {
  status: "outOfStock" | "lastPiece" | "lowStock" | "inStock";
  text: string;
  canAdd: boolean;
  message: string;
  color: string;
  icon: any;
}

interface Product {
  Id: number;
  StockQuantity: number;
  Name?: string;
}

interface StockContextType {
  getStockStatus: (quantity: number, requestedQuantity?: number) => StockStatus;
  validateStock: (productId: number, requestedQuantity: number, products: Product[]) => boolean;
  getStockMessage: (productId: number, requestedQuantity: number, products: Product[]) => string;
  canAddToCart: (productId: number, requestedQuantity: number, products: Product[]) => boolean;
  getStockColor: (status: string) => string;
  getStockIcon: (status: string) => any;
}

// إنشاء Context
const StockContext = createContext<StockContextType | undefined>(undefined);

// Hook لاستخدام Context
export const useStockContext = () => {
  const context = useContext(StockContext);
  if (!context) {
    throw new Error('useStockContext must be used within StockProvider');
  }
  return context;
};

// Provider Component
interface StockProviderProps {
  children: ReactNode;
}

export const StockProvider: React.FC<StockProviderProps> = ({ children }) => {
  // دالة تحويل الأرقام للعربية (مؤقتة حتى نربط مع ArabicNumbersContext)
  const formatArabicNumber = (num: number): string => {
    const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return num.toString().replace(/[0-9]/g, (w) => arabicNumbers[parseInt(w)]);
  };

  // دالة الحصول على حالة المخزون
  const getStockStatus = (quantity: number, requestedQuantity: number = 1): StockStatus => {
    if (quantity === 0) {
      return {
        status: "outOfStock",
        text: "نفذ المخزون",
        canAdd: false,
        message: "لا يمكن إضافة المنتج للسلة - نفذ المخزون",
        color: "#dc3545",
        icon: faTimesCircle
      };
    } else if (quantity === 1) {
      return {
        status: "lastPiece",
        text: "اخر قطعة",
        canAdd: requestedQuantity <= 1,
        message: requestedQuantity > 1 ? "لا يمكن إضافة أكثر من قطعة واحدة" : "يمكن إضافة قطعة واحدة فقط",
        color: "#ffc107",
        icon: faExclamationTriangle
      };
    } else if (quantity <= 10) {
      return {
        status: "lowStock",
        text: `${formatArabicNumber(quantity)} قطع متبقية`,
        canAdd: requestedQuantity <= quantity,
        message: requestedQuantity > quantity ? `لا يمكن إضافة أكثر من ${formatArabicNumber(quantity)} قطع` : "مخزون منخفض",
        color: "#fd7e14",
        icon: faExclamationTriangle
      };
    } else {
      return {
        status: "inStock",
        text: "متوفر",
        canAdd: requestedQuantity <= quantity,
        message: "متوفر",
        color: "#28a745",
        icon: faCheckCircle
      };
    }
  };

  // دالة التحقق من صحة المخزون
  const validateStock = (productId: number, requestedQuantity: number, products: Product[]): boolean => {
    const product = products.find(p => p.Id === productId);
    if (!product) return false;
    
    const stockStatus = getStockStatus(product.StockQuantity, requestedQuantity);
    return stockStatus.canAdd;
  };

  // دالة الحصول على رسالة المخزون
  const getStockMessage = (productId: number, requestedQuantity: number, products: Product[]): string => {
    const product = products.find(p => p.Id === productId);
    if (!product) return "المنتج غير موجود";
    
    const stockStatus = getStockStatus(product.StockQuantity, requestedQuantity);
    return stockStatus.message;
  };

  // دالة التحقق من إمكانية الإضافة للسلة
  const canAddToCart = (productId: number, requestedQuantity: number, products: Product[]): boolean => {
    return validateStock(productId, requestedQuantity, products);
  };

  // دالة الحصول على لون المخزون
  const getStockColor = (status: string): string => {
    switch (status) {
      case "outOfStock": return "#dc3545";
      case "lastPiece": return "#ffc107";
      case "lowStock": return "#fd7e14";
      case "inStock": return "#28a745";
      default: return "#6c757d";
    }
  };

  // دالة الحصول على أيقونة المخزون
  const getStockIcon = (status: string) => {
    switch (status) {
      case "outOfStock": return faTimesCircle;
      case "lastPiece": return faExclamationTriangle;
      case "lowStock": return faExclamationTriangle;
      case "inStock": return faCheckCircle;
      default: return faInfoCircle;
    }
  };

  const value: StockContextType = {
    getStockStatus,
    validateStock,
    getStockMessage,
    canAddToCart,
    getStockColor,
    getStockIcon,
  };

  return (
    <StockContext.Provider value={value}>
      {children}
    </StockContext.Provider>
  );
};

