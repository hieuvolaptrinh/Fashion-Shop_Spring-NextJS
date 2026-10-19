import LoginPage from "@/core/components/feature/auth/LoginPage";
import { Metadata } from "next";
import { BRAND } from "@/core/constants";

export const metadata: Metadata = {
  title: "Đăng Nhập",
  description:
    `Đăng nhập vào tài khoản ${BRAND.name} để trải nghiệm mua sắm tiện lợi, theo dõi đơn hàng và nhận ưu đãi đặc biệt dành riêng cho thành viên.`,
  keywords: [
    "đăng nhập",
    "tài khoản",
    "thành viên",
    "ưu đãi",
    BRAND.name,
  ],
  openGraph: {
    title: `Đăng Nhập - ${BRAND.name}`,
    description:
      "Đăng nhập để trải nghiệm mua sắm và nhận ưu đãi đặc biệt.",
    url: `${BRAND.siteUrl}/login`,
    type: "website",
  },
  alternates: {
    canonical: `${BRAND.siteUrl}/login`,
  },
};
export default function page() {
  return <LoginPage />;
}
