import { http } from "@/core/lib/apiClient";
import { API_ENDPOINTS } from "@/core/constants";
import type { CategoryItem, ApiResponse } from "@/core/lib/type";

export interface CategoryPayload {
  typeName: string;
  imageUrl?: string;
}

/**
 * Lấy tất cả danh mục sản phẩm kèm số lượng sản phẩm liên kết
 */
export const getCategories = async (): Promise<CategoryItem[]> => {
  const res = await http.get<ApiResponse<CategoryItem[]> | CategoryItem[]>(
    API_ENDPOINTS.PRODUCTS.TYPES
  );
  if (Array.isArray(res)) return res;
  return (res as ApiResponse<CategoryItem[]>)?.data ?? [];
};

/**
 * Lấy chi tiết danh mục theo ID
 */
export const getCategoryById = async (id: number): Promise<CategoryItem> => {
  const res = await http.get<ApiResponse<CategoryItem> | CategoryItem>(
    API_ENDPOINTS.PRODUCTS.TYPE_BY_ID(id)
  );
  return (res as ApiResponse<CategoryItem>)?.data ?? (res as CategoryItem);
};

/**
 * Tạo danh mục sản phẩm mới (Admin)
 */
export const createCategory = async (payload: CategoryPayload): Promise<CategoryItem> => {
  const res = await http.post<ApiResponse<CategoryItem> | CategoryItem>(
    API_ENDPOINTS.PRODUCTS.TYPES,
    payload
  );
  return (res as ApiResponse<CategoryItem>)?.data ?? (res as CategoryItem);
};

/**
 * Cập nhật tên danh mục sản phẩm (Admin)
 */
export const updateCategory = async (
  id: number,
  payload: CategoryPayload
): Promise<CategoryItem> => {
  const res = await http.put<ApiResponse<CategoryItem> | CategoryItem>(
    API_ENDPOINTS.PRODUCTS.TYPE_BY_ID(id),
    payload
  );
  return (res as ApiResponse<CategoryItem>)?.data ?? (res as CategoryItem);
};

/**
 * Xóa danh mục sản phẩm (Admin)
 */
export const deleteCategory = async (id: number): Promise<void> => {
  await http.delete(API_ENDPOINTS.PRODUCTS.TYPE_BY_ID(id));
};

// Re-export hàm upload ảnh dùng chung cho danh mục
export { uploadImage as uploadCategoryImage } from "./images";
