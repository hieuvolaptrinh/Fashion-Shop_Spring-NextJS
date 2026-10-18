"use client";

import React from "react";
import Link from "next/link";
import { Calendar, ExternalLink } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { Skeleton } from "@/core/components/ui/skeleton";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import { ROUTES } from "@/core/constants";
import { formatCurrency } from "@/core/lib/utils";
import type { OrderStatusStat, RevenueStat } from "@/core/apis/dashboard";

export interface DashboardChartsProps {
  mounted?: boolean;
  revenueData: RevenueStat[];
  orderStatusData: OrderStatusStat[];
}

export function DashboardCharts({
  mounted,
  revenueData,
  orderStatusData,
}: DashboardChartsProps) {
  const currentYear = new Date().getFullYear();
  const isZeroRevenue =
    revenueData.length === 0 || revenueData.every((item) => item.revenue === 0);

  return (
    <div className="grid gap-6 lg:grid-cols-7">
      <Card className="rounded-2xl lg:col-span-4 border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div>
            <CardTitle className="text-base font-semibold">
              Biến Động Doanh Thu
            </CardTitle>
            <CardDescription className="text-xs">
              {isZeroRevenue
                ? "Chưa phát sinh giao dịch trong 6 tháng qua (VNĐ)"
                : "Tổng giá trị giao dịch 6 tháng gần nhất (VNĐ)"}
            </CardDescription>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/60 px-2.5 py-1 rounded-lg">
            <Calendar className="h-3.5 w-3.5" />
            <span>Năm {currentYear}</span>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          {mounted ? (
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={revenueData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e2e8f0"
                  />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12, fill: "#64748b" }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    tickFormatter={(val) => `${val / 1000000}M`}
                  />
                  <RechartsTooltip
                    cursor={{
                      stroke: "#42A6ED",
                      strokeWidth: 1,
                      strokeDasharray: "4 4",
                    }}
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length > 0 && payload[0]) {
                        return (
                          <div className="rounded-xl border border-border/80 bg-background/95 px-3 py-2 text-xs shadow-lg backdrop-blur-sm animate-in fade-in-50 zoom-in-95">
                            <p className="font-semibold text-foreground mb-1">
                              {label}
                            </p>
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                              <span className="h-2.5 w-2.5 rounded-full shrink-0 bg-[#42A6ED]" />
                              <span>
                                Doanh thu:{" "}
                                <strong className="text-foreground font-semibold">
                                  {formatCurrency(Number(payload[0]?.value || 0))}
                                </strong>
                              </span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#42A6ED"
                    strokeWidth={2}
                    fill="#42A6ED"
                    fillOpacity={0.12}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <Skeleton className="h-[280px] w-full rounded-xl" />
          )}
        </CardContent>
      </Card>

      <Card className="rounded-2xl lg:col-span-3 border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div>
            <CardTitle className="text-base font-semibold">
              Tình Trạng Đơn Hàng
            </CardTitle>
            <CardDescription className="text-xs">
              Phân bổ theo giai đoạn xử lý
            </CardDescription>
          </div>
          <Link
            href={ROUTES.ADMIN.ORDERS}
            className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
          >
            <span>Chi tiết</span>
            <ExternalLink className="h-3 w-3" />
          </Link>
        </CardHeader>
        <CardContent className="pt-2">
          {mounted ? (
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={orderStatusData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e2e8f0"
                  />
                  <XAxis
                    dataKey="status"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: "#64748b" }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: "#64748b" }}
                  />
                  <RechartsTooltip
                    cursor={false}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length > 0 && payload[0]?.payload) {
                        const data = payload[0].payload;
                        return (
                          <div className="rounded-xl border border-border/80 bg-background/95 px-3 py-2 text-xs shadow-lg backdrop-blur-sm animate-in fade-in-50 zoom-in-95">
                            <p className="font-semibold text-foreground mb-1">
                              {data.status}
                            </p>
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                              <span
                                className="h-2.5 w-2.5 rounded-full shrink-0"
                                style={{ backgroundColor: data.fill }}
                              />
                              <span>
                                Số lượng:{" "}
                                <strong className="text-foreground font-semibold">
                                  {data.count} đơn hàng
                                </strong>
                              </span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar
                    dataKey="count"
                    radius={[6, 6, 0, 0]}
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <Skeleton className="h-[280px] w-full rounded-xl" />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default DashboardCharts;
