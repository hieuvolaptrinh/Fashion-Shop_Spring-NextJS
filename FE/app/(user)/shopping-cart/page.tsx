import ShoppingCart from "@/core/components/feature/shopping-cart/ShoppingCartPage";
import { Metadata } from "next";
import { BRAND } from "@/core/constants";

export const metadata: Metadata = {
  title: "Giỏ Hàng Của Tôi",
  description:
    `Quản lý giỏ hàng và thanh toán đơn giản tại ${BRAND.name}. Xem lại sản phẩm đã chọn, cập nhật số lượng và hoàn tất đơn hàng nhanh chóng.`,
  keywords: [
    "giỏ hàng",
    "thanh toán",
    "đơn hàng",
    "mua sắm online",
    BRAND.name,
  ],
  openGraph: {
    title: `Giỏ Hàng - ${BRAND.name}`,
    description:
      "Hoàn tất đơn hàng với các sản phẩm thời trang chất lượng cao. Thanh toán an toàn, giao hàng nhanh chóng.",
    url: `${BRAND.siteUrl}/shopping-cart`,
    type: "website",
  },
  alternates: {
    canonical: `${BRAND.siteUrl}/shopping-cart`,
  },
};
export default function ShoppingCartPage() {
  return <ShoppingCart />;
}
