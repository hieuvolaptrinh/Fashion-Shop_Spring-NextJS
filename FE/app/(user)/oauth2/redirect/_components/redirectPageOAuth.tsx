"use client";

import React from "react";
import { AlertCircle, Loader2, LogIn } from "lucide-react";
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
    handleRedirectNow,
  } = useOAuthRedirect();

  // Trường hợp OAuth2 thất bại hoặc thiếu token
  if (isSuccess === false) {
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

  // Trạng thái đang xác thực hoặc đang chuyển hướng tức thì
  return (
    <div className="flex min-h-[85vh] items-center justify-center p-4 bg-background">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-xs text-muted-foreground">Đang hoàn tất đăng nhập và chuyển hướng...</p>
      </div>
    </div>
  );
}