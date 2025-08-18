// import React, { useState } from "react";

// export default function Costumbutton() {
//   interface ProductDetail {
//     Title: string;
//     Description: string;
//   }

//   const [productDetails, setProductDetails] = useState([
//     { Title: "", Description: "", Id: "" },
//   ]);
//   console.log(productDetails);

//   type ProductDetailField = keyof ProductDetail;

//   const handleProductDetailChange = (
//     index: number,
//     field: ProductDetailField,
//     value: string
//   ) => {
//     const updated = [...productDetails];
//     updated[index][field] = value;
//     setProductDetails(updated);
//   };

//   const handleRemoveLastProductDetail = (
//     e: React.MouseEvent<HTMLButtonElement>
//   ): void => {
//     e.preventDefault();
//     if (productDetails.length > 1) {
//       setProductDetails(productDetails.slice(0, -1));
//     }
//   };
//   const handleAddProductDetail = (
//     e: React.MouseEvent<HTMLButtonElement>
//   ): void => {
//     e.preventDefault();
//     setProductDetails([
//       ...productDetails,
//       { Title: "", Description: "", Id: "" },
//     ]);
//   };

//   return {
//     handleAddProductDetail,
//     handleRemoveLastProductDetail,
//     handleProductDetailChange,
//     productDetails,
//     setProductDetails,
//   };
// }
