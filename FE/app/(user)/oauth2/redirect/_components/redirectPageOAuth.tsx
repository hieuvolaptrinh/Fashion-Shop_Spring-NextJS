"use client";

import React from "react";
import { CheckCircle, AlertCircle, Home, ShieldAlert, Loader2, LogIn } from "lucide-react";
import { Button } from "@/core/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { useOAuthRedirect } from "@/core/hooks/useOAuthRedirect";

export default function RedirectPageOAuth() {
  const {
    isSuccess,
    errorMessage,
    countdown,
    isAdmin,
    handleRedirectNow,
  } = useOAuthRedirect();

  // Trạng thái đang đọc và phân tích token từ URL
  if (isSuccess === null) {
    return (
      <div className="flex min-h-[85vh] items-center justify-center p-4 bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-xs text-muted-foreground">Đang xác thực thông tin tài khoản...</p>
        </div>
      </div>
    );
  }

  // Trường hợp OAuth2 thất bại hoặc thiếu token
  if (!isSuccess) {
    return (
      <div className="flex min-h-[85vh] items-center justify-center p-4 bg-background">
        <Card className="mx-auto w-full max-w-md border border-border/80 bg-card shadow-sm rounded-2xl">
          <CardHeader className="space-y-4 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/15 text-destructive">
              <AlertCircle className="h-8 w-8" />
            </div>
            <div>
              <CardTitle className="text-center text-2xl font-bold text-foreground">
                Đăng nhập không thành công
              </CardTitle>
              <CardDescription className="mt-2 text-xs text-muted-foreground">
                {errorMessage || "Đã xảy ra lỗi trong quá trình xác thực mạng xã hội."}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <Button
              onClick={handleRedirectNow}
              className="w-full h-10 rounded-xl font-medium gap-2"
              size="lg"
            >
              <LogIn className="h-4 w-4" />
              <span>Quay lại trang Đăng nhập</span>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Trường hợp OAuth2 thành công
  return (
    <div className="flex min-h-[85vh] items-center justify-center p-4 bg-background">
      <Card className="mx-auto w-full max-w-md border border-border/80 bg-card shadow-sm rounded-2xl">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-success/15 text-success">
            <CheckCircle className="h-8 w-8" />
          </div>
          <div>
            <CardTitle className="text-center text-2xl font-bold text-foreground">
              Đăng nhập thành công!
            </CardTitle>
            <CardDescription className="mt-2 text-xs text-muted-foreground">
              {isAdmin
                ? "Chào mừng Quản trị viên đã đăng nhập thành công vào hệ thống quản lý."
                : "Chào mừng bạn đã quay trở lại với Lan Chuyên Hàng Sale."}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <div className="text-center">
              <p className="mb-2 text-xs text-muted-foreground">
                Tự động chuyển về {isAdmin ? "Trang quản trị" : "Trang chủ"} sau{" "}
                <span className="font-semibold text-primary">{countdown}</span> giây
              </p>
              <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-1000 rounded-full"
                  style={{ width: `${((5 - countdown) / 5) * 100}%` }}
                />
              </div>
            </div>

            <Button
              onClick={handleRedirectNow}
              className="w-full h-10 rounded-xl font-medium gap-2"
              size="lg"
            >
              {isAdmin ? (
                <>
                  <ShieldAlert className="h-4 w-4" />
                  <span>Về trang Quản trị ngay</span>
                </>
              ) : (
                <>
                  <Home className="h-4 w-4" />
                  <span>Về trang chủ ngay</span>
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}