import { http } from "@/core/lib/apiClient";
import { API_ENDPOINTS } from "@/core/constants";

export interface DashboardOrderItem {
  orderId: number;
  totalPrice?: number;
  totalAmount?: number;
  orderStatus?: string;
  status?: string;
  createAt?: string;
  createdAt?: string;
  createdDate?: string;
  userName?: string;
  receiverName?: string;
  customerName?: string;
  phoneNumber?: string;
  receiverPhone?: string;
  paymentMethod?: string;
}

export interface OrderStatusStat {
  status: string;
  count: number;
  fill: string;
}

export interface RevenueStat {
  month: string;
  revenue: number;
  orders: number;
}

export interface DashboardSummary {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  revenueGrowth: number | null;
  ordersToday: number;
  revenueData: RevenueStat[];
  orderStatusData: OrderStatusStat[];
  recentOrders: DashboardOrderItem[];
}

/**
 * Lấy toàn bộ dữ liệu tổng hợp phục vụ màn hình Admin Dashboard từ Backend qua apiClient chuẩn hóa
 */
export async function getDashboardSummary(
  months: number = 6
): Promise<DashboardSummary> {
  try {
    const res = await http.get<any>(API_ENDPOINTS.DASHBOARD.SUMMARY(months));
    const data = res?.data ?? res;

    return {
      totalRevenue: Number(data?.totalRevenue || 0),
      totalOrders: Number(data?.totalOrders || 0),
      totalProducts: Number(data?.totalProducts || 0),
      totalCustomers: Number(data?.totalCustomers || 0),
      revenueGrowth:
        typeof data?.revenueGrowth === "number" ? data.revenueGrowth : null,
      ordersToday: Number(data?.ordersToday || 0),
      revenueData: Array.isArray(data?.revenueData) ? data.revenueData : [],
      orderStatusData: Array.isArray(data?.orderStatusData)
        ? data.orderStatusData
        : [],
      recentOrders: Array.isArray(data?.recentOrders) ? data.recentOrders : [],
    };
  } catch (error) {
    console.error("Dashboard: Lỗi lấy dữ liệu thống kê từ máy chủ:", error);
    throw error;
  }
}

export default getDashboardSummary;
