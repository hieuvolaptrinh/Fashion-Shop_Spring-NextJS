import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { API_BASE_URL } from "@/core/constants";

/**
 * Standard API Client configured with BaseURL, Token Interceptor, and Error Handling
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

// Request Interceptor: Tự động đính kèm accessToken từ localStorage (phía client)
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (token && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // Nếu gửi FormData (upload file/multipart), xóa Content-Type để Axios & trình duyệt tự sinh boundary chuẩn
    if (config.data instanceof FormData) {
      if (config.headers) {
        delete config.headers["Content-Type"];
        if (typeof (config.headers as any).delete === "function") {
          (config.headers as any).delete("Content-Type");
        }
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Xử lý tập trung response và lỗi
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const message =
      error.response?.data?.message ||
      error.message ||
      "Đã có lỗi xảy ra khi kết nối máy chủ";

    if (status === 401) {
      console.warn("apiClient: Phiên đăng nhập hết hạn hoặc chưa xác thực (401).");
    } else if (status === 403) {
      console.warn("apiClient: Không có quyền truy cập tài nguyên này (403).");
    } else if (status >= 500) {
      console.error("apiClient: Lỗi hệ thống Backend (5xx):", message);
    }

    return Promise.reject(error);
  }
);

/**
 * Generic HTTP Request Helpers với TypeScript Type Safety
 */
export const http = {
  get: async <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const res = await apiClient.get<T>(url, config);
    return res.data;
  },

  post: async <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const res = await apiClient.post<T>(url, data, config);
    return res.data;
  },

  put: async <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const res = await apiClient.put<T>(url, data, config);
    return res.data;
  },

  delete: async <T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const res = await apiClient.delete<T>(url, config);
    return res.data;
  },

  patch: async <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const res = await apiClient.patch<T>(url, data, config);
    return res.data;
  },
};

export default apiClient;
