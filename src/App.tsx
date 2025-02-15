import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NotFound from "./components/shared/NotFound/NotFound";
import UserMaster from "./components/shared/UserMasterLayout/UserMaster";
import Home from "./components/UserModule/Home/Home";
import About from "./components/UserModule/AboutUs/About";
import Store from "./components/UserModule/Store/Store";
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
import ProtectedRoute from "./components/shared/ProtectedRoute/ProtectedRoute";

import '@fortawesome/fontawesome-free/css/all.min.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./App.css";
import AdminMaster from "./components/shared/AdminMasterLayout/AdminMaster";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./context/Context";

function App() {
  const routes = createBrowserRouter([
    // 🌍 Public User Routes
    {
      path: "/dashboard",
      element: <UserMaster />,
      errorElement: <NotFound />,
      children: [
        { index: true, element: <Home /> }, // Home should be the default route
        { path: "about-us", element: <About /> },
        { path: "store", element: <Store /> },
        { path: "payment", element: <Payment /> },
      ],
    },

    // 🔒 Admin Routes (Protected)
    {
      path: "/admin",
      element: (
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminMaster />
        </ProtectedRoute>
      ),
      errorElement: <NotFound />,
      children: [
        { index: true, element: <Dashboard /> }, // Default admin dashboard
        { path: "orders", element: <Orders /> },
        { path: "add-product", element: <AddProduct /> },
        { path: "product-list", element: <ProductsList /> },
        { path: "users-list", element: <UsersList /> },
        { path: "user-info", element: <UserInfo /> },
      ],
    },

    // 🔑 Authentication Routes
    {
      path: "/auth",
      element: <AuthLayout />,
      errorElement: <NotFound />,
      children: [
        { index: true, element: <Login /> }, // Default route for /auth is login
        { path: "register", element: <Register /> },
        { path: "forget-password", element: <ForgetPass /> },
        { path: "reset-password", element: <ResetPass /> },
      ],
    },

    // 🔍 Catch-all for 404
    { path: "*", element: <NotFound /> },
  ]);

  return <>

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
 <AuthProvider>
      <RouterProvider router={routes} />
    </AuthProvider>
  
  </>;
}

export default App;
