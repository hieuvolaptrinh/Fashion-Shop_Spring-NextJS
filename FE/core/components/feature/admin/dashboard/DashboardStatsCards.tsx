"use client";

import React from "react";
import {
  DollarSign,
  ShoppingBag,
  Package,
  Users,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
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
  totalCustomers: number;
  revenueGrowth: number | null;
  ordersToday: number;
}

export function DashboardStatsCards({
  loading,
  totalRevenue,
  totalOrders,
  totalProducts,
  totalCustomers,
  revenueGrowth,
  ordersToday,
}: DashboardStatsCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="rounded-2xl border bg-card shadow-sm hover:shadow-md transition-all duration-200">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Doanh thu hệ thống
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
          {revenueGrowth !== null ? (
            <div className="mt-2 flex items-center text-xs text-muted-foreground gap-1.5">
              <span
                className={`inline-flex items-center font-semibold gap-0.5 ${
                  revenueGrowth >= 0
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-destructive"
                }`}
              >
                {revenueGrowth >= 0 ? (
                  <ArrowUpRight className="h-3.5 w-3.5" />
                ) : (
                  <ArrowDownRight className="h-3.5 w-3.5" />
                )}
                {revenueGrowth >= 0 ? `+${revenueGrowth}%` : `${revenueGrowth}%`}
              </span>
              <span>so với tháng trước</span>
            </div>
          ) : (
            <div className="mt-2 flex items-center text-xs text-muted-foreground gap-1.5">
              <span className="text-muted-foreground font-medium">
                Doanh thu tích lũy hợp lệ
              </span>
            </div>
          )}
        </CardContent>
      </Card>

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
              {ordersToday} đơn
            </span>
            <span>phát sinh hôm nay</span>
          </div>
        </CardContent>
      </Card>

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
            <span>đang kinh doanh</span>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border bg-card shadow-sm hover:shadow-md transition-all duration-200">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Khách hàng hệ thống
          </CardTitle>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
            <Users className="h-5 w-5" />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-8 w-20" />
          ) : (
            <div className="text-2xl font-bold text-foreground">
              {totalCustomers.toLocaleString("vi-VN")}
            </div>
          )}
          <div className="mt-2 flex items-center text-xs text-muted-foreground gap-1.5">
            <span className="inline-flex items-center text-purple-600 dark:text-purple-400 font-medium">
              Tài khoản người dùng
            </span>
            <span>đã đăng ký</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default DashboardStatsCards;
