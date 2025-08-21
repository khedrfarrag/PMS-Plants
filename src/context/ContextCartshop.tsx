import axios from "axios";
import React, { useEffect, useState, useCallback, useContext } from "react";
import { cartShopPoint } from "../constant/Const";
import { CartshopContext, CartData } from "./CartshopContext";
import { toast } from "react-toastify";
import { AuthContext } from "./Context";

const defaultCartData: CartData = {
  Id: "",
  UserId: null,
  TotalQuantity: 0,
  TotalPrice: 0,
  CartItems: [],
};

export const CartshopProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { userData }: any | null = useContext(AuthContext);
  const [cartData, setCartData] = useState<CartData>(defaultCartData);
  const [cartCount, setCartCount] = useState(0);
  const [cartChanged, setCartChanged] = useState(false);

  const fetchCart = useCallback(async () => {
    try {
      const sessionId = sessionStorage.getItem("session-Id");

      const response = await axios.get(cartShopPoint.GetAllCartShop, {
        headers: {
          "session-Id": sessionId, // إضافة session-Id للهيدر
          Authorization: `Bearer ${
            localStorage.getItem("token") || sessionStorage.getItem("token")
          }`,
        },
      });
      const data = response?.data;

      if (data) {
        // Detect cart change for animation
        if (data.TotalQuantity > cartData.TotalQuantity) {
          setCartChanged(true);
          setTimeout(() => setCartChanged(false), 700);
        }
        setCartData(data);
        setCartCount(data.TotalQuantity || 0);
      }
    } catch (error) {}
  }, [cartData.TotalQuantity]);

  useEffect(() => {
    fetchCart();
    // Optionally, add polling or subscribe to cart changes here
    // eslint-disable-next-line
  }, []);

  return (
    <CartshopContext.Provider
      value={{
        ...cartData,
        cartCount,
        cartChanged,
        setCartCount,
        setCartChanged,
        setCartData,
        fetchCart,
      }}
    >
      {children}
    </CartshopContext.Provider>
  );
};
