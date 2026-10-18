import { http } from "@/core/lib/apiClient";
import { API_ENDPOINTS } from "@/core/constants";
import type { ApiResponse } from "@/core/lib/type";

/**
 * Tải một tệp hình ảnh lên Cloudinary (Dùng chung cho toàn bộ ứng dụng)
 * 
 * @param file - File ảnh (PNG, JPG, WEBP...)
 * @returns Promise<string> - Đường dẫn URL ảnh từ Cloudinary
 */
export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await http.post<ApiResponse<string> | string>(
    API_ENDPOINTS.IMAGES.UPLOAD,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  if (typeof res === "string") return res;
  return (res as ApiResponse<string>)?.data ?? "";
};

/**
 * Xóa một hình ảnh khỏi Cloudinary thông qua URL
 * 
 * @param imageUrl - Đường dẫn URL của ảnh cần xóa
 * @returns Promise<string> - Kết quả xóa ảnh từ server
 */
export const deleteImage = async (imageUrl: string): Promise<string> => {
  const res = await http.delete<ApiResponse<string> | string>(
    API_ENDPOINTS.IMAGES.DELETE,
    {
      params: { imageUrl },
    }
  );

  if (typeof res === "string") return res;
  return (res as ApiResponse<string>)?.data ?? "";
};
