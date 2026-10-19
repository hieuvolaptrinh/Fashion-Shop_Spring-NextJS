"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { loginApi } from "@/core/apis/auth";
import { ROUTES } from "@/core/constants";
import { useAuthStore } from "@/core/store/authStore";
import { useCartStore } from "@/core/store/cartStore";
import {
  type LoginFormValues,
  loginSchema,
} from "@/core/validations/auth.schema";
import { useGuestGuard } from "./useGuestGuard";

export const useLoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const loginToStore = useAuthStore((state) => state.login);

  // Ngăn chặn người dùng đã đăng nhập vào lại màn hình login
  const { isCheckingAuth } = useGuestGuard();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phoneNumber: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      setIsLoading(true);
      const data = await loginApi(values.phoneNumber, values.password);

      if (data?.token) {
        const isAdmin = (data.roles || []).includes("ADMIN");
        loginToStore(data.token, data.fullName || "Khách hàng", data.roles || []);

        // Âm thầm đồng bộ giỏ hàng tạm lên server và dọn dẹp LocalStorage
        await useCartStore.getState().syncGuestCartToServer();

        toast.success(`Chào mừng ${data.fullName || "bạn"} quay trở lại!`);

        const redirectUrl = searchParams.get("redirect");

        if (isAdmin) {
          router.push(ROUTES.ADMIN.DASHBOARD);
        } else if (redirectUrl) {
          router.push(redirectUrl);
        } else {
          router.push(ROUTES.USER.HOME);
        }
      } else {
        toast.error("Không nhận được dữ liệu xác thực từ máy chủ");
      }
    } catch (error: any) {
      console.error("Lỗi đăng nhập:", error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Số điện thoại hoặc mật khẩu không chính xác"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isLoading,
    isCheckingAuth,
    showPassword,
    setShowPassword,
  };
};
