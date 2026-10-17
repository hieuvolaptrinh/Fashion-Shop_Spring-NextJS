import { Truck, Clock, RotateCcw, ShieldCheck, type LucideIcon } from "lucide-react";
import { formatCurrency } from "@/core/lib/utils";


/**
 * Cấu hình phí vận chuyển và chính sách giỏ hàng
 */
export const SHIPPING_CONFIG = {
  /** Ngưỡng tổng tiền hàng để được miễn phí vận chuyển (VND) */
  FREE_SHIPPING_THRESHOLD: 500000,
  /** Phí vận chuyển tiêu chuẩn toàn quốc (VND) */
  DEFAULT_SHIPPING_FEE: 30000,
} as const;

/** Số lượng sản phẩm hiển thị trên mỗi trang trong giỏ hàng */
export const CART_ITEMS_PER_PAGE = 5;

export interface ShippingPolicyItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

/**
 * Danh sách cam kết dịch vụ & chính sách vận chuyển tự động tính toán theo cấu hình
 */
export const getShippingPolicies = (): ShippingPolicyItem[] => [
  {
    icon: Truck,
    title: `Miễn phí giao hàng từ ${formatCurrency(SHIPPING_CONFIG.FREE_SHIPPING_THRESHOLD)}`,
    description: "Áp dụng cho mọi đơn hàng đạt ngưỡng trên toàn quốc",
  },
  {
    icon: Clock,
    title: "Giao hàng từ 2 - 4 ngày toàn quốc",
    description: "Đóng gói cẩn thận, theo dõi lộ trình đơn hàng dễ dàng",
  },
  {
    icon: RotateCcw,
    title: "Hỗ trợ đổi hàng trong 30 ngày",
    description: "Đổi size hoặc đổi mẫu nếu sản phẩm còn nguyên tem mác",
  },
  {
    icon: ShieldCheck,
    title: "Kiểm tra hàng trước khi nhận (Đồng kiểm)",
    description: "Kiểm tra đúng sản phẩm trước khi thanh toán cho shipper",
  },
];
