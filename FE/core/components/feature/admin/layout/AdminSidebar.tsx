"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  Store,
  ChevronRight,
} from "lucide-react";
import { useAdminLayout } from "@/core/context/AdminLayoutContext";
import { cn } from "@/core/lib/utils";
import { Button } from "@/core/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/core/components/ui/tooltip";
import { ROUTES, IMAGES } from "@/core/constants";

const menuItems = [
  {
    title: "Dashboard",
    href: ROUTES.ADMIN.DASHBOARD,
    icon: LayoutDashboard,
    description: "Tổng quan & thống kê",
  },
  {
    title: "Sản phẩm",
    href: ROUTES.ADMIN.PRODUCTS,
    icon: Package,
    description: "Quản lý sản phẩm & kho",
  },
  {
    title: "Danh mục",
    href: ROUTES.ADMIN.CATEGORIES,
    icon: FolderTree,
    description: "Phân loại sản phẩm",
  },
  {
    title: "Đơn hàng",
    href: ROUTES.ADMIN.ORDERS,
    icon: ShoppingBag,
    description: "Xử lý & giao vận",
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { isCollapsed, toggleSidebar, isMobileOpen, setIsMobileOpen } =
    useAdminLayout();

  const renderNavLinks = () => (
    <TooltipProvider delayDuration={100}>
      <div className="space-y-1.5 px-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== ROUTES.ADMIN.DASHBOARD && pathname.startsWith(item.href));

          const linkContent = (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileOpen(false)}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm shadow-primary/25 font-semibold"
                  : "text-muted-foreground hover:bg-slate-100 hover:text-foreground dark:hover:bg-slate-800/60"
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-105",
                  isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                )}
              />
              {!isCollapsed && (
                <div className="flex flex-col truncate">
                  <span className="truncate">{item.title}</span>
                  <span
                    className={cn(
                      "text-[11px] font-normal truncate",
                      isActive ? "text-primary-foreground/80" : "text-muted-foreground/70"
                    )}
                  >
                    {item.description}
                  </span>
                </div>
              )}
            </Link>
          );

          if (isCollapsed) {
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                <TooltipContent side="right" className="font-medium">
                  {item.title}
                </TooltipContent>
              </Tooltip>
            );
          }

          return linkContent;
        })}
      </div>
    </TooltipProvider>
  );

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r bg-background/95 backdrop-blur transition-all duration-300 md:static",
          isCollapsed ? "w-[72px]" : "w-64",
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b px-4">
          <Link
            href={ROUTES.ADMIN.DASHBOARD}
            className={cn(
              "flex items-center gap-2.5 transition-all",
              isCollapsed && "justify-center w-full"
            )}
          >
            <Image
              src={IMAGES.LOGO}
              alt="Logo Lan Chuyên Hàng Sales"
              width={32}
              height={32}
              className="h-8 w-8 shrink-0 rounded-lg object-cover border border-border/60"
              priority
            />
            {!isCollapsed && (
              <div className="flex flex-col leading-none truncate">
                <span className="font-bold tracking-tight text-foreground text-sm truncate">
                  Lan Chuyên Hàng Sales
                </span>
              </div>
            )}
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <div className="px-4 mb-2">
            {!isCollapsed && (
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                Menu Quản Lý
              </p>
            )}
          </div>
          {renderNavLinks()}
        </div>

        <div className="border-t p-3 space-y-2">
          <TooltipProvider delayDuration={100}>
            {isCollapsed ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={ROUTES.USER.HOME}
                    target="_blank"
                    className="flex h-10 w-full items-center justify-center rounded-xl text-muted-foreground transition hover:bg-slate-100 hover:text-foreground dark:hover:bg-slate-800"
                  >
                    <Store className="h-5 w-5" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">Xem cửa hàng</TooltipContent>
              </Tooltip>
            ) : (
              <Link
                href={ROUTES.USER.HOME}
                target="_blank"
                className="flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium text-muted-foreground transition hover:bg-slate-100 hover:text-foreground dark:hover:bg-slate-800"
              >
                <Store className="h-4 w-4 shrink-0" />
                <span>Xem Website Bán Hàng</span>
              </Link>
            )}
          </TooltipProvider>

          {isCollapsed && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="hidden h-9 w-full text-muted-foreground hover:text-foreground md:flex"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </aside>
    </>
  );
}
