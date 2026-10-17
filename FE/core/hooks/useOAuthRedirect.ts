"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ROUTES } from "@/core/constants";
import { useAuthStore } from "@/core/store/authStore";
import { useCartStore } from "@/core/store/cartStore";

export interface OAuthRedirectState {
  isSuccess: boolean | null;
  errorMessage: string | null;
  countdown: number;
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
 * - Quản lý đồng hồ đếm ngược 5 giây và trạng thái lỗi nếu OAuth2 thất bại
 */
export const useOAuthRedirect = (): OAuthRedirectState => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const loginToStore = useAuthStore((state) => state.login);

  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(5);
  const [isAdmin, setIsAdmin] = useState(false);
  const [targetRoute, setTargetRoute] = useState<string>(ROUTES.USER.HOME);

  // Phân tích tham số từ URL khi mount
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

    // Đồng bộ vào Store
    loginToStore(token, fullName, roles);

    // Âm thầm đồng bộ giỏ hàng tạm lên server
    useCartStore.getState().syncGuestCartToServer();

    setIsSuccess(true);
  }, [searchParams, loginToStore]);

  // Bộ đếm lùi tự động chuyển hướng khi thành công
  useEffect(() => {
    if (isSuccess !== true) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          router.replace(targetRoute);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isSuccess, targetRoute, router]);

  // Nút hành động chuyển hướng ngay lập tức
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
    countdown,
    isAdmin,
    targetRoute,
    handleRedirectNow,
  };
};
