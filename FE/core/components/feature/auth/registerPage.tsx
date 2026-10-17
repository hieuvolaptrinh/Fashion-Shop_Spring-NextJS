"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Loader2, Phone, User, MapPin } from "lucide-react";
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
import { useRegisterForm } from "@/core/hooks/useRegisterForm";
import { RegisterAddressFields } from "./RegisterAddressFields";
import { OAuthSocialButtons } from "./OAuthSocialButtons";

export const RegisterPage: React.FC = () => {
  const {
    control,
    register,
    handleSubmit,
    errors,
    isSubmitting,
    provinces,
    wards,
    isLoadingLocation,
    handleProvinceChange,
    handleWardChange,
    isCheckingAuth,
  } = useRegisterForm();

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
      <Card className="w-full max-w-lg border border-border/80 bg-card shadow-sm rounded-2xl">
        <CardHeader className="text-center space-y-2 pb-6">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl overflow-hidden shadow-xs">
            <Image
              src={IMAGES.LOGO}
              alt="Logo Lan Chuyên Hàng Sales"
              width={60}
              height={60}
              className="h-full w-full object-cover"
              priority
            />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
            Đăng Ký Tài Khoản
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Nhập thông tin cá nhân và địa chỉ nhận hàng để trải nghiệm mua sắm nhanh chóng.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Số điện thoại */}
            <div className="space-y-1.5">
              <Label htmlFor="phoneNumber" className="text-xs font-medium text-foreground">
                Số điện thoại <span className="text-destructive">*</span>
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

            {/* Họ và tên */}
            <div className="space-y-1.5">
              <Label htmlFor="fullName" className="text-xs font-medium text-foreground">
                Họ và tên <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Ví dụ: Nguyễn Văn An"
                  className="pl-9 h-10 rounded-xl border-border"
                  {...register("fullName")}
                />
              </div>
              {errors.fullName && (
                <p className="text-xs text-destructive">{errors.fullName.message}</p>
              )}
            </div>

            {/* Địa chỉ chi tiết */}
            <div className="space-y-1.5">
              <Label htmlFor="addressName" className="text-xs font-medium text-foreground">
                Địa chỉ chi tiết (Số nhà, tên đường) <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="addressName"
                  type="text"
                  placeholder="Ví dụ: 123 Đường Nguyễn Trãi"
                  className="pl-9 h-10 rounded-xl border-border"
                  {...register("addressName")}
                />
              </div>
              {errors.addressName && (
                <p className="text-xs text-destructive">{errors.addressName.message}</p>
              )}
            </div>

            {/* Cụm chọn Tỉnh / Xã */}
            <RegisterAddressFields
              control={control}
              errors={errors}
              provinces={provinces}
              wards={wards}
              isLoadingLocation={isLoadingLocation}
              onProvinceChange={handleProvinceChange}
              onWardChange={handleWardChange}
            />

            {/* Nút Đăng ký */}
            <Button
              type="submit"
              className="w-full h-10 rounded-xl font-medium shadow-xs gap-2 mt-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <span>Hoàn tất đăng ký</span>
                </>
              )}
            </Button>
          </form>

          {/* Social Logins */}
          <OAuthSocialButtons label="Hoặc đăng ký nhanh với" />

          {/* Login Link */}
          <p className="text-center text-xs text-muted-foreground pb-2">
            Đã có tài khoản?{" "}
            <Link
              href={ROUTES.AUTH.LOGIN}
              className="font-medium text-primary hover:underline transition-colors"
            >
              Đăng nhập ngay
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;
