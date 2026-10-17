import ShoppingCart from "@/core/components/feature/shopping-cart/ShoppingCartPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Giỏ Hàng Của Tôi",
  description:
    "Quản lý giỏ hàng và thanh toán đơn giản tại Lan Chuyên Hàng Sale. Xem lại sản phẩm đã chọn, cập nhật số lượng và hoàn tất đơn hàng với nhiều hình thức thanh toán tiện lợi.",
  keywords: [
    "giỏ hàng",
    "thanh toán",
    "đơn hàng",
    "mua sắm online",
    "Lan chuyên hàng sale",
  ],
  openGraph: {
    title: "Giỏ Hàng - Lan Chuyên Hàng Sale",
    description:
      "Hoàn tất đơn hàng với các sản phẩm sale chất lượng cao. Thanh toán an toàn, giao hàng nhanh chóng.",
    url: "https://lanchuyenhangsale.com/shopping-cart",
    type: "website",
  },
  alternates: {
    canonical: "https://lanchuyenhangsale.com/shopping-cart",
  },
};
export default function ShoppingCartPage() {
  return <ShoppingCart />;
}
