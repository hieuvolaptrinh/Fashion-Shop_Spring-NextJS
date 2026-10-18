"use client";

import React from "react";
import Image from "next/image";
import { Eye } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/core/components/ui/card";
import { Button } from "@/core/components/ui/button";
import { Badge } from "@/core/components/ui/badge";
import { OrderStatusBadge } from "@/core/components/feature/admin/common/OrderStatusBadge";
import { formatCurrency, formatDate } from "@/core/lib/utils";
import { IMAGES } from "@/core/constants";
import type { OrderResponse } from "@/core/lib/type";

interface UserOrderCardProps {
  order: OrderResponse;
  onOpenDetail: (order: OrderResponse) => void;
}

const MAX_VISIBLE_ITEMS = 2;

export const UserOrderCard: React.FC<UserOrderCardProps> = ({
  order,
  onOpenDetail,
}) => {
  const isPaid = order.isPay ?? order.pay ?? false;
  const items = order.items || [];
  const visibleItems = items.slice(0, MAX_VISIBLE_ITEMS);
  const remainingCount = items.length - MAX_VISIBLE_ITEMS;

  const itemsTotal = items.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );
  const shippingFee = Math.max(0, (order.totalPrice || 0) - itemsTotal);

  return (
    <Card className="border border-border/60 bg-card shadow-xs transition-all duration-200 hover:border-border hover:shadow-sm">
      <CardHeader className="border-b border-border/60 px-5 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground text-sm">
                Đơn hàng #{order.orderId}
              </span>
              <span className="text-muted-foreground text-xs">•</span>
              <span className="text-xs text-muted-foreground">
                {formatDate(order.createAt)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-1">
              Giao đến: {order.shippingAddress}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {isPaid ? (
              <Badge variant="outline" className="text-[11px] bg-success/10 text-success border-success/30 font-normal">
                Đã thanh toán
              </Badge>
            ) : (
              <Badge variant="outline" className="text-[11px] bg-muted text-muted-foreground border-border font-normal">
                Chưa thanh toán
              </Badge>
            )}
            <OrderStatusBadge status={order.status as string} />
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5 space-y-3">
        <div className="divide-y divide-border/40 space-y-3">
          {visibleItems.map((detail) => {
            const product = detail.product;
            const imageUrl = product?.listImages?.[0]?.link || IMAGES.FALLBACK_PRODUCT;
            const itemTotal = detail.price * detail.quantity;

            return (
              <div
                key={detail.orderDetailId}
                className="flex items-center gap-3 pt-3 first:pt-0"
              >
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-border/60 bg-muted/40">
                  <Image
                    src={imageUrl}
                    alt={product?.productName || "Sản phẩm"}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <h4 className="line-clamp-1 text-sm font-medium text-foreground">
                    {product?.productName}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                    <span>
                      Số lượng: <strong className="text-foreground">{detail.quantity}</strong>
                    </span>
                    <span>•</span>
                    <span>Đơn giá: {formatCurrency(detail.price)}</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-sm font-semibold text-foreground">
                    {formatCurrency(itemTotal)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {remainingCount > 0 && (
          <button
            type="button"
            onClick={() => onOpenDetail(order)}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 mt-2 rounded-lg bg-muted/40 hover:bg-muted text-xs font-medium text-muted-foreground hover:text-foreground transition-colors group cursor-pointer border border-border/40"
          >
            <span>+ {remainingCount} sản phẩm khác trong đơn hàng</span>
            <span className="text-primary font-normal group-hover:underline">
              (Nhấn để xem chi tiết)
            </span>
          </button>
        )}
      </CardContent>

      <CardFooter className="border-t border-border/60 bg-muted/20 px-5 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              Tổng thanh toán ({items.length} món):
            </span>
            <span className="text-base font-bold text-rose-600">
              {formatCurrency(order.totalPrice)}
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground">
            {shippingFee === 0 ? (
              <span className="text-success font-medium">Miễn phí vận chuyển</span>
            ) : (
              <span>(Đã bao gồm {formatCurrency(shippingFee)} phí vận chuyển)</span>
            )}
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onOpenDetail(order)}
          className="rounded-lg text-xs h-8 gap-1.5 border-border hover:bg-muted font-normal self-end sm:self-auto"
        >
          <Eye className="h-3.5 w-3.5" />
          <span>Xem chi tiết</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default UserOrderCard;
