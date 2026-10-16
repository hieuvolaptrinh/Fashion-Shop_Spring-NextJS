"use client";

import React from "react";
import Link from "next/link";
import { PlusCircle, RotateCcw } from "lucide-react";
import { Button } from "@/core/components/ui/button";
import { ROUTES } from "@/core/constants";

export interface DashboardHeaderProps {
  loading?: boolean;
  onRefresh?: () => void;
}

export function DashboardHeader({ loading, onRefresh }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Bảng Điều Khiển Quản Trị
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Theo dõi hiệu suất kinh doanh, quản lý sản phẩm và xử lý đơn hàng thời gian thực.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={loading}
          className="rounded-xl gap-1.5"
          title="Làm mới dữ liệu"
        >
          <RotateCcw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          <span className="hidden sm:inline">Làm mới</span>
        </Button>
        <Button asChild size="sm" className="rounded-xl">
          <Link href={ROUTES.ADMIN.PRODUCTS} className="flex items-center gap-1.5">
            <PlusCircle className="h-4 w-4" />
            <span>Thêm sản phẩm</span>
          </Link>
        </Button>
        <Button asChild variant="outline" size="sm" className="rounded-xl">
          <Link href={ROUTES.ADMIN.ORDERS}>
            <span>Xem đơn hàng</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default DashboardHeader;
