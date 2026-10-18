"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ROUTES } from "@/core/constants";
import { useAuthStore } from "@/core/store/authStore";
import { useCartStore } from "@/core/store/cartStore";
import { toast } from "sonner";

export interface OAuthRedirectState {
  isSuccess: boolean | null;
  errorMessage: string | null;
  isAdmin: boolean;
  targetRoute: string;
  handleRedirectNow: () => void;
}

/**
 * Custom Hook Presenter xử lý callback chuyển hướng OAuth2 (Google, Facebook):
 * - Đọc và phân tích an toàn token, fullName, roles và error từ query params
 * - Đồng bộ phiên đăng nhập vào Zustand `useAuthStore`
 * - Tự động đồng bộ giỏ hàng tạm lên server nếu có
 * - Tự động phát hiện quyền Admin để điều hướng chính xác về Dashboard hoặc Trang chủ/Giỏ hàng
 * - Chuyển hướng ngay lập tức (Instant Redirect) kèm thông báo toast thành công
 * - Xử lý hiển thị thông báo lỗi nếu OAuth2 thất bại
 */
export const useOAuthRedirect = (): OAuthRedirectState => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const loginToStore = useAuthStore((state) => state.login);

  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [targetRoute, setTargetRoute] = useState<string>(ROUTES.USER.HOME);

  useEffect(() => {
    const errorParam = searchParams.get("error");
    const token = searchParams.get("token");
    const fullName = searchParams.get("fullName") || "Khách hàng";
    const rolesStr = searchParams.get("roles") || "";

    if (errorParam || !token) {
      setIsSuccess(false);
      setErrorMessage(
        errorParam
          ? decodeURIComponent(errorParam)
          : "Không tìm thấy dữ liệu xác thực OAuth2 từ máy chủ."
      );
      return;
    }

    const roles = rolesStr ? rolesStr.split(",") : [];
    const hasAdminRole = roles.includes("ADMIN");

    const guestItems = useCartStore.getState().loadGuestCart();
    const hasGuestCart = guestItems.length > 0;

    setIsAdmin(hasAdminRole);
    const destination = hasAdminRole
      ? ROUTES.ADMIN.DASHBOARD
      : hasGuestCart
      ? ROUTES.USER.CART
      : ROUTES.USER.HOME;
    setTargetRoute(destination);

    loginToStore(token, fullName, roles);

    useCartStore.getState().syncGuestCartToServer();

    setIsSuccess(true);
    toast.success("Đăng nhập thành công!");

    router.replace(destination);
  }, [searchParams, loginToStore, router]);

  const handleRedirectNow = () => {
    if (isSuccess) {
      router.replace(targetRoute);
    } else {
      router.replace(ROUTES.AUTH.LOGIN);
    }
  };

  return {
    isSuccess,
    errorMessage,
    isAdmin,
    targetRoute,
    handleRedirectNow,
  };
};
