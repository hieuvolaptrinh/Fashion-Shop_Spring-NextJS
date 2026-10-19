"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Phone, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/core/components/ui/button";
import { Input } from "@/core/components/ui/input";
import { Label } from "@/core/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { IMAGES, ROUTES } from "@/core/constants";
import { useLoginForm } from "@/core/hooks/useLoginForm";
import { OAuthSocialButtons } from "./OAuthSocialButtons";

export const LoginPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    errors,
    isLoading,
    isCheckingAuth,
    showPassword,
    setShowPassword,
  } = useLoginForm();

  // Hiển thị trạng thái kiểm tra phiên đăng nhập để tránh flash form
  if (isCheckingAuth) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background">
      <Card className="w-full max-w-md border border-border/80 bg-card shadow-sm rounded-2xl">
        <CardHeader className="text-center space-y-2 pb-6">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl overflow-hidden shadow-xs">
            <Image
              src={IMAGES.LOGO}
              alt="Logo HALOKAKI"
              width={60}
              height={60}
              className="h-full w-full object-cover"
              priority
            />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
            Đăng Nhập
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Nhập số điện thoại và mật khẩu để tiếp tục mua sắm và quản lý tài khoản.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Phone & Password Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="phoneNumber" className="text-xs font-medium text-foreground">
                Số điện thoại
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="Ví dụ: 0988888888"
                  className="pl-9 h-10 rounded-xl border-border"
                  {...register("phoneNumber")}
                />
              </div>
              {errors.phoneNumber && (
                <p className="text-xs text-destructive">{errors.phoneNumber.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-medium text-foreground">
                Mật khẩu
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu của bạn"
                  className="pl-9 pr-10 h-10 rounded-xl border-border"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
                  aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-10 rounded-xl font-medium shadow-xs gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <span>Đăng Nhập</span>
              )}
            </Button>
          </form>

          {/* Social Logins */}
          <OAuthSocialButtons label="Hoặc đăng nhập với" />

          {/* Register Link */}
          <p className="text-center text-xs text-muted-foreground pt-1">
            Chưa có tài khoản?{" "}
            <Link
              href={ROUTES.AUTH.REGISTER}
              className="font-medium text-primary hover:underline transition-colors"
            >
              Đăng ký ngay
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
