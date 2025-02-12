import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
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

function App() {
  // const navigate = useNavigate();
  const LoginData = {
    role: "admin",
  };
  const routes = createBrowserRouter([
    {
      // Public Routes: Homepage, aboutus, store accessible to all, including guests
      path: "",
      element: <UserMaster />,
      errorElement: <NotFound />,
      children: [
        { path: "home-page", element: <Home /> },
        { path: "about-us", element: <About /> },
        { path: "store", element: <Store /> },
        { path: "payment", element: <Payment /> },
        // { path: "room-details/:roomId", element: <RoomDetail /> },

        //  admin routes
        {
          path: "home-dashboard",
          element:
            LoginData?.role === "admin" ? (
              <Navigate to={"/dashboard"} replace />
            ) : (
              <Navigate to={"/home-page"} replace />
              // <Home />
            ),
        },
        { path: "dashboard", element: <Dashboard /> },
        { path: "orders", element: <Orders /> },
        { path: "add-product", element: <AddProduct /> },
        { path: "product-list", element: <ProductsList /> },
        { path: "users-list", element: <UsersList /> },
        { path: "user-info", element: <UserInfo /> },
      ],
    },

    // Auth Routes: login, register, forget password, reset password
    {
      path: "login",
      element: <AuthLayout />,
      errorElement: <NotFound />,
      children: [
        { index: true, element: <Login /> },
        { path: "login", element: <Login /> },
        { path: "register", element: <Register /> },
        { path: "forget-password", element: <ForgetPass /> },
        { path: "reset-password", element: <ResetPass /> },
      ],
    },
  ]);
  return (
    <>
      <RouterProvider router={routes}></RouterProvider>
    </>
  );
}

export default App;
