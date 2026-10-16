"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  Bell,
  LogOut,
  Search,
  ExternalLink,
  LayoutDashboard,
  ChevronRight,
  PanelLeft,
} from "lucide-react";
import { useAdminLayout } from "@/core/context/AdminLayoutContext";
import { Input } from "@/core/components/ui/input";
import { Button } from "@/core/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/core/components/ui/tooltip";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/core/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/core/components/ui/dropdown-menu";
import { ROUTES } from "@/core/constants";
import { clearAuth, getStoredUser } from "@/core/lib/authUtils";

export default function AdminHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { isCollapsed, toggleSidebar, setIsMobileOpen } = useAdminLayout();
  const [userName, setUserName] = useState<string>("Admin");

  useEffect(() => {
    try {
      const userStr = getStoredUser();
      if (userStr) {
        const u = JSON.parse(userStr);
        if (u.fullName) setUserName(u.fullName);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleLogout = () => {
    clearAuth();
    router.push(ROUTES.AUTH.LOGIN);
  };

  // Tạo breadcrumb động dựa trên pathname
  const getBreadcrumbTitle = () => {
    if (pathname === ROUTES.ADMIN.DASHBOARD) return "Tổng quan";
    if (pathname.startsWith(ROUTES.ADMIN.PRODUCTS)) return "Quản lý Sản phẩm";
    if (pathname.startsWith(ROUTES.ADMIN.ORDERS)) return "Quản lý Đơn hàng";
    return "Quản trị";
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background/80 px-4 backdrop-blur-md md:px-6">
      {/* Left: Sidebar Toggle & Breadcrumb */}
      <div className="flex items-center gap-3">
        <TooltipProvider delayDuration={150}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground"
                onClick={() => {
                  if (typeof window !== "undefined" && window.innerWidth < 768) {
                    setIsMobileOpen(true);
                  } else {
                    toggleSidebar();
                  }
                }}
              >
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Đóng/Mở thanh bên</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              {isCollapsed ? "Mở rộng thanh bên" : "Thu gọn thanh bên"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs md:text-sm text-muted-foreground">
          <Link
            href={ROUTES.ADMIN.DASHBOARD}
            className="hover:text-foreground font-medium transition-colors"
          >
            Admin
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="font-semibold text-foreground">
            {getBreadcrumbTitle()}
          </span>
        </nav>
      </div>

      {/* Center: Search Bar */}
      <div className="hidden md:flex flex-1 max-w-md mx-6">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Tìm kiếm sản phẩm, đơn hàng, khách hàng..."
            className="pl-9 h-9 bg-slate-50 dark:bg-slate-900/60 rounded-xl border-muted-foreground/20 focus-visible:ring-primary/20 text-xs md:text-sm"
          />
        </div>
      </div>

      {/* Right: Actions & User Avatar */}
      <div className="flex items-center gap-2">
        {/* Notification button */}
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
          </span>
          <span className="sr-only">Notifications</span>
        </Button>

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative flex items-center gap-2 h-10 px-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Avatar className="h-8 w-8 border border-border/60">
                <AvatarImage src="" alt={userName} />
                <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                  {userName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-xs font-semibold leading-none text-foreground truncate max-w-[120px]">
                  {userName}
                </span>
              </div>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-semibold leading-none">{userName}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  Quản trị viên hệ thống
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href={ROUTES.ADMIN.DASHBOARD} className="cursor-pointer">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  <span>Admin Dashboard</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={ROUTES.USER.HOME} target="_blank" className="cursor-pointer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  <span>Xem trang bán hàng</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="cursor-pointer text-rose-600 focus:text-rose-600 focus:bg-rose-50 dark:focus:bg-rose-950/30"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Đăng xuất</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
