import RegisterPage from "core/components/feature/auth/registerPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đăng Ký Tài Khoản",
  description:
    "Tạo tài khoản miễn phí tại Lan Chuyên Hàng Sale để theo dõi đơn hàng, nhận thông báo ưu đãi và trải nghiệm mua sắm cá nhân hóa. Đăng ký nhanh chóng, bảo mật cao.",
  keywords: [
    "đăng ký",
    "tạo tài khoản",
    "thành viên mới",
    "miễn phí",
    "Lan chuyên hàng sale",
  ],
  openGraph: {
    title: "Đăng Ký Tài Khoản - Lan Chuyên Hàng Sale",
    description:
      "Tạo tài khoản miễn phí để nhận ưu đãi và theo dõi đơn hàng dễ dàng.",
    url: "https://lanchuyenhangsale.com/register",
    type: "website",
  },
  alternates: {
    canonical: "https://lanchuyenhangsale.com/register",
  },
};
export default function page() {
  return <RegisterPage />;
}
