import LoginPage from "@/core/components/feature/auth/LoginPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đăng Nhập",
  description:
    "Đăng nhập vào tài khoản Lan Chuyên Hàng Sale để trải nghiệm mua sắm cá nhân hóa, theo dõi đơn hàng và nhận ưu đãi đặc biệt dành riêng cho thành viên.",
  keywords: [
    "đăng nhập",
    "tài khoản",
    "thành viên",
    "ưu đãi",
    "Lan chuyên hàng sale",
  ],
  openGraph: {
    title: "Đăng Nhập - Lan Chuyên Hàng Sale",
    description:
      "Đăng nhập để trải nghiệm mua sắm cá nhân hóa và nhận ưu đãi đặc biệt.",
    url: "https://lanchuyenhangsale.com/login",
    type: "website",
  },
  alternates: {
    canonical: "https://lanchuyenhangsale.com/login",
  },
};
export default function page() {
  return <LoginPage />;
}
