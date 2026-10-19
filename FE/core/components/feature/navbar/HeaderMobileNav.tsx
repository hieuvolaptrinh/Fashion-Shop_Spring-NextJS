"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Menu,
  ShoppingBag,
  Phone,
  Mail,
  LogIn,
  PackageCheck,
  LayoutDashboard,
  LogOut,
  User as UserIcon,
} from "lucide-react";
import { Button } from "@/core/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/core/components/ui/sheet";
import { Separator } from "@/core/components/ui/separator";
import { useAuthStore } from "@/core/store/authStore";
import { useCartStore } from "@/core/store/cartStore";
import { BRAND, IMAGES, ROUTES } from "@/core/constants";
import { NAVIGATION_ITEMS } from "./HeaderDesktopNav";

export const HeaderMobileNav: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { quantity } = useCartStore();
  const { isAuthenticated, isAdmin, user, logout } = useAuthStore();

  const handleGoToCart = () => {
    router.push(ROUTES.USER.CART);
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    router.push(ROUTES.USER.HOME);
  };

  return (
    <div className="flex items-center space-x-2 md:hidden">
      <button
        type="button"
        onClick={handleGoToCart}
        className="relative flex h-9 w-9 items-center justify-center rounded-xl text-foreground hover:bg-muted transition-colors cursor-pointer"
        aria-label="Giỏ hàng"
      >
        <ShoppingBag className="h-5 w-5" />
        {quantity > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white pointer-events-none shadow-xs">
            {quantity > 99 ? "99+" : quantity}
          </span>
        )}
      </button>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-xl text-foreground"
            aria-label="Mở menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>

        <SheetContent side="right" className="w-[300px] sm:w-[360px] p-0 flex flex-col justify-between">
          <SheetTitle className="sr-only">Menu Điều Hướng</SheetTitle>

          <div className="p-6 space-y-6 overflow-y-auto">
            <Link
              href={ROUTES.USER.HOME}
              className="flex items-center space-x-2.5"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl overflow-hidden shadow-xs">
                <Image
                  src={IMAGES.LOGO}
                  alt="Logo"
                  width={36}
                  height={36}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="text-base font-bold text-foreground leading-tight">
                  {BRAND.name}
                </p>
                <p className="text-[11px] text-muted-foreground">{BRAND.tagline}</p>
              </div>
            </Link>

            <Separator />

            <nav className="flex flex-col space-y-1">
              {NAVIGATION_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center px-3 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-muted transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <Separator />

            <div className="space-y-2">
              {!isAuthenticated ? (
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="h-10 rounded-xl text-xs font-medium gap-1.5"
                    onClick={() => setIsOpen(false)}
                  >
                    <Link href={ROUTES.USER.ORDERS}>
                      <PackageCheck className="h-4 w-4" />
                      <span>Tra cứu đơn</span>
                    </Link>
                  </Button>

                  <Button
                    size="sm"
                    asChild
                    className="h-10 rounded-xl text-xs font-medium gap-1.5 shadow-xs"
                    onClick={() => setIsOpen(false)}
                  >
                    <Link href={ROUTES.AUTH.LOGIN}>
                      <LogIn className="h-4 w-4" />
                      <span>Đăng nhập</span>
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2.5 px-3 py-2 rounded-xl bg-muted/60">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <UserIcon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">
                        {user || "Khách hàng"}
                      </p>
                      <p className="text-[10px] text-muted-foreground">Đã đăng nhập</p>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="w-full h-9 rounded-xl justify-start text-xs font-normal gap-2"
                    onClick={() => setIsOpen(false)}
                  >
                    <Link href={ROUTES.USER.ORDERS}>
                      <PackageCheck className="h-4 w-4 text-muted-foreground" />
                      <span>Đơn hàng của tôi</span>
                    </Link>
                  </Button>

                  {isAdmin && (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="w-full h-9 rounded-xl justify-start text-xs font-normal gap-2 text-primary hover:text-primary hover:bg-primary/10"
                      onClick={() => setIsOpen(false)}
                    >
                      <Link href={ROUTES.ADMIN.DASHBOARD}>
                        <LayoutDashboard className="h-4 w-4" />
                        <span>Trang Quản trị (Admin)</span>
                      </Link>
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full h-9 rounded-xl justify-start text-xs font-normal gap-2 text-destructive hover:bg-destructive/10"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Đăng xuất</span>
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="p-6 border-t border-border/60 bg-muted/30 space-y-2 text-xs text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Phone className="h-3.5 w-3.5 text-primary shrink-0" />
              <span>{BRAND.hotlines.join(" - ")}</span>
            </div>

            <div className="flex items-center space-x-2">
              <Mail className="h-3.5 w-3.5 text-primary shrink-0" />
              <span className="truncate">{BRAND.email}</span>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
