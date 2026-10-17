"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/core/constants";
import { getAuthStatus } from "@/core/lib/authUtils";

export interface GuestGuardState {
  isCheckingAuth: boolean;
  isAuthenticated: boolean;
}

/**
 * Custom Hook bảo vệ các trang chỉ dành cho khách vãng lai (Guest Guard):
 * - Dùng cho các màn hình /login, /register
 * - Nếu người dùng ĐÃ ĐĂNG NHẬP, tự động chuyển hướng an toàn:
 *   + ADMIN -> ROUTES.ADMIN.DASHBOARD
 *   + USER -> ROUTES.USER.HOME
 * - Cung cấp cờ `isCheckingAuth` để ngăn hiện tượng nhấp nháy (flash) biểu mẫu đăng nhập
 */
export const useGuestGuard = (): GuestGuardState => {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const { isAuthenticated: isAuth, isAdmin } = getAuthStatus();

    if (isAuth) {
      setIsAuthenticated(true);
      if (isAdmin) {
        router.replace(ROUTES.ADMIN.DASHBOARD);
      } else {
        router.replace(ROUTES.USER.HOME);
      }
      return;
    }

    setIsCheckingAuth(false);
  }, [router]);

  return {
    isCheckingAuth,
    isAuthenticated,
  };
};
