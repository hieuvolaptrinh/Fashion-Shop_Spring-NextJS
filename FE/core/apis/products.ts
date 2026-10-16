import apiClient, { http } from "@/core/lib/apiClient";
import type { ProductRequest } from "../lib/type";
import { API_ENDPOINTS } from "@/core/constants";

/**
 * Lấy danh sách danh mục / loại sản phẩm
 */
export const getCategories = async () => {
  try {
    const res = await http.get<any>(API_ENDPOINTS.PRODUCTS.TYPES);
    return res?.data ?? res;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

/**
 * Lấy danh sách sản phẩm phân trang và có bộ lọc
 */
export const getProducts = async (filters: any = {}) => {
  try {
    const params = new URLSearchParams();

    params.append("page", (filters.page || 0).toString());
    params.append("size", (filters.size || 10).toString());

    if (filters.productName?.trim()) {
      params.append("productName", filters.productName.trim());
    }

    if (filters.minSalePrice && filters.minSalePrice > 0) {
      params.append("minSalePrice", filters.minSalePrice.toString());
    }

    if (filters.maxSalePrice && filters.maxSalePrice > 0) {
      params.append("maxSalePrice", filters.maxSalePrice.toString());
    }

    if (
      filters.typeId &&
      Array.isArray(filters.typeId) &&
      filters.typeId.length > 0
    ) {
      filters.typeId.forEach((id: number) => {
        params.append("typeId", id.toString());
      });
    }

    const res = await http.get<any>(API_ENDPOINTS.PRODUCTS.BASE, { params });
    return res?.data ?? res;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

/**
 * Cập nhật thông tin sản phẩm và upload ảnh mới
 */
export const updateProduct = async (
  product: ProductRequest,
  files: File[] = [],
  accessToken: string | null = null
) => {
  try {
    const formData = new FormData();

    formData.append(
      "product",
      new Blob([JSON.stringify(product)], {
        type: "application/json",
      })
    );

    if (files && files.length > 0) {
      files.forEach((file) => {
        formData.append("images", file);
      });
    }

    const headers: Record<string, string> = {};
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    const response = await apiClient.put(
      API_ENDPOINTS.PRODUCTS.BY_ID(product.productId),
      formData,
      { headers }
    );

    return response.data;
  } catch (error) {
    console.error("Full error:", error);
    throw error;
  }
};

/**
 * Tạo mới sản phẩm kèm danh sách ảnh
 */
export const createProduct = async (
  product: Omit<ProductRequest, "productId">,
  files: File[] = [],
  accessToken: string | null = null
) => {
  try {
    const formData = new FormData();
    formData.append(
      "product",
      new Blob([JSON.stringify(product)], { type: "application/json" })
    );

    if (files && files.length > 0) {
      files.forEach((file) => {
        formData.append("images", file);
      });
    }

    const headers: Record<string, string> = {};
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    const response = await apiClient.post(
      API_ENDPOINTS.PRODUCTS.BASE,
      formData,
      { headers }
    );

    return response.data;
  } catch (error) {
    console.error("Full error:", error);
    throw error;
  }
};

/**
 * Lấy chi tiết sản phẩm theo ID
 */
export const getProductById = async (productId: number) => {
  try {
    const res = await http.get<any>(API_ENDPOINTS.PRODUCTS.BY_ID(productId));
    return res?.data ?? res;
  } catch (error) {
    console.error("Error fetching product by id:", error);
    throw error;
  }
};

/**
 * Xóa sản phẩm theo ID
 */
export const deleteProduct = async (productID: number) => {
  try {
    const response = await apiClient.delete(
      API_ENDPOINTS.PRODUCTS.BY_ID(productID)
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};
