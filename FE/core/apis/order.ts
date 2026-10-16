import { http } from "@/core/lib/apiClient";
import { API_ENDPOINTS } from "@/core/constants";

export interface OrderItemPayload {
  shippingAddress: string;
  phoneNumber: string;
  selectedIds: number[];
}

export interface OrderFilterRequest {
  status?: string[];
  userId?: number;
  isPay?: boolean;
  isBill?: boolean;
  minTotalPrice?: number;
  maxTotalPrice?: number;
  page?: number;
  size?: number;
}

/**
 * Tạo mới đơn hàng
 */
export const postOrder = async (data: OrderItemPayload, accessToken?: string) => {
  const config = accessToken
    ? { headers: { Authorization: `Bearer ${accessToken}` } }
    : undefined;

  return http.post(API_ENDPOINTS.ORDERS.BASE, data, config);
};

/**
 * Lấy danh sách đơn hàng cho Admin kèm bộ lọc tìm kiếm & phân trang
 */
export const getAllOrders = async (
  filters: OrderFilterRequest = {},
  accessToken?: string
) => {
  try {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        if (Array.isArray(value)) {
          value.forEach((v) => params.append(key, v.toString()));
        } else {
          params.append(key, value.toString());
        }
      }
    });

    const config: any = { params };
    if (accessToken) {
      config.headers = { Authorization: `Bearer ${accessToken}` };
    }

    const res = await http.get<any>(API_ENDPOINTS.ORDERS.ADMIN_FILTER, config);
    return res?.data ?? res;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

/**
 * Lấy danh sách đơn hàng của người dùng hiện tại
 */
export const getOrders = async () => {
  const res = await http.get<any>(API_ENDPOINTS.ORDERS.BASE);
  return res;
};
