import { Suspense } from "react";
import RedrectPageOAuth from "./_components/redirectPageOAuth";

export const metadata = {
  title: "Đăng Nhập ",
  description:
    "Đăng nhập vào tài khoản của bạn để trải nghiệm các sản phẩm sale chất lượng và ưu đãi đặc biệt.",
};
export default function RedrectPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <RedrectPageOAuth />
    </Suspense>
  );
}
