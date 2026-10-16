"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/core/constants";
import { getAuthStatus } from "@/core/lib/authUtils";

export interface AdminAuthState {
  isAdmin: boolean | null;
  isLoading: boolean;
}

/**
 * Custom Hook bảo vệ các tuyến đường Admin (Admin Route Guard):
 * - Tự động kiểm tra tính hợp lệ và thời hạn của JWT Token
 * - Kiểm tra phân quyền vai trò "ADMIN"
 * - Điều hướng về trang đăng nhập nếu chưa auth / hết hạn
 * - Điều hướng về trang chủ nếu tài khoản không có quyền Admin
 */
export const useAdminAuth = (): AdminAuthState => {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const { isAuthenticated, isAdmin: hasAdminRole } = getAuthStatus();

    if (!isAuthenticated) {
      setIsAdmin(false);
      router.replace(ROUTES.AUTH.LOGIN);
      return;
    }

    if (!hasAdminRole) {
      setIsAdmin(false);
      router.replace(ROUTES.USER.HOME);
      return;
    }

    setIsAdmin(true);
  }, [router]);

  return {
    isAdmin,
    isLoading: isAdmin === null,
  };
};
