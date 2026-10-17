import { Metadata } from "next";
import OrderPage from "@/core/components/feature/order/OrderPage";

export const metadata: Metadata = {
  title: "Đơn Hàng Của Tôi",
  description:
    "Theo dõi trạng thái và lịch sử đơn hàng của bạn tại Lan Chuyên Hàng Sale. Xem chi tiết đơn hàng, sản phẩm đã mua, tình trạng giao hàng và tổng thanh toán một cách dễ dàng.",
  keywords: [
    "đơn hàng",
    "lịch sử mua hàng",
    "theo dõi đơn hàng",
    "trạng thái giao hàng",
    "Lan chuyên hàng sale",
  ],
  openGraph: {
    title: "Đơn Hàng Của Tôi - Lan Chuyên Hàng Sale",
    description:
      "Theo dõi và quản lý đơn hàng của bạn. Xem lịch sử mua sắm và trạng thái giao hàng.",
    url: "https://lanchuyenhangsale.com/orders",
    type: "website",
  },
  alternates: {
    canonical: "https://lanchuyenhangsale.com/orders",
  },
};

export default function UserOrdersPage() {
  return <OrderPage />;
}
