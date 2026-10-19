import { Metadata } from "next";
import OrderPage from "@/core/components/feature/order/OrderPage";
import { BRAND } from "@/core/constants";

export const metadata: Metadata = {
  title: "Đơn Hàng Của Tôi",
  description:
    `Theo dõi trạng thái và lịch sử đơn hàng của bạn tại ${BRAND.name}. Xem chi tiết đơn hàng, sản phẩm đã mua và tình trạng giao hàng một cách dễ dàng.`,
  keywords: [
    "đơn hàng",
    "lịch sử mua hàng",
    "theo dõi đơn hàng",
    "trạng thái giao hàng",
    BRAND.name,
  ],
  openGraph: {
    title: `Đơn Hàng Của Tôi - ${BRAND.name}`,
    description:
      "Theo dõi và quản lý đơn hàng của bạn. Xem lịch sử mua sắm và trạng thái giao hàng.",
    url: `${BRAND.siteUrl}/orders`,
    type: "website",
  },
  alternates: {
    canonical: `${BRAND.siteUrl}/orders`,
  },
};

export default function UserOrdersPage() {
  return <OrderPage />;
}
