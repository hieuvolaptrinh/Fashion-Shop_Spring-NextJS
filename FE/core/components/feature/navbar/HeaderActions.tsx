"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  User as UserIcon,
  PackageCheck,
  LayoutDashboard,
  LogOut,
  LogIn,
} from "lucide-react";
import { Button } from "@/core/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/core/components/ui/popover";
import { Separator } from "@/core/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/core/components/ui/tooltip";
import { useAuthStore } from "@/core/store/authStore";
import { useCartStore } from "@/core/store/cartStore";
import { ROUTES } from "@/core/constants";

export const HeaderActions: React.FC = () => {
  const router = useRouter();
  const { quantity, fetchCartQuantity } = useCartStore();
  const { isAuthenticated, isAdmin, user, logout } = useAuthStore();

  useEffect(() => {
    fetchCartQuantity();
  }, [fetchCartQuantity, isAuthenticated]);

  const handleGoToCart = () => {
    router.push(ROUTES.USER.CART);
  };

  const handleLogout = () => {
    logout();
    router.push(ROUTES.USER.HOME);
  };

  return (
    <div className="hidden items-center space-x-3 md:flex">
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={handleGoToCart}
              className="relative flex h-9 w-9 items-center justify-center rounded-xl text-foreground hover:bg-muted hover:text-primary transition-colors cursor-pointer"
              aria-label="Giỏ hàng"
            >
              <ShoppingBag className="h-5 w-5" />
              {quantity > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white pointer-events-none shadow-xs">
                  {quantity > 99 ? "99+" : quantity}
                </span>
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent>Giỏ hàng</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {!isAuthenticated ? (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="h-9 px-3 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground gap-1.5"
          >
            <Link href={ROUTES.USER.ORDERS}>
              <PackageCheck className="h-4 w-4" />
              <span>Tra cứu đơn</span>
            </Link>
          </Button>

          <Button
            size="sm"
            asChild
            className="h-9 px-3.5 rounded-xl text-xs font-medium gap-1.5 shadow-xs"
          >
            <Link href={ROUTES.AUTH.LOGIN}>
              <LogIn className="h-4 w-4" />
              <span>Đăng nhập</span>
            </Link>
          </Button>
        </div>
      ) : (
        <div className="flex items-center space-x-2">
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="h-9 px-2.5 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground gap-1.5"
                >
                  <Link href={ROUTES.USER.ORDERS}>
                    <PackageCheck className="h-4 w-4" />
                    <span className="hidden lg:inline">Đơn hàng</span>
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Danh sách đơn hàng của bạn</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="flex h-9 items-center space-x-2 rounded-xl border border-border/80 bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/60 transition-colors focus-visible:outline-none"
              >
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <UserIcon className="h-3 w-3" />
                </div>
                <span className="max-w-[120px] truncate">{user || "Tài khoản"}</span>
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-56 p-2 rounded-2xl shadow-md border-border/80">
              <div className="px-2 py-1.5">
                <p className="text-xs text-muted-foreground">Tài khoản</p>
                <p className="text-sm font-semibold text-foreground truncate">{user || "Khách hàng"}</p>
              </div>

              <Separator className="my-1.5" />

              <div className="space-y-0.5">
                <Link href={ROUTES.USER.ORDERS} className="w-full">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-full justify-start gap-2 rounded-lg text-xs font-normal"
                  >
                    <PackageCheck className="h-4 w-4 text-muted-foreground" />
                    <span>Đơn hàng của tôi</span>
                  </Button>
                </Link>

                {isAdmin && (
                  <Link href={ROUTES.ADMIN.DASHBOARD} className="w-full">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-full justify-start gap-2 rounded-lg text-xs font-normal text-primary hover:text-primary hover:bg-primary/10"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      <span>Trang Quản trị (Admin)</span>
                    </Button>
                  </Link>
                )}
              </div>

              <Separator className="my-1.5" />

              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-full justify-start gap-2 rounded-lg text-xs font-normal text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                <span>Đăng xuất</span>
              </Button>
            </PopoverContent>
          </Popover>
        </div>
      )}
    </div>
  );
};
