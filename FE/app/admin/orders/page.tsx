import { Metadata } from "next";
import OrderManager from "@/core/components/feature/admin/orders/OrderManager";

export const metadata: Metadata = {
  title: "Quản Lý Đơn Hàng | Admin",
  description: "Trang quản lý đơn hàng, theo dõi giao vận, in bill và cập nhật trạng thái đơn hàng.",
};

export default function AdminOrdersPage() {
  return <OrderManager />;
}
