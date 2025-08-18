import React from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function Controle() {}

// دالة جلب المنتجات
export interface Product {
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
  ProductFeedbacks: any[];
}

export interface Pagination {
  CurrentPage: number;
  PageSize: number;
  TotalCount: number;
  TotalPages: number;
}

export interface ProductsPointType {
  GetAllProducts: string;
  ProductFilter: string;
  ProductSearch: string;
}

export const Getallproducts = async (
  ProductsPoint: ProductsPointType,
  pageNumber: number,
  pageSize: number,
  setCards: (data: Product[]) => void,
  setPagination: (data: Pagination) => void,
  setLoading: (loading: boolean) => void
) => {
  setLoading(true);
  try {
    const response = await axios.get(ProductsPoint.GetAllProducts, {
      params: { pageNumber, pageSize },
      headers: {
        Authorization: `Bearer ${
          localStorage.getItem("token") || sessionStorage.getItem("token")
        }`,
      },
    });
    setCards(response.data.data || []);
    if (response.data.pagination) {
      setPagination(response.data.pagination);
    } else {
      setPagination({
        CurrentPage: pageNumber,
        PageSize: pageSize,
        TotalCount: (response.data.data || []).length,
        TotalPages: 1,
      });
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    toast.error("فشل في تحميل المنتجات");
  } finally {
    setLoading(false);
  }
};
// دالة فلترة المنتجات حسب الفلاتر
export const filterProducts = async (
  ProductsPoint: ProductsPointType,
  filters: Record<string, any>,
  setCards: (data: Product[]) => void,
  setPagination: (data: Pagination) => void,
  setLoading: (loading: boolean) => void,
  toast: any
) => {
  setLoading(true);
  try {
    const response = await axios.get(ProductsPoint.ProductFilter, {
      params: filters,
      headers: {
        Authorization: `Bearer ${
          localStorage.getItem("token") || sessionStorage.getItem("token")
        }`,
      },
    });
    setCards(response.data.data || []);
    if (response.data.pagination) {
      setPagination(response.data.pagination);
    }
  } catch (error) {
    toast.error("فشل في تحميل المنتجات حسب الفلاتر");
  } finally {
    setLoading(false);
  }
};
// دالة البحث عن المنتج بالاسم
export const searchProduct = async (
  ProductsPoint: ProductsPointType,
  searchName: string,
  setCards: (data: Product[]) => void,
  setPagination: (data: Pagination) => void,
  setLoading: (loading: boolean) => void,
  toast: any,
  pageNumber?: number,
  pageSize?: number
): Promise<void> => {
  setLoading(true);
  try {
    const response = await axios.get(ProductsPoint.ProductSearch, {
      params: { productName: searchName, pageNumber, pageSize },
      headers: {
        Authorization: `Bearer ${
          localStorage.getItem("token") || sessionStorage.getItem("token")
        }`,
      },
    });
    setCards(response.data.data || []);
    if (response.data.pagination) {
      setPagination(response.data.pagination);
    }
    if (Array.isArray(response.data.data) && response.data.data.length === 0) {
      toast.info("لا يوجد منتجات بهذا الاسم");
    }
  } catch (error) {
    toast.error(
      (error as any)?.response?.data?.Errors?.[0] || "فشل في البحث عن المنتجات"
    );
  } finally {
    setLoading(false);
  }
};

// دالة إضافة للسلة
export interface CartShopPointType {
  Post: string;
}
export interface CartItem {
  ProductId: number;
  Quantity: number;
}
export const Addcartapi = async (
  cartShopPoint: CartShopPointType,
  data: CartItem,
  setCounts: (
    cb: (prev: Record<number, number>) => Record<number, number>
  ) => void,
  toast: any,
  fetchCart?: () => Promise<void>
) => {
  try {
    const requestBody = { CartItems: [data] };
    
    // التحقق من وجود توكن (المستخدم مسجل دخول)
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    const isLoggedIn = !!token;
    
    const headers: any = {
      Authorization: `Bearer ${token}`,
    };
    
    // إذا كان المستخدم غير مسجل دخول، أضف session-Id
    if (!isLoggedIn) {
      let sessionId = sessionStorage.getItem("session-Id");
      if (!sessionId) {
        sessionId = Math.random().toString(36).substring(2, 15);
        sessionStorage.setItem("session-Id", sessionId);
      }
      headers["session-Id"] = sessionId;
    }

    const response = await axios.post(`${cartShopPoint.Post}`, requestBody, {
      headers,
    });
    if (response.data ) {
      toast.success("تم إضافة المنتج إلى السلة بنجاح");
      setCounts((prev) => ({ ...prev, [data.ProductId]: 1 }));
      
      // بدلاً من window.location.reload() - تحديث السلة من الـ context
      if (fetchCart) {
        await fetchCart();
      }
    } else {
      toast.error("فشل في إضافة المنتج إلى السلة");
    }
  } catch (error) {
    toast.error("فشل في إضافة المنتج إلى السلة");
  }
};

// جلب الفئات
export interface CategoryPointType {
  GetAllCategories: string;
  Getsubcategories: (categoryId: number) => string;
}
export const fetchCategories = async (
  CategoryPoint: CategoryPointType,
  setCategories: (data: any) => void,
  toast: any
) => {
  try {
    const response = await axios.get(CategoryPoint.GetAllCategories);
    setCategories(response.data);
  } catch (error) {
    toast.error("فشل في تحميل الفئات");
  }
};

// جلب الفرعيات
export const fetchSubCategories = async (
  CategoryPoint: CategoryPointType,
  categoryId: number,
  setSubCategories: (data: any) => void,
  toast: any
) => {
  try {
    const response = await axios.get(
      CategoryPoint.Getsubcategories(categoryId)
    );
    setSubCategories(response.data);
  } catch (error) {
    toast.error("فشل في تحميل التصنيفات الفرعية");
  }
};
