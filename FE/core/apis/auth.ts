import { http } from "@/core/lib/apiClient";
import { API_ENDPOINTS } from "@/core/constants";

export interface LoginResponse {
  userId: number;
  token: string;
  fullName: string;
  roles: string[];
}

export interface RegisterAddressPayload {
  addressName: string;
  provinceName: string;
  districtName?: string;
  wardName: string;
  provinceCode?: string;
  wardCode?: string;
}

export interface RegisterPayload {
  phoneNumber: string;
  fullName: string;
  addressRequest: RegisterAddressPayload;
}

export interface RegisterResponse {
  message?: string;
}

/**
 * Gọi API đăng nhập bằng số điện thoại
 */
export const loginApi = async (phoneNumber: string): Promise<LoginResponse> => {
  const res = await http.post<LoginResponse | { data: LoginResponse }>(
    API_ENDPOINTS.AUTH.LOGIN,
    { phoneNumber }
  );
  return (res as any)?.data ?? res;
};

/**
 * Gọi API đăng ký tài khoản khách hàng mới
 */
export const registerApi = async (payload: RegisterPayload): Promise<string> => {
  const res = await http.post<RegisterResponse | { data: RegisterResponse }>(
    API_ENDPOINTS.AUTH.REGISTER,
    payload
  );
  const data = (res as any)?.data ?? res;
  return data?.message || "Đăng ký tài khoản thành công!";
};
