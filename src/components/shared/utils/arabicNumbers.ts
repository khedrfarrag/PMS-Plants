// Utility function to convert English numbers to Arabic numbers
export const convertToArabicNumbers = (num: number | string): string => {
  const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num.toString().replace(/[0-9]/g, (w) => arabicNumbers[parseInt(w)]);
};

// Format price with Arabic numbers
export const formatArabicPrice = (price: number): string => {
  const arabicPrice = convertToArabicNumbers(price.toFixed(2));
  return `${arabicPrice} جــم`;
};

// Format any number with Arabic numerals
export const formatArabicNumber = (num: number): string => {
  return convertToArabicNumbers(num);
};

// Format percentage with Arabic numbers
export const formatArabicPercentage = (percentage: number): string => {
  return `${convertToArabicNumbers(percentage)}%`;
};
