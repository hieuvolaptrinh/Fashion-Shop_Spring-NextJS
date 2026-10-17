import { http } from "@/core/lib/apiClient";
import { API_ENDPOINTS } from "@/core/constants";
import type { UserResponse, AddressRequest, AddressResponse } from "@/core/lib/type";
import { registerApi, type RegisterPayload } from "@/core/apis/auth";

/**
 * Lấy thông tin chi tiết của người dùng đang đăng nhập
 * Token Bearer được Request Interceptor của apiClient tự động gắn kèm.
 */
export const getUser = async (): Promise<UserResponse> => {
  try {
    const res = await http.get<UserResponse | { data: UserResponse }>(
      API_ENDPOINTS.USERS.BASE
    );
    return (res as any)?.data ?? res;
  } catch (error) {
    console.error("Lỗi khi tải thông tin người dùng:", error);
    throw error;
  }
};

/**
 * Thêm địa chỉ mới cho người dùng
 */
export const addAddressApi = async (
  data: AddressRequest
): Promise<AddressResponse> => {
  try {
    const res = await http.post<AddressResponse | { data: AddressResponse }>(
      API_ENDPOINTS.USERS.ADDRESS,
      data
    );
    return (res as any)?.data ?? res;
  } catch (error) {
    console.error("Lỗi khi thêm địa chỉ:", error);
    throw error;
  }
};

/**
 * Cập nhật địa chỉ cho người dùng theo addressId
 */
export const updateAddressApi = async (
  addressId: number,
  data: AddressRequest
): Promise<AddressResponse> => {
  try {
    const res = await http.put<AddressResponse | { data: AddressResponse }>(
      API_ENDPOINTS.USERS.ADDRESS_BY_ID(addressId),
      data
    );
    return (res as any)?.data ?? res;
  } catch (error) {
    console.error(`Lỗi khi cập nhật địa chỉ #${addressId}:`, error);
    throw error;
  }
};

/**
 * @deprecated Sử dụng `registerApi` từ `@/core/apis/auth` để có type checking đầy đủ.
 */
export const registerUser = async (userData: RegisterPayload): Promise<string> => {
  return registerApi(userData);
};
