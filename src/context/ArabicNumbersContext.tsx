import React, { createContext, useContext, ReactNode } from 'react';

interface ArabicNumbersContextType {
  convertToArabicNumbers: (num: number | string) => string;
  formatArabicPrice: (price: number) => string;
  formatArabicNumber: (num: number) => string;
  formatArabicPercentage: (percentage: number) => string;
}

const ArabicNumbersContext = createContext<ArabicNumbersContextType | undefined>(undefined);

export const useArabicNumbers = () => {
  const context = useContext(ArabicNumbersContext);
  if (!context) {
    throw new Error('useArabicNumbers must be used within ArabicNumbersProvider');
  }
  return context;
};

interface ArabicNumbersProviderProps {
  children: ReactNode;
}

export const ArabicNumbersProvider: React.FC<ArabicNumbersProviderProps> = ({ children }) => {
  const convertToArabicNumbers = (num: number | string): string => {
    const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return num.toString().replace(/[0-9]/g, (w) => arabicNumbers[parseInt(w)]);
  };

  const formatArabicPrice = (price: number): string => {
    const arabicPrice = convertToArabicNumbers(price.toFixed(2));
    return `${arabicPrice} جــم`;
  };

  const formatArabicNumber = (num: number): string => {
    return convertToArabicNumbers(num);
  };

  const formatArabicPercentage = (percentage: number): string => {
    return `${convertToArabicNumbers(percentage)}%`;
  };

  const value: ArabicNumbersContextType = {
    convertToArabicNumbers,
    formatArabicPrice,
    formatArabicNumber,
    formatArabicPercentage,
  };

  return (
    <ArabicNumbersContext.Provider value={value}>
      {children}
    </ArabicNumbersContext.Provider>
  );
};
