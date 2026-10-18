import apiClient, { http } from "@/core/lib/apiClient";
import type { Product, ProductRequest, PageResponse, ApiResponse } from "../lib/type";
import { API_ENDPOINTS } from "@/core/constants";

// Tái sử dụng hàm getCategories chuẩn hóa từ categories.ts (Single Source of Truth)
export { getCategories } from "@/core/apis/categories";

export interface ProductQueryFilters {
  page?: number;
  size?: number;
  productName?: string;
  minSalePrice?: number;
  maxSalePrice?: number;
  typeId?: number[];
}

/**
 * Lấy danh sách sản phẩm phân trang và có bộ lọc
 */
export const getProducts = async (
  filters: ProductQueryFilters = {}
): Promise<PageResponse<Product>> => {
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

    const res = await http.get<ApiResponse<PageResponse<Product>> | PageResponse<Product>>(
      API_ENDPOINTS.PRODUCTS.BASE,
      { params }
    );
    return (res as ApiResponse<PageResponse<Product>>)?.data ?? (res as PageResponse<Product>);
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
  files: File[] = []
) => {
  try {
    const formData = new FormData();

    formData.append(
      "product",
      new Blob([JSON.stringify(product)], {
        type: "application/json",
      }),
      "product.json"
    );

    if (files && files.length > 0) {
      files.forEach((file) => {
        formData.append("images", file);
      });
    }

    const response = await apiClient.put(
      API_ENDPOINTS.PRODUCTS.BY_ID(product.productId),
      formData
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
  files: File[] = []
) => {
  try {
    const formData = new FormData();
    formData.append(
      "product",
      new Blob([JSON.stringify(product)], { type: "application/json" }),
      "product.json"
    );

    if (files && files.length > 0) {
      files.forEach((file) => {
        formData.append("images", file);
      });
    }

    const response = await apiClient.post(
      API_ENDPOINTS.PRODUCTS.BASE,
      formData
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
export const getProductById = async (productId: number): Promise<Product> => {
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
