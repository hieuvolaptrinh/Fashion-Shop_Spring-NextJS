import { http } from "@/core/lib/apiClient";
import { API_ENDPOINTS } from "@/core/constants";

export interface ShoppingCartProps {
  productId: number;
  quantity: number;
  comboId?: number;
}

export interface UpdateCartProps {
  cartDetailId: number;
  quantity: number;
}

/**
 * Thêm sản phẩm vào giỏ hàng
 */
export const postShoppingCart = async (data: ShoppingCartProps) => {
  return http.post(API_ENDPOINTS.CARTS.ITEMS, data);
};

/**
 * Cập nhật số lượng sản phẩm trong giỏ hàng
 */
export const putShoppingCart = async (data: UpdateCartProps) => {
  return http.put(API_ENDPOINTS.CARTS.ITEMS, data);
};

/**
 * Xóa một sản phẩm khỏi giỏ hàng
 */
export const deleteShoppingCart = async (id: number) => {
  return http.delete(API_ENDPOINTS.CARTS.ITEM_BY_ID(id));
};

/**
 * Lấy toàn bộ sản phẩm trong giỏ hàng của người dùng hiện tại
 */
export const getShoppingCart = async () => {
  return http.get(API_ENDPOINTS.CARTS.BASE);
};
