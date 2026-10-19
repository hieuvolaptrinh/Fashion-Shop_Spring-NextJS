import React from "react";
import Image from "next/image";
import Link from "next/link";
import { BRAND, IMAGES, ROUTES } from "@/core/constants";
import {
  HeaderDesktopNav,
  HeaderActions,
  HeaderMobileNav,
} from "./navbar";

/**
 * Header Component (Server Component):
 * - Đóng vai trò Pure Layout Container điều phối các sub-components
 * - Không chứa useEffect hoặc local state (toàn bộ lifecycle đã được Store tự động hóa)
 * - Tối ưu SEO và hiệu năng tải trang theo Quy tắc 4 & Quy tắc 10 fe-rules.md
 */
export default function Header() {
  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/85 sticky top-0 z-50 w-full border-b border-border/60 backdrop-blur-md shadow-xs">

      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link
            href={ROUTES.USER.HOME}
            className="flex items-center space-x-2.5 group shrink-0"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl overflow-hidden shadow-xs border border-border/40 group-hover:scale-105 transition-transform duration-200">
              <Image
                src={IMAGES.LOGO}
                alt={`Logo ${BRAND.name}`}
                width={36}
                height={36}
                className="h-full w-full object-cover"
                priority
              />
            </div>
            <div className="hidden sm:block">
              <span className="text-base font-bold text-foreground leading-tight tracking-tight block">
                {BRAND.name}
              </span>
              <span className="text-[11px] text-muted-foreground block -mt-0.5">
                {BRAND.tagline}
              </span>
            </div>
          </Link>

          <HeaderDesktopNav />

          <HeaderActions />

          <HeaderMobileNav />
        </div>
      </div>
    </header>
  );
}
