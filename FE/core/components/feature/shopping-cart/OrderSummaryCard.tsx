"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Truck } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { Button } from "@/core/components/ui/button";
import { Separator } from "@/core/components/ui/separator";
import { formatCurrency } from "@/core/lib/utils";
import { ROUTES, SHIPPING_CONFIG } from "@/core/constants";

interface OrderSummaryCardProps {
  subtotal: number;
  discount: number;
  discountAmount: number;
  shipping: number;
  total: number;
  selectedCount: number;
}

export const OrderSummaryCard: React.FC<OrderSummaryCardProps> = ({
  subtotal,
  discount,
  discountAmount,
  shipping,
  total,
  selectedCount,
}) => {
  return (
    <Card className="border border-border/60 bg-card shadow-xs">
      <CardHeader className="border-b border-border/60 px-5 py-4">
        <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
          <span>Tóm tắt đơn hàng</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3.5 p-4 sm:p-5 text-sm">
        <div className="flex items-center justify-between text-muted-foreground">
          <span>Đã chọn ({selectedCount} sản phẩm):</span>
          <span className="font-medium text-foreground">
            {formatCurrency(subtotal)}
          </span>
        </div>

        {discount > 0 && (
          <div className="flex items-center justify-between text-success">
            <span>Giảm giá ({Math.round(discount * 100)}%):</span>
            <span className="font-medium">
              -{formatCurrency(discountAmount)}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Truck className="h-3.5 w-3.5" />
            <span>Phí vận chuyển:</span>
          </span>
          <span className={shipping === 0 ? "font-medium text-success" : "font-medium text-foreground"}>
            {shipping === 0 ? "Miễn phí" : formatCurrency(shipping)}
          </span>
        </div>

        {subtotal < SHIPPING_CONFIG.FREE_SHIPPING_THRESHOLD && subtotal > 0 && (
          <p className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-2.5">
            💡 Mua thêm <strong className="text-foreground">{formatCurrency(SHIPPING_CONFIG.FREE_SHIPPING_THRESHOLD - subtotal)}</strong> để được <strong className="text-success">Miễn phí giao hàng</strong>.
          </p>
        )}

        <Separator className="my-2" />

        <div className="flex items-center justify-between py-1">
          <div>
            <p className="text-sm font-semibold text-foreground">Tổng thanh toán</p>
            <p className="text-xs text-muted-foreground">(Đã bao gồm VAT)</p>
          </div>
          <p className="text-xl font-bold text-primary">
            {formatCurrency(total)}
          </p>
        </div>

        <div className="flex items-center gap-2 pt-2 text-xs text-muted-foreground border-t border-border/40">
          <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
          <span>Cam kết bảo mật thông tin & thanh toán an toàn</span>
        </div>
      </CardContent>

      <CardFooter className="border-t border-border/60 p-4 sm:p-5">
        <Button
          asChild
          variant="outline"
          className="w-full h-10 rounded-xl text-xs font-normal border-border hover:bg-muted/50 gap-1.5"
        >
          <Link href={ROUTES.USER.PRODUCTS}>
            <span>Tiếp tục mua sắm</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default OrderSummaryCard;
