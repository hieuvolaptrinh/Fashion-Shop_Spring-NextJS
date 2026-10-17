import { Suspense } from "react";
import RedirectPageOAuth from "./_components/redirectPageOAuth";

export const metadata = {
  title: "Xác thực Đăng nhập - Lan Chuyên Hàng Sale",
  description:
    "Đang xác thực thông tin tài khoản và chuyển hướng về trang chủ...",
};

export default function RedirectPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">Đang tải...</div>}>
      <RedirectPageOAuth />
    </Suspense>
  );
}
