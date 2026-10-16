"use client";

import React from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { Button } from "@/core/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/core/components/ui/table";
import { Skeleton } from "@/core/components/ui/skeleton";
import { ROUTES } from "@/core/constants";
import { formatCurrency, formatDate } from "@/core/lib/utils";
import { OrderStatusBadge } from "@/core/components/feature/admin/common/OrderStatusBadge";
import type { DashboardOrderItem } from "@/core/apis/dashboard";

export interface DashboardRecentOrdersProps {
  loading?: boolean;
  orders: DashboardOrderItem[];
}

export function DashboardRecentOrders({
  loading,
  orders,
}: DashboardRecentOrdersProps) {
  return (
    <Card className="rounded-2xl border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base font-semibold">
            Đơn Hàng Gần Đây
          </CardTitle>
          <CardDescription className="text-xs">
            Các đơn hàng mới nhất cần được tiếp nhận và xử lý
          </CardDescription>
        </div>
        <Button asChild variant="outline" size="sm" className="rounded-xl">
          <Link href={ROUTES.ADMIN.ORDERS} className="text-xs flex items-center gap-1.5">
            <span>Xem tất cả</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : orders.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            Chưa có đơn hàng nào trong hệ thống.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Mã đơn</TableHead>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Ngày đặt</TableHead>
                  <TableHead>Tổng tiền</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => {
                  const price = order.totalPrice || order.totalAmount || 0;
                  const date = order.createdDate || order.createdAt;
                  const name =
                    order.receiverName || order.customerName || "Khách hàng";

                  return (
                    <TableRow key={order.orderId} className="hover:bg-muted/40">
                      <TableCell className="font-semibold text-primary">
                        #{order.orderId}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground text-sm">
                            {name}
                          </span>
                          {order.receiverPhone && (
                            <span className="text-xs text-muted-foreground">
                              {order.receiverPhone}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {formatDate(date)}
                      </TableCell>
                      <TableCell className="font-semibold text-foreground text-sm">
                        {formatCurrency(Number(price))}
                      </TableCell>
                      <TableCell>
                        <OrderStatusBadge status={order.orderStatus || order.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          asChild
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2.5 rounded-lg text-xs"
                        >
                          <Link href={ROUTES.ADMIN.ORDERS}>Chi tiết</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default DashboardRecentOrders;
