import RegisterPage from "@/core/components/feature/auth/RegisterPage";
import { Metadata } from "next";
import { BRAND } from "@/core/constants";

export const metadata: Metadata = {
  title: "Đăng Ký Tài Khoản",
  description:
    `Tạo tài khoản miễn phí tại ${BRAND.name} để theo dõi đơn hàng, nhận thông báo ưu đãi và trải nghiệm mua sắm tiện lợi. Đăng ký nhanh chóng, bảo mật cao.`,
  keywords: [
    "đăng ký",
    "tạo tài khoản",
    "thành viên mới",
    "miễn phí",
    BRAND.name,
  ],
  openGraph: {
    title: `Đăng Ký Tài Khoản - ${BRAND.name}`,
    description:
      "Tạo tài khoản miễn phí để nhận ưu đãi và theo dõi đơn hàng dễ dàng.",
    url: `${BRAND.siteUrl}/register`,
    type: "website",
  },
  alternates: {
    canonical: `${BRAND.siteUrl}/register`,
  },
};
export default function page() {
  return <RegisterPage />;
}
