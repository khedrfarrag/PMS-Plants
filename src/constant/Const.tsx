// export const BeasdURL: string = "api";
// export const ImgURLBeasd: string = "https://localhost:8083";
export const BeasdURL: string = "https://alkhaligya.runasp.net/api";
export const ImgURLBeasd: string = "https://alkhaligya.runasp.net";
// http://alkhaligya.runasp.net
// auth-end-points
const authBeasd = "Auth";
export const authEndPoint = {
  RegisterUser: `${BeasdURL}/${authBeasd}/register`,
  RegisterAdmin: `${BeasdURL}/${authBeasd}/register-admin`,
  Login: `${BeasdURL}/${authBeasd}/login`,
  Verify: `${BeasdURL}/${authBeasd}/verify-otp`,
  ForgotPassword: `${BeasdURL}/${authBeasd}/forgot-password`,
  ResetPassword: `${BeasdURL}/${authBeasd}/reset-password`,
  ResendOtp: `${BeasdURL}/${authBeasd}/ResendOtp`,
  GetAllUsers: `${BeasdURL}/${authBeasd}/all-users`,
  GetAllAdmins: `${BeasdURL}/${authBeasd}/all-admins`,
  GetUserCount: `${BeasdURL}/${authBeasd}/user-count`,
  GetAdminCount: `${BeasdURL}/${authBeasd}/admin-count`,
  GetUserByUserId: `${BeasdURL}/${authBeasd}/user-profile`,
  GetUnconfirmedAdmins: `${BeasdURL}/${authBeasd}/unconfirmed-admins`,
  ConfirmAdmin: (adminId: string) =>
    `${BeasdURL}/${authBeasd}/confirm-admin/${adminId}`,
  GetConfirmAdmins: `${BeasdURL}/${authBeasd}/confirmed-admins`,
  UnConfirmAdmins: (adminId: string) =>
    `${BeasdURL}/${authBeasd}/unconfirm-admin/${adminId}`,
  GetMyProfile: `${BeasdURL}/${authBeasd}/user-profile`,
};

// Products End-Point

const productBeasd = "Product";
export const ProductsPoint = {
  Post: `${BeasdURL}/${productBeasd}/AddProductAsync`,
  Put: (id: number) => `${BeasdURL}/${productBeasd}/${id}`,
  GetProductId: (id: number) => `${BeasdURL}/${productBeasd}/${id}`,
  Delete: (id: number) => `${BeasdURL}/${productBeasd}/${id}`,
  GetAllProducts: `${BeasdURL}/${productBeasd}`,
  ProductSearch: `${BeasdURL}/${productBeasd}/search`,
  ProductFilter: `${BeasdURL}/${productBeasd}/filter`,
  GetOutOfStock: `${BeasdURL}/${productBeasd}/out-of-stock/count`,
  GetTopDiscountedProducts: `${BeasdURL}/${productBeasd}/4-top-discounted-products`,
  MarkPopular: (id: number) => `${BeasdURL}/${productBeasd}/mark-popular/${id}`,
  MarkNotPopular: (id: number) =>
    `${BeasdURL}/${productBeasd}/mark-not-popular/${id}`,
  GetPopular: (pageNumber: number, pageSize: number) =>
    `${BeasdURL}/${productBeasd}/popular?pageNumber=${pageNumber}&pageSize=${pageSize}`,
  GetByCategory: (id: number) => `${BeasdURL}/${productBeasd}/${id}`,
  AddFavorites: (userId: string, ProductId: number) =>
    `${BeasdURL}/${productBeasd}/favorites?userId=${userId}&productId=${ProductId}`,
  DeleteFavorites: `${BeasdURL}/${productBeasd}/favorites`,
  GetFavorites: (userId: any, pageNumber: number, pageSize: number) =>
    `${BeasdURL}/${productBeasd}/favorites?userId=${userId}&pageNumber=${pageNumber}&pageSize=${pageSize}`,
  GetAllDiscountedProducts: (pageNumber: number, pageSize: number) =>
    `${BeasdURL}/${productBeasd}/discounted?pageNumber=${pageNumber}&pageSize=${pageSize}`,
};

// CartShop End-Point
const cartShopBeasd = "CartShop";
export const cartShopPoint = {
  GetAllCartShop: `${BeasdURL}/${cartShopBeasd}`,
  Post: `${BeasdURL}/${cartShopBeasd}`,
  Put: (id: number) => `${BeasdURL}/${cartShopBeasd}/item/${id}`,
  Delete: (id: number) => `${BeasdURL}/${cartShopBeasd}/item/${id}`,
  ClearCartShop: `${BeasdURL}/${cartShopBeasd}/clear`,
  SummaryCart: `${BeasdURL}/${cartShopBeasd}/summary`,
  CheckoutToPay: `${BeasdURL}/${cartShopBeasd}/checkout`,
};

