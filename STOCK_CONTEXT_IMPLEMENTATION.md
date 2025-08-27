# Stock Context Implementation Guide

## ملخص التحسينات المطبقة

تم تطبيق نظام إدارة المخزون المركزي بنجاح في جميع الكومبوننتس المتعلقة بالمنتجات. النظام يوفر تحقق فوري من المخزون مع رسائل واضحة للمستخدم.

## الملفات المحدثة

### 1. `src/main.tsx`
- ✅ تم إضافة `StockProvider` كـ wrapper حول التطبيق
- ✅ تم دمج `StockProvider` مع `ArabicNumbersProvider`

### 2. `src/context/StockContext.tsx` (جديد)
- ✅ تم إنشاء Context مركزي لإدارة المخزون
- ✅ يحتوي على دوال: `getStockStatus`, `validateStock`, `getStockMessage`, `canAddToCart`
- ✅ يدعم 4 حالات مخزون: `outOfStock`, `lastPiece`, `lowStock`, `inStock`

### 3. `src/components/UserModule/Store/component/Store.tsx`
- ✅ تم تطبيق `useStockContext` بالكامل
- ✅ تم إضافة التحقق من المخزون في `addcarthandel` و `incrementHandler`
- ✅ تم إضافة عرض حالة المخزون في واجهة المستخدم
- ✅ تم إضافة CSS للـ stock badges

### 4. `src/components/UserModule/Shoppingcart/Shoppingcart.tsx`
- ✅ تم تطبيق `useStockContext` بالكامل
- ✅ تم إضافة التحقق من المخزون في `CheangeQuantity`
- ✅ تم تطبيق تحويل الأرقام للعربية

### 5. `src/components/UserModule/Payment/Payment.tsx`
- ✅ تم تطبيق `useStockContext` بالكامل
- ✅ تم إضافة التحقق من المخزون في `onSubmit` قبل إتمام الطلب
- ✅ تم تطبيق تحويل الأرقام للعربية

### 6. `src/components/UserModule/Home/PopularProduct/Popular.tsx`
- ✅ تم تطبيق `useStockContext` بالكامل
- ✅ تم إضافة التحقق من المخزون في `addToCart` و `incrementHandler`
- ✅ تم إضافة عرض حالة المخزون في واجهة المستخدم
- ✅ تم تطبيق تحويل الأرقام للعربية

### 7. `src/components/UserModule/offers/Offer.tsx`
- ✅ تم تطبيق `useStockContext` بالكامل
- ✅ تم إضافة التحقق من المخزون في `addToCart` و `incrementHandler`
- ✅ تم تحديث عرض حالة المخزون ليستخدم `StockContext`
- ✅ تم تطبيق تحويل الأرقام للعربية

### 8. `src/components/UserModule/Favorites/Favorites.tsx`
- ✅ تم تطبيق `useStockContext` بالكامل
- ✅ تم إضافة التحقق من المخزون في `handleAddToCart` و `handleQtyChange`
- ✅ تم إضافة عرض حالة المخزون في واجهة المستخدم
- ✅ تم تطبيق تحويل الأرقام للعربية
- ✅ تم إضافة CSS للـ stock badges

### 9. `src/components/UserModule/Home/Bestseller/BestSeller.tsx`
- ✅ تم تطبيق `useStockContext` بالكامل
- ✅ تم إضافة التحقق من المخزون في `addcarthandel` و `incrementHandler`
- ✅ تم إضافة عرض حالة المخزون في واجهة المستخدم

### 10. `src/components/UserModule/Store/component/productdetails/Product.tsx`
- ✅ تم تطبيق `useStockContext` بالكامل
- ✅ تم إضافة التحقق من المخزون في `handleaddToCart` و `incrementHandler`
- ✅ تم إضافة عرض حالة المخزون في واجهة المستخدم (Desktop & Mobile)
- ✅ تم تطبيق تحويل الأرقام للعربية في جميع الأقسام
- ✅ تم تحديث عرض الأسعار والتقييمات والكميات بالعربية

### 11. ملفات CSS المحدثة
- ✅ `src/components/UserModule/Store/component/style/style.module.css`
- ✅ `src/components/UserModule/Home/Style.module.css`
- ✅ `src/components/UserModule/Favorites/style/Style.module.css`

## الدوال الجديدة في StockContext

### `getStockStatus(quantity, requestedQuantity)`
```typescript
// إرجاع حالة المخزون مع النص والألوان والأيقونات
{
  status: "outOfStock" | "lastPiece" | "lowStock" | "inStock",
  text: string,
  canAdd: boolean,
  message: string,
  color: string,
  icon: FontAwesomeIcon
}
```

### `validateStock(productId, requestedQuantity, products)`
```typescript
// التحقق من إمكانية إضافة الكمية المطلوبة
boolean
```

