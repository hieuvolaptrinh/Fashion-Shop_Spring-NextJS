"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/core/constants";
import { cn } from "@/core/lib/utils";

export interface NavItem {
  href: string;
  label: string;
}

export const NAVIGATION_ITEMS: NavItem[] = [
  { href: ROUTES.USER.HOME, label: "Trang chủ" },
  { href: ROUTES.USER.ABOUT, label: "Giới thiệu" },
  { href: ROUTES.USER.PRODUCTS, label: "Sản phẩm" },
  { href: ROUTES.USER.CONTACT, label: "Liên hệ" },
];

export const HeaderDesktopNav: React.FC = () => {
  const pathname = usePathname();

  return (
    <nav
      className="hidden items-center space-x-8 md:flex"
      aria-label="Main navigation"
    >
      {NAVIGATION_ITEMS.map((item) => {
        const isActive =
          item.href === ROUTES.USER.HOME
            ? pathname === ROUTES.USER.HOME
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "relative text-sm transition-colors py-1.5 focus-visible:outline-none",
              isActive
                ? "text-primary font-semibold"
                : "text-muted-foreground hover:text-foreground font-medium"
            )}
          >
            {item.label}
            {isActive && (
              <span className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-primary rounded-full" />
            )}
          </Link>
        );
      })}
    </nav>
  );
};