// Category
const categoryBeasd = "Category";
export const CategoryPoint = {
  Post: `${BeasdURL}/${categoryBeasd}`,
  Put: (id: number) => `${BeasdURL}/${categoryBeasd}/${id}`,
  GetCategoriesId: (id: number) => `${BeasdURL}/${categoryBeasd}/${id}`,
  Delete: (id: number) => `${BeasdURL}/${categoryBeasd}/${id}`,
  GetAllCategories: `${BeasdURL}/${categoryBeasd}`,
  Getsubcategories: (id: number) =>
    `${BeasdURL}/${categoryBeasd}/${id}/subcategories`,
};
// ContactMessages End-Point
const contactMessagesBeasd = "ContactMessages";
export const contactMessagesPoint = {
  Post: `${BeasdURL}/${contactMessagesBeasd}`,
  Put: (id: number) => `${BeasdURL}/${contactMessagesBeasd}/${id}`,
  Delete: (id: number) => `${BeasdURL}/${contactMessagesBeasd}/${id}`,
  GetContactMessagesId: (id: number) =>
    `${BeasdURL}/${contactMessagesBeasd}/${id}`,
  GetAllContactMessages: `${BeasdURL}/${contactMessagesBeasd}/all-messages`,
  ContactMessagesUserId: (id: string) =>
    `${BeasdURL}/${contactMessagesBeasd}/user/${id}`,
};

// Orders End-Point
const ordersBeasd = "Orders";
export const ordersPoint = {
  Post: `${BeasdURL}/${ordersBeasd}`,
  Put: (id: number) => `${BeasdURL}/${ordersBeasd}/${id}`,
  GetOrdersId: (id: number) => `${BeasdURL}/${ordersBeasd}/${id}`,
  Delete: (id: number) => `${BeasdURL}/${ordersBeasd}/${id}`,
  GetAllOrders: `${BeasdURL}/${ordersBeasd}`,
  GetOrdersUser: `${BeasdURL}/${ordersBeasd}/user`,
  GetOrdersSummary: (id: number) => `${BeasdURL}/${ordersBeasd}/summary/${id}`,
  GetTotalPaidPrice: `${BeasdURL}/${ordersBeasd}/total-paid-price`,
  GetPaidCount: `${BeasdURL}/${ordersBeasd}/paid/count`,
  GetPendingCount: `${BeasdURL}/${ordersBeasd}/pending/count`,
  GetFailedCount: `${BeasdURL}/${ordersBeasd}/failed/count`,
  GetTotalOrders: `${BeasdURL}/${ordersBeasd}/total`,
};

// Payments End-Point
const paymentsBeasd = "Payments";

export const paymentsPoint = {
  GetPayResponse: `${BeasdURL}/${paymentsBeasd}/response`,
  Webhook: `${BeasdURL}/${paymentsBeasd}/webhook`,
};
// ProductFeedback End-Point
const productFeedbackBeasd = "ProductFeedback";

export const productFeedbackPoint = {
  Post: `${BeasdURL}/${productFeedbackBeasd}`,
  Get: (id: number) => `${BeasdURL}/${productFeedbackBeasd}/${id}`,
  GetAll: (productId: number) =>
    `${BeasdURL}/${productFeedbackBeasd}/${productId}`,
  Delete: (id: number) => `${BeasdURL}/${productFeedbackBeasd}/${id}`,
};

// SiteFeedback End-Point
const siteFeedbackBeasd = "SiteFeedback";
export const siteFeedbackPoint = {
  Post: `${BeasdURL}/${siteFeedbackBeasd}`,
  Get: `${BeasdURL}/${siteFeedbackBeasd}`,
  Delete: (id: number) => `${BeasdURL}/${siteFeedbackBeasd}/${id}`,
};

// interface all api response
export interface data {
  Id: number;
  Name: string;
  Description: string;
  StockStatues: string;
  StockQuantity: number;
  Price: number;
  Rate: number;
  SubCategoryId: number;
  CategoryId: number;
  DiscountPercentage: number;
  DiscountedPrice: number;
  ImageUrl: string;
  Title1: string;
  Body1: string;
  Title2: string;
  Body2: string;
  ProductFeedbacks: any[]; // Optional user reviews property
}
export type card = data[];

// Pagination type
export interface pagenation {
  CurrentPage: number;
  PageSize: number;
  TotalCount: number;
  TotalPages: number;
}