### `getStockMessage(productId, requestedQuantity, products)`
```typescript
// إرجاع رسالة مناسبة لحالة المخزون
string
```

### `canAddToCart(productId, requestedQuantity, products)`
```typescript
// التحقق من إمكانية الإضافة للسلة
boolean
```

## حالات المخزون المدعومة

### 1. `outOfStock` (نفذ المخزون)
- **الشرط**: `quantity === 0`
- **النص**: "نفذ المخزون"
- **اللون**: أحمر (#dc3545)
- **الأيقونة**: `faTimesCircle`
- **الإجراء**: منع الإضافة للسلة

### 2. `lastPiece` (آخر قطعة)
- **الشرط**: `quantity === 1`
- **النص**: "آخر قطعة"
- **اللون**: أصفر (#ffc107)
- **الأيقونة**: `faExclamationTriangle`
- **الإجراء**: السماح بإضافة قطعة واحدة فقط

### 3. `lowStock` (مخزون منخفض)
- **الشرط**: `quantity <= 10`
- **النص**: "X قطع متبقية"
- **اللون**: برتقالي (#fd7e14)
- **الأيقونة**: `faExclamationTriangle`
- **الإجراء**: التحقق من الكمية المطلوبة

### 4. `inStock` (متوفر)
- **الشرط**: `quantity > 10`
- **النص**: "متوفر"
- **اللون**: أخضر (#28a745)
- **الأيقونة**: `faCheckCircle`
- **الإجراء**: السماح بالإضافة العادية

## التحسينات المطبقة في Product.tsx

### تحويل الأرقام للعربية:
- ✅ تقييم المنتج (Desktop & Mobile)
- ✅ كمية المخزون
- ✅ الأسعار (المخفضة والأصلية)
- ✅ عداد الكمية
- ✅ نسبة الخصم
- ✅ عدد التقييمات
- ✅ توزيع التقييمات (النجوم والنسب المئوية)
- ✅ تقييمات المراجعات الفردية

### التحقق من المخزون:
- ✅ التحقق في `incrementHandler` قبل زيادة الكمية
- ✅ التحقق في `handleaddToCart` قبل الإضافة للسلة
- ✅ عرض حالة المخزون في Desktop Layout
- ✅ عرض حالة المخزون في Mobile Layout

## الخطوات التالية

### ✅ مكتمل
- تطبيق StockContext في جميع الكومبوننتس
- إضافة التحقق من المخزون في دوال الإضافة للسلة
- إضافة التحقق من المخزون في دوال تغيير الكمية
- إضافة عرض حالة المخزون في واجهة المستخدم
- إضافة CSS للـ stock badges
- تطبيق تحويل الأرقام للعربية في جميع الكومبوننتس

### 🔄 قيد التطوير
- اختبار النظام في بيئة التطوير
- تحسين الرسائل والألوان حسب الحاجة

## النتائج المتوقعة

1. **منع إضافة منتجات غير متوفرة**: لن يتمكن المستخدم من إضافة منتجات نفذ مخزونها
2. **تحذيرات فورية**: رسائل واضحة عند محاولة إضافة كميات غير متوفرة
3. **تجربة مستخدم محسنة**: عرض مرئي لحالة المخزون مع ألوان وأيقونات واضحة
4. **اتساق في التطبيق**: نفس المنطق مطبق في جميع الكومبوننتس
5. **صيانة سهلة**: منطق المخزون مركزي في مكان واحد
6. **عرض الأرقام بالعربية**: جميع الأرقام تظهر بالعربية في جميع أنحاء التطبيق

## استكشاف الأخطاء

### مشكلة: لا تظهر حالة المخزون
**الحل**: تأكد من أن `StockProvider` موجود في `main.tsx`

### مشكلة: خطأ في استيراد `useStockContext`
**الحل**: تأكد من استيراد `useStockContext` من `src/context/StockContext`

### مشكلة: لا يعمل التحقق من المخزون
**الحل**: تأكد من أن `StockQuantity` موجود في بيانات المنتج

### مشكلة: أخطاء في CSS
**الحل**: تأكد من وجود CSS classes للـ stock badges في ملف CSS المناسب

### مشكلة: الأرقام لا تظهر بالعربية
**الحل**: تأكد من استيراد `useArabicNumbers` من `src/context/ArabicNumbersContext`

## ملاحظات مهمة

1. **الأرقام العربية**: تم دمج `StockContext` مع `ArabicNumbersContext` لعرض الأرقام بالعربية
2. **الأداء**: تم استخدام `useCallback` لتحسين الأداء في بعض الدوال
3. **التوافق**: النظام متوافق مع جميع الكومبوننتس الموجودة
4. **التوسع**: يمكن إضافة حالات مخزون جديدة بسهولة في `StockContext`
5. **التجربة المستخدم**: تم تحسين UX في صفحة تفاصيل المنتج مع عرض حالة المخزون بشكل واضح

