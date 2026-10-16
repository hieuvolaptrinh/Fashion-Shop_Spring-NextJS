import { jwtDecode } from "jwt-decode";
import type { JwtTokenPayload } from "@/core/lib/type";

/**
 * Lấy Access Token an toàn từ LocalStorage (bảo vệ khi render Server-side)
 */
export const getAccessToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
};

/**
 * Lấy thông tin user (tên hiển thị / username) từ LocalStorage
 */
export const getStoredUser = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("user");
};

/**
 * Xóa sạch toàn bộ token và thông tin phiên đăng nhập
 */
export const clearAuth = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
};

/**
 * Giải mã JWT Token một cách an toàn và trả về payload đã định kiểu
 */
export const decodeToken = (token?: string | null): JwtTokenPayload | null => {
  const targetToken = token ?? getAccessToken();
  if (!targetToken) return null;

  try {
    return jwtDecode<JwtTokenPayload>(targetToken);
  } catch (error) {
    console.error("Lỗi giải mã JWT token:", error);
    return null;
  }
};

/**
 * Kiểm tra xem token đã hết hạn (expired) hay chưa
 */
export const isTokenExpired = (decoded: JwtTokenPayload | null): boolean => {
  if (!decoded || typeof decoded.exp !== "number") return true;
  return decoded.exp * 1000 < Date.now();
};

/**
 * Kiểm tra xem token có chứa Role cụ thể hay không (ví dụ "ADMIN")
 */
export const hasRole = (
  decoded: JwtTokenPayload | null,
  role: string
): boolean => {
  if (!decoded || !Array.isArray(decoded.roles)) return false;
  return decoded.roles.includes(role);
};

export interface AuthStatus {
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: string | null;
  payload: JwtTokenPayload | null;
}

/**
 * Kiểm tra toàn diện trạng thái xác thực và quyền Admin hiện tại.
 * Tự động xóa token nếu phát hiện đã hết hạn.
 */
export const getAuthStatus = (): AuthStatus => {
  const token = getAccessToken();
  if (!token) {
    return {
      isAuthenticated: false,
      isAdmin: false,
      user: null,
      payload: null,
    };
  }

  const payload = decodeToken(token);
  if (!payload || isTokenExpired(payload)) {
    clearAuth();
    return {
      isAuthenticated: false,
      isAdmin: false,
      user: null,
      payload: null,
    };
  }

  return {
    isAuthenticated: true,
    isAdmin: hasRole(payload, "ADMIN"),
    user: getStoredUser(),
    payload,
  };
};
