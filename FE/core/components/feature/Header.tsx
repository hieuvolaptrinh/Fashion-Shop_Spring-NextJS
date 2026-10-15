"use client";

import { useCartStore } from "@/core/store/cartStore";
import { Tooltip } from "@mui/material";
import { Button } from "core/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "core/components/ui/sheet";
import { LogOut, Mail, Menu, Phone, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Separator } from "../ui/separator";

export default function Header() {
  const { quantity, fetchCartQuantity } = useCartStore();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const navigationItems = [
    { href: "/", label: "Trang chủ" },
    { href: "/about-us", label: "Giới thiệu" },
    { href: "/products", label: "Sản phẩm" },
    { href: "/contact", label: "Liên hệ" },
  ];

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      try {
        const payload = accessToken.split(".")[1];
        if (!payload) throw new Error("Invalid token format");
        const decodedToken = JSON.parse(atob(payload));

        if (decodedToken.exp * 1000 < Date.now()) {
          localStorage.removeItem("accessToken");
        } else {
          setIsAuth(true);
        }

        if (
          Array.isArray(decodedToken.roles) &&
          decodedToken.roles.includes("ADMIN")
        ) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        localStorage.removeItem("accessToken");
      }
    }

    fetchCartQuantity();
  }, []);

  const HandleOrdered = () => {
    router.push("/orders");
  };

  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="bg-muted/50 hidden border-b md:block">
        <div className="container mx-auto px-4">
          <div className="flex h-10 items-center justify-between text-sm">
            <div className="text-muted-foreground flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Phone className="h-3 w-3" />
                <span>093.1133.128 - 08.193.148.93</span>
              </div>

              <div className="flex items-center space-x-1">
                <Mail className="h-3 w-3" />
                <span> lanchuyenhangsale@gmail.com</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>MB: 0937429455 - NGUYEN THI MONG LAN</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-lg">
                <img src="/logo.jpg" alt="Logo" className="h-8 w-8" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-foreground text-xl font-bold">
                  LanChuyenHangSale
                </h1>
                <p className="text-muted-foreground text-xs">
                  Uy tín - Chất lượng
                </p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav
            className="hidden items-center space-x-6 md:flex"
            aria-label="Main navigation"
          >
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-muted-foreground hover:text-foreground focus:text-foreground focus:ring-ring rounded-sm px-2 py-1 text-xl font-medium transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden items-center space-x-4 md:flex">
            {!isAuth && (
              <Link href={"/login"}>
                <Button variant="outline" size="sm">
                  Đăng nhập
                </Button>
              </Link>
            )}
            {isAuth && (
              <>
                <div className="relative">
                  <Tooltip title="Giỏ hàng" arrow>
                    <ShoppingBag
                      onClick={() => router.replace("/shopping-cart")}
                      className="cursor-pointer"
                    />
                  </Tooltip>
                  {quantity > 0 && (
                    <span className="absolute -top-2 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                      {quantity}
                    </span>
                  )}
                </div>
                <Popover>
                  <PopoverTrigger>
                    <div className="text-muted-foreground hover:bg-muted hover:text-foreground focus:ring-ring cursor-pointer rounded-md border border-1 p-2 text-sm font-medium focus:ring-2 focus:ring-offset-2 focus:outline-none">
                      {localStorage.getItem("user")}
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-fit">
                    <div className="min-w-0 text-center">
                      <p className="text-foreground truncate text-sm font-medium">
                        {localStorage.getItem("user")}
                      </p>
                    </div>
                    <Separator className="my-2" />
                    {isAdmin && (
                      <Link href={"/admin"}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mb-3 h-8 w-full justify-start gap-2 hover:bg-green-50 hover:text-green-600"
                        >
                          Quản trị
                        </Button>
                      </Link>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-full justify-start gap-2 text-red-600 hover:bg-red-50 hover:text-red-600"
                      onClick={() => {
                        localStorage.removeItem("accessToken");
                        localStorage.removeItem("user");
                        router.push("/");
                        setIsAuth(false);
                      }}
                    >
                      <LogOut className="h-4 w-4" />
                      Đăng xuất
                    </Button>
                  </PopoverContent>
                </Popover>
              </>
            )}
            <Button size="sm" onClick={HandleOrdered}>
              Đơn đã đặt
            </Button>
          </div>

          {/* Mobile menu */}

          <div className="flex items-center space-x-4 md:hidden">
            <div className="relative">
              <Tooltip title="Giỏ hàng" arrow>
                <ShoppingBag
                  onClick={() => router.replace("/shopping-cart")}
                  className="cursor-pointer"
                />
              </Tooltip>
              {quantity > 0 && (
                <span className="absolute -top-2 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                  {quantity}
                </span>
              )}
            </div>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" aria-label="Mở menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetTitle className="hidden" />
                <div className="mt-4 flex flex-col space-y-4">
                  <div className="flex items-center justify-between">
                    <Link
                      href="/"
                      className="flex items-center space-x-2"
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="bg-primary flex h-6 w-6 items-center justify-center rounded">
                        <span className="text-primary-foreground text-sm font-bold">
                          L
                        </span>
                      </div>
                      <span className="font-bold">LanChuyenHangSale</span>
                    </Link>
                  </div>
                  <nav
                    className="flex flex-col space-y-3"
                    aria-label="Mobile navigation"
                  >
                    {navigationItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-md px-3 py-2 text-sm font-medium transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </nav>
                  <div className="flex flex-col space-y-2 border-t pt-4">
                    {!isAuth && (
                      <Link href={"/login"}>
                        <Button variant="outline" size="sm">
                          Đăng nhập
                        </Button>
                      </Link>
                    )}
                    {isAdmin && (
                      <Link href={"/admin"}>
                        <Button variant="outline" className="w-full" size="sm">
                          Quản trị
                        </Button>
                      </Link>
                    )}
                    {isAuth && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          localStorage.removeItem("accessToken");
                          setIsAuth(false);
                        }}
                      >
                        Đăng xuất
                      </Button>
                    )}
                    <Button
                      className="w-full"
                      onClick={() => {
                        HandleOrdered();
                        setIsOpen(false);
                      }}
                    >
                      Đơn đã đặt
                    </Button>
                  </div>
                  <div className="text-muted-foreground flex flex-col space-y-2 border-t pt-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4" />
                      <span>093.1133.128 - 08.193.148.93</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4" />
                      <span>lanchuyenhangsale@gmail.com</span>
                    </div>
                    <div className="text-muted-foreground flex items-center space-x-1">
                      <span>MB: 0937429455 - NGUYEN THI MONG LAN</span>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
