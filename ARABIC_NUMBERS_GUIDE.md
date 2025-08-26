# دليل تحويل الأرقام إلى العربية

## نظرة عامة
تم إنشاء نظام شامل لتحويل جميع الأرقام الإنجليزية إلى الأرقام العربية في التطبيق.

## الطرق المتاحة

### 1. استخدام Context Hook (الطريقة المفضلة)
```tsx
import { useArabicNumbers } from "../../../context/ArabicNumbersContext";

function MyComponent() {
  const { formatArabicNumber, formatArabicPrice, formatArabicPercentage } = useArabicNumbers();
  
  return (
    <div>
      <p>العدد: {formatArabicNumber(123)}</p>
      <p>السعر: {formatArabicPrice(99.99)}</p>
      <p>الخصم: {formatArabicPercentage(25)}</p>
    </div>
  );
}
```

### 2. استخدام Utility Functions مباشرة
```tsx
import { convertToArabicNumbers, formatArabicPrice } from "../utils/arabicNumbers";

function MyComponent() {
  return (
    <div>
      <p>العدد: {convertToArabicNumbers(123)}</p>
      <p>السعر: {formatArabicPrice(99.99)}</p>
    </div>
  );
}
```

## الدوال المتاحة

### `convertToArabicNumbers(num: number | string): string`
تحول أي رقم أو نص إلى أرقام عربية
```tsx
convertToArabicNumbers(123) // "١٢٣"
convertToArabicNumbers("456") // "٤٥٦"
```

### `formatArabicPrice(price: number): string`
تنسق السعر مع الأرقام العربية والعملة
```tsx
formatArabicPrice(99.99) // "٩٩٫٩٩ جــم"
```

### `formatArabicNumber(num: number): string`
تحول الرقم إلى أرقام عربية
```tsx
formatArabicNumber(123) // "١٢٣"
```

### `formatArabicPercentage(percentage: number): string`
تنسق النسبة المئوية مع الأرقام العربية
```tsx
formatArabicPercentage(25) // "٢٥%"
```

## أمثلة التطبيق

### في صفحات المنتجات
```tsx
// قبل التحويل
<span>{product.price} جــم</span>
<span>{product.discount}%</span>
<span>{product.quantity} قطع</span>

// بعد التحويل
<span>{formatArabicPrice(product.price)}</span>
<span>{formatArabicPercentage(product.discount)}</span>
<span>{formatArabicNumber(product.quantity)} قطع</span>
```

### في صفحات الدفع
```tsx
// قبل التحويل
<span>المجموع: {total} جــم</span>
<span>الكمية: {quantity}</span>

// بعد التحويل
<span>المجموع: {formatArabicPrice(total)}</span>
<span>الكمية: {formatArabicNumber(quantity)}</span>
```

### في لوحة التحكم
```tsx
// قبل التحويل
<td>{order.total}</td>
<td>{product.stock}</td>

// بعد التحويل
<td>{formatArabicPrice(order.total)}</td>
<td>{formatArabicNumber(product.stock)}</td>
```

## التطبيق على التطبيق كله

### 1. تم إضافة Provider في main.tsx
```tsx
<ArabicNumbersProvider>
  {/* باقي التطبيق */}
</ArabicNumbersProvider>
```

### 2. استخدام في أي مكون
```tsx
import { useArabicNumbers } from "../../../context/ArabicNumbersContext";

function AnyComponent() {
  const { formatArabicNumber, formatArabicPrice } = useArabicNumbers();
  
  // استخدم الدوال حسب الحاجة
}
```

## ملاحظات مهمة

1. **الأداء**: Context Provider محسن ولا يؤثر على الأداء
2. **التوافق**: يعمل مع جميع أنواع البيانات الرقمية
3. **المرونة**: يمكن استخدام الدوال بشكل منفصل أو مجتمع
4. **الصيانة**: تغيير واحد في Context يؤثر على التطبيق كله

## استكشاف الأخطاء

### إذا لم تظهر الأرقام العربية:
1. تأكد من استيراد `useArabicNumbers`
2. تأكد من أن المكون داخل `ArabicNumbersProvider`
3. تحقق من نوع البيانات المدخلة

### إذا ظهرت أخطاء TypeScript:
```tsx
// تأكد من استيراد الأنواع
import { useArabicNumbers } from "../../../context/ArabicNumbersContext";
```

## التطوير المستقبلي

يمكن إضافة المزيد من الدوال حسب الحاجة:
- `formatArabicDate` - لتنسيق التواريخ
- `formatArabicCurrency` - لتنسيق العملات المختلفة
- `formatArabicPhone` - لتنسيق أرقام الهواتف
