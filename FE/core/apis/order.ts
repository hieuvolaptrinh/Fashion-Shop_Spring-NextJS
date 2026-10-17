import { http } from "@/core/lib/apiClient";
import { API_ENDPOINTS } from "@/core/constants";
import type { OrderResponse, ApiResponse, PageResponse } from "@/core/lib/type";

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
export const postOrder = async (data: OrderItemPayload) => {
  return http.post<ApiResponse<OrderResponse>>(API_ENDPOINTS.ORDERS.BASE, data);
};

/**
 * Lấy danh sách đơn hàng cho Admin kèm bộ lọc tìm kiếm & phân trang
 */
export const getAllOrders = async (
  filters: OrderFilterRequest = {}
): Promise<PageResponse<OrderResponse>> => {
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

  return http.get<PageResponse<OrderResponse>>(
    API_ENDPOINTS.ORDERS.ADMIN_FILTER,
    { params }
  );
};

/**
 * Lấy danh sách đơn hàng của người dùng hiện tại
 */
export const getOrders = async (): Promise<OrderResponse[]> => {
  const res = await http.get<ApiResponse<OrderResponse[]> | OrderResponse[]>(
    API_ENDPOINTS.ORDERS.BASE
  );
  return Array.isArray(res) ? res : res?.data ?? [];
};

/**
 * Hủy đơn hàng (Kiểm tra quyền phía backend: khách hàng chủ đơn hoặc Quản trị viên)
 */
export const cancelOrder = async (orderId: number) => {
  return http.post(API_ENDPOINTS.ORDERS.CANCEL(orderId), {});
};

/**
 * Cập nhật trạng thái đơn hàng (Dành cho Quản trị viên)
 */
export const updateOrderStatus = async (orderId: number, status: string) => {
  return http.put(API_ENDPOINTS.ORDERS.STATUS(orderId, status));
};
