"use client";

import React from "react";
import { Filter, X, DollarSign } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { Button } from "@/core/components/ui/button";
import { Input } from "@/core/components/ui/input";
import type { OrderFilterRequest } from "@/core/apis/order";

export interface OrderFilterCardProps {
  filters: OrderFilterRequest;
  statusOptions: Array<{ value: string; label: string }>;
  onClose: () => void;
  onStatusToggle: (statusValue: string) => void;
  onBillFilterToggle: (targetValue: boolean) => void;
  onPriceFilterChange: (
    field: "minTotalPrice" | "maxTotalPrice",
    value: number | undefined
  ) => void;
  onApply: () => void;
  onReset: () => void;
}

export function OrderFilterCard({
  filters,
  statusOptions,
  onClose,
  onStatusToggle,
  onBillFilterToggle,
  onPriceFilterChange,
  onApply,
  onReset,
}: OrderFilterCardProps) {
  return (
    <Card className="rounded-2xl border shadow-sm animate-in fade-in-50 duration-200">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
            <Filter className="h-4 w-4 text-primary" />
            <span>Bộ Lọc Chi Tiết</span>
          </CardTitle>
          <CardDescription className="text-xs">
            Lọc theo trạng thái xử lý, trạng thái in bill và giá trị đơn hàng
          </CardDescription>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-7 w-7 rounded-lg text-muted-foreground"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Đóng bộ lọc</span>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Trạng thái đơn hàng */}
        <div className="space-y-1.5">
          <span className="text-xs font-medium text-foreground">
            Trạng thái đơn hàng:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {statusOptions.map((opt) => {
              const isSelected = (filters.status || []).includes(opt.value);
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onStatusToggle(opt.value)}
                  className={`px-3 py-1 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-primary text-primary-foreground border-primary shadow-xs"
                      : "bg-background text-muted-foreground border-border hover:bg-muted/50"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Trạng thái in bill & Khoảng giá */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Lọc trạng thái in bill */}
          <div className="space-y-1.5">
            <span className="text-xs font-medium text-foreground">
              Trạng thái in hóa đơn:
            </span>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => onBillFilterToggle(false)}
                className={`flex-1 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                  filters.isBill === false
                    ? "bg-warning text-warning-foreground border-warning shadow-xs"
                    : "bg-background text-muted-foreground border-border hover:bg-muted/50"
                }`}
              >
                Chưa in
              </button>
              <button
                type="button"
                onClick={() => onBillFilterToggle(true)}
                className={`flex-1 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                  filters.isBill === true
                    ? "bg-success text-success-foreground border-success shadow-xs"
                    : "bg-background text-muted-foreground border-border hover:bg-muted/50"
                }`}
              >
                Đã in
              </button>
            </div>
          </div>

          {/* Giá từ */}
          <div className="space-y-1.5">
            <span className="text-xs font-medium text-foreground">
              Tổng tiền từ (VNĐ):
            </span>
            <div className="relative">
              <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                type="number"
                min={0}
                step={10000}
                value={filters.minTotalPrice || ""}
                onChange={(e) =>
                  onPriceFilterChange(
                    "minTotalPrice",
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                placeholder="0"
                className="pl-8 h-9 text-xs rounded-xl"
              />
            </div>
          </div>

          {/* Đến giá */}
          <div className="space-y-1.5">
            <span className="text-xs font-medium text-foreground">
              Đến tổng tiền (VNĐ):
            </span>
            <div className="relative">
              <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                type="number"
                min={0}
                step={10000}
                value={filters.maxTotalPrice || ""}
                onChange={(e) =>
                  onPriceFilterChange(
                    "maxTotalPrice",
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                placeholder="Ví dụ: 5.000.000"
                className="pl-8 h-9 text-xs rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-2 pt-1 border-t">
          <Button
            size="sm"
            onClick={onApply}
            className="h-8 rounded-xl text-xs px-3 font-medium"
          >
            Áp dụng lọc
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            className="h-8 rounded-xl text-xs px-3"
          >
            Đặt lại
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default OrderFilterCard;
