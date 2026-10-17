"use client";

import React from "react";
import Link from "next/link";
import { Package, ShoppingBag, ExternalLink, ArrowUpRight } from "lucide-react";
import { ROUTES } from "@/core/constants";

export function DashboardQuickActions() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Link
        href={ROUTES.ADMIN.PRODUCTS}
        className="group flex items-center justify-between rounded-2xl border bg-card p-4 shadow-sm hover:border-primary/50 hover:shadow-md transition-all duration-200"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-105 transition-transform">
            <Package className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              Quản lý Sản phẩm
            </p>
            <p className="text-xs text-muted-foreground">
              Thêm, sửa, cập nhật giá và tồn kho
            </p>
          </div>
        </div>
        <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
      </Link>

      <Link
        href={ROUTES.ADMIN.ORDERS}
        className="group flex items-center justify-between rounded-2xl border bg-card p-4 shadow-sm hover:border-primary/50 hover:shadow-md transition-all duration-200"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 group-hover:scale-105 transition-transform">
            <ShoppingBag className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              Quản lý Đơn hàng
            </p>
            <p className="text-xs text-muted-foreground">
              Kiểm tra đơn mới, duyệt và giao vận
            </p>
          </div>
        </div>
        <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-emerald-600 transition-colors" />
      </Link>

      <Link
        href={ROUTES.USER.HOME}
        target="_blank"
        className="group flex items-center justify-between rounded-2xl border bg-card p-4 shadow-sm hover:border-primary/50 hover:shadow-md transition-all duration-200"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 group-hover:scale-105 transition-transform">
            <ExternalLink className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              Xem Website Khách hàng
            </p>
            <p className="text-xs text-muted-foreground">
              Trải nghiệm trang mua sắm trực tuyến
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default DashboardQuickActions;
