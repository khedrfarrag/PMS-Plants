import { createRoot } from "react-dom/client";
import "./index.css";
import "./App.css";
import AuthContextProvider from "./context/Context.tsx";
import { ContactMessageProvider } from "./context/ContactMessageContext";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NotFound from "./components/shared/NotFound/NotFound";
import UserMaster from "./components/shared/UserMasterLayout/UserMaster";
import Home from "./components/UserModule/Home/Home";
import About from "./components/UserModule/AboutUs/About";
import Store from "./components/UserModule/Store/component/Store";
import AuthLayout from "./components/shared/AuthLayout/AuthLayout";
import Login from "./components/Authintcations/Login/Login";
import Register from "./components/Authintcations/Register/Register";
import ForgetPass from "./components/Authintcations/ForgetPass/ForgetPass";
import ResetPass from "./components/Authintcations/ResetPass/ResetPass";
import Dashboard from "./components/AdminModule/Home/Dashboard";
import Orders from "./components/AdminModule/orders/Orders";
import UsersList from "./components/AdminModule/Users/UsersList";
import UserInfo from "./components/AdminModule/Users/UserInfo/UserInfo";
import AddProduct from "./components/AdminModule/Products/Add/AddProduct";
import ProductsList from "./components/AdminModule/Products/views/ProductsList";
import Payment from "./components/UserModule/Payment/Payment";
import AdminMaster from "./components/shared/AdminMasterLayout/AdminMaster";
import ProtectedRoute from "./components/shared/ProtectedRoute/ProtectedRoute";
import Offer from "./components/UserModule/offers/Offer";
import ContactUs from "./components/UserModule/ContactUs/ContactUs";
import Product from "./components/UserModule/Store/component/productdetails/Product";
import Shoppingcart from "./components/UserModule/Shoppingcart/Shoppingcart";
import Landreclamation from "./components/UserModule/services/Landreclamation";
import Tasahilservice from "./components/UserModule/services/Tasahilservice";
import CastomerSupport from "./components/UserModule/services/CastomerSupport";
import ProductView from "./components/AdminModule/Products/views/productview/ProductView";
import OTP from "./components/Authintcations/OTP/OTP";
import AddCategores from "./components/AdminModule/Categores/AddCategores";
import CategoriesList from "./components/AdminModule/Categores/CategoiesList/CategoriesList";
import Favorites from "./components/UserModule/Favorites/Favorites";
import Popular from "./components/UserModule/Home/PopularProduct/Popular";
import ManagementUser from "./components/UserModule/controller/AcountManage/ManagementUser";
import ProductPopular from "./components/AdminModule/ProductPopular/ProductPopular";
import ContactMessage from "./components/AdminModule/ContactMessage/ContactMessage";
import AdminRegister from "./components/Authintcations/AdminRegister/AdminRegister";
import { ToastContainer } from "react-toastify";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./App.css";
import Setting from "./components/AdminModule/setting/AdminSetting/Setting.tsx";
import ChangePassword from "./components/AdminModule/setting/changePassword/ChangePassword.tsx";
import ResetPassword from "./components/AdminModule/setting/resetPassword/ResetPassword.tsx";
import { CartshopProvider } from "./context/ContextCartshop.tsx";
import Ouroffers from "./components/UserModule/Home/Ouroffers/Ouroffers.tsx";

const routes = [
  // 🌍 Public User Routes
  {
    path: "/",
    element: <UserMaster />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      { path: "home", element: <Home /> },
      { path: "about-us", element: <About /> },
      { path: "store", element: <Store /> },
      { path: "store/product/:id", element: <Product /> },
      { path: "store/productcart", element: <Shoppingcart /> },
      // { path: "our-offers", element: <Ouroffers /> },
      { path: "favorites", element: <Favorites /> },
      { path: "offers", element: <Offer /> },
      { path: "contact-us", element: <ContactUs /> },
      { path: "populer", element: <Popular /> },
      { path: "service/landre-clamation", element: <Landreclamation /> },
      { path: "service/castomer-Support", element: <CastomerSupport /> },
      { path: "service/Tasahil-service", element: <Tasahilservice /> },
      { path: "account-settings", element: <ManagementUser /> },
      {
        path: "payment",
        element: (
          // <ProtectedRoute>
          <Payment />
          // </ProtectedRoute>
        ),
      },
    ],
  },
  // 🔒 Admin Routes (Protected)
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <AdminMaster />
      </ProtectedRoute>
    ),
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "orders", element: <Orders /> },
      { path: "product-list", element: <ProductsList /> },
      { path: "add-product", element: <AddProduct /> },
      { path: "add-product/:id", element: <AddProduct /> },
      { path: "product-view/:id", element: <ProductView /> },
      { path: "product-popular", element: <ProductPopular /> },
      { path: "categore-list", element: <CategoriesList /> },
      { path: "add-categore", element: <AddCategores /> },
      { path: "add-categore/:id", element: <AddCategores /> },
      { path: "categore-view/:id", element: <AddCategores /> },
      { path: "users-list", element: <UsersList /> },
      { path: "users-list/:id", element: <UserInfo /> },
      { path: "contact-message", element: <ContactMessage /> },
      { path: "setting", element: <Setting /> },
      { path: "change-password", element: <ChangePassword /> },
      { path: "reset-password", element: <ResetPassword /> },
    ],
  },
  // 🔑 Authentication Routes
  {
    path: "/auth",
    element: <AuthLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Login /> },
      { path: "login", element: <Login /> },
      { path: "admin-register", element: <AdminRegister /> },
      { path: "verify-email", element: <OTP /> },
      { path: "register", element: <Register /> },
      { path: "forget-password", element: <ForgetPass /> },
      { path: "reset-password", element: <ResetPass /> },
    ],
  },
  // 🔍 Catch-all for 404
  { path: "*", element: <NotFound /> },
];

const router = createBrowserRouter(routes);
createRoot(document.getElementById("root")!).render(
  <AuthContextProvider>
    <CartshopProvider>
      <ContactMessageProvider>
        <RouterProvider router={router} />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={true} // Right-to-left for Arabic
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </ContactMessageProvider>
    </CartshopProvider>
  </AuthContextProvider>
);
