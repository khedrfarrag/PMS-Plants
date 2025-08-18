import React from "react";

// Cart item type
export interface CartItem {
  Id: string;
  ProductId: string;
  ProductName: string;
  Description: string;
  ImageUrl: string;
  Price: number;
  Quantity: number;
  TotalPrice: number;
  AverageRate: string;
}

// Cart context type
export interface CartshopContextType {
  Id: string;
  UserId: string | null;
  TotalQuantity: number;
  TotalPrice: number;
  CartItems: CartItem[];
  cartCount: number;
  cartChanged: boolean;
  setCartCount: React.Dispatch<React.SetStateAction<number>>;
  setCartChanged: React.Dispatch<React.SetStateAction<boolean>>;
  setCartData: React.Dispatch<React.SetStateAction<CartData>>;
  fetchCart: () => Promise<void>;
}

// Cart data type (matches API response)
export interface CartData {
  Id: string;
  UserId: string | null;
  TotalQuantity: number;
  TotalPrice: number;
  CartItems: CartItem[];
}

export const CartshopContext = React.createContext<
  CartshopContextType | undefined
>(undefined);
