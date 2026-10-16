"use client";

import React from "react";
import { DollarSign, ShoppingBag, Package, Users, ArrowUpRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { Skeleton } from "@/core/components/ui/skeleton";
import { formatCurrency } from "@/core/lib/utils";

export interface DashboardStatsCardsProps {
  loading?: boolean;
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
}

export function DashboardStatsCards({
  loading,
  totalRevenue,
  totalOrders,
  totalProducts,
}: DashboardStatsCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Doanh thu tháng */}
      <Card className="rounded-2xl border bg-card shadow-sm hover:shadow-md transition-all duration-200">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Doanh thu tháng
          </CardTitle>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <DollarSign className="h-5 w-5" />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-8 w-28" />
          ) : (
            <div className="text-2xl font-bold text-foreground">
              {formatCurrency(totalRevenue)}
            </div>
          )}
          <div className="mt-2 flex items-center text-xs text-muted-foreground gap-1.5">
            <span className="inline-flex items-center text-emerald-600 dark:text-emerald-400 font-semibold gap-0.5">
              <ArrowUpRight className="h-3.5 w-3.5" />
              +18.2%
            </span>
            <span>so với tháng trước</span>
          </div>
        </CardContent>
      </Card>

      {/* Tổng đơn hàng */}
      <Card className="rounded-2xl border bg-card shadow-sm hover:shadow-md transition-all duration-200">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Tổng số đơn hàng
          </CardTitle>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <ShoppingBag className="h-5 w-5" />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-8 w-20" />
          ) : (
            <div className="text-2xl font-bold text-foreground">
              {totalOrders.toLocaleString("vi-VN")}
            </div>
          )}
          <div className="mt-2 flex items-center text-xs text-muted-foreground gap-1.5">
            <span className="inline-flex items-center text-emerald-600 dark:text-emerald-400 font-semibold gap-0.5">
              <ArrowUpRight className="h-3.5 w-3.5" />
              +12.4%
            </span>
            <span>đơn hoàn tất hôm nay</span>
          </div>
        </CardContent>
      </Card>

      {/* Sản phẩm trong kho */}
      <Card className="rounded-2xl border bg-card shadow-sm hover:shadow-md transition-all duration-200">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Sản phẩm đang bán
          </CardTitle>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
            <Package className="h-5 w-5" />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-8 w-20" />
          ) : (
            <div className="text-2xl font-bold text-foreground">
              {totalProducts.toLocaleString("vi-VN")}
            </div>
          )}
          <div className="mt-2 flex items-center text-xs text-muted-foreground gap-1.5">
            <span className="inline-flex items-center text-sky-600 dark:text-sky-400 font-medium">
              Tất cả mặt hàng
            </span>
            <span>đang hiển thị</span>
          </div>
        </CardContent>
      </Card>

      {/* Khách hàng */}
      <Card className="rounded-2xl border bg-card shadow-sm hover:shadow-md transition-all duration-200">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Khách hàng hoạt động
          </CardTitle>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
            <Users className="h-5 w-5" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">1,248</div>
          <div className="mt-2 flex items-center text-xs text-muted-foreground gap-1.5">
            <span className="inline-flex items-center text-emerald-600 dark:text-emerald-400 font-semibold gap-0.5">
              <ArrowUpRight className="h-3.5 w-3.5" />
              +6.5%
            </span>
            <span>khách mới trong tuần</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default DashboardStatsCards;
