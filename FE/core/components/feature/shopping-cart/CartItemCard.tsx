"use client";

import React from "react";
import Image from "next/image";
import { Minus, Plus, Trash2, AlertCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/core/components/ui/button";
import { Checkbox } from "@/core/components/ui/checkbox";
import { formatCurrency } from "@/core/lib/utils";
import { IMAGES } from "@/core/constants";
import type { CartItem } from "@/core/lib/type";

interface CartItemCardProps {
  item: CartItem;
  isSelected: boolean;
  onToggleSelect: (id: number) => void;
  onUpdateQuantity: (id: number, newQuantity: number) => void;
  onRemove: (id: number) => void;
}

export const CartItemCard: React.FC<CartItemCardProps> = ({
  item,
  isSelected,
  onToggleSelect,
  onUpdateQuantity,
  onRemove,
}) => {
  const imageUrl = item.product?.listImages?.[0]?.link || IMAGES.FALLBACK_PRODUCT;
  const itemTotal = item.price * item.quantity;
  const availableStock = item.product?.quantity ?? 0;
  const isOutOfStock = availableStock <= 0;
  const isExceedingStock = !isOutOfStock && item.quantity > availableStock;
  const isMaxStock = !isOutOfStock && item.quantity >= availableStock;

  return (
    <div
      className={`rounded-xl border p-4 transition-all duration-200 hover:shadow-xs ${
        isOutOfStock
          ? "border-destructive/30 bg-destructive/5 opacity-80"
          : isExceedingStock
          ? "border-amber-500/40 bg-amber-500/5 hover:border-amber-500/60"
          : "border-border/60 bg-card hover:border-border"
      }`}
    >
      {/* Mobile Layout */}
      <div className="flex flex-col space-y-3 sm:hidden">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={isOutOfStock ? false : isSelected}
            disabled={isOutOfStock}
            onCheckedChange={() => onToggleSelect(item.cartDetailId)}
            className="mt-1 h-5 w-5 rounded-md"
            aria-label={`Chọn sản phẩm ${item.product.productName}`}
          />
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-border/60 bg-muted/40">
            <Image
              src={imageUrl}
              alt={item.product.productName || "Sản phẩm"}
              fill
              className={`object-cover ${isOutOfStock ? "grayscale" : ""}`}
              sizes="64px"
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <h3 className="line-clamp-2 text-sm font-medium text-foreground">
                {item.product.productName}
              </h3>
              {isOutOfStock && (
                <span className="inline-flex items-center gap-1 rounded-md bg-destructive/10 px-1.5 py-0.5 text-[10px] font-semibold text-destructive border border-destructive/20">
                  <AlertCircle className="h-3 w-3" />
                  Tạm hết hàng
                </span>
              )}
              {isExceedingStock && (
                <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-amber-600 dark:text-amber-400 border border-amber-500/30">
                  <AlertTriangle className="h-3 w-3" />
                  Kho còn {availableStock}
                </span>
              )}
            </div>
            <p className="mt-1 text-sm font-bold text-primary">
              {formatCurrency(itemTotal)}
            </p>
            {isExceedingStock && (
              <p className="mt-1 text-[11px] font-medium text-amber-600 dark:text-amber-400">
                ⚠️ Vượt quá tồn kho ({availableStock}). Vui lòng giảm để thanh toán.
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-border/40">
          <div className="flex items-center rounded-lg border border-border bg-muted/30 p-0.5">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onUpdateQuantity(item.cartDetailId, item.quantity - 1)}
              className="h-7 w-7 rounded-md text-muted-foreground hover:text-foreground"
            >
              <Minus className="h-3.5 w-3.5" />
            </Button>
            <span className="w-8 text-center text-xs font-semibold text-foreground">
              {item.quantity}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={isOutOfStock || isMaxStock}
              onClick={() => onUpdateQuantity(item.cartDetailId, item.quantity + 1)}
              className="h-7 w-7 rounded-md text-muted-foreground hover:text-foreground disabled:opacity-40"
            >
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onRemove(item.cartDetailId)}
            className="text-xs text-muted-foreground hover:text-destructive gap-1 px-2 h-8"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Xóa</span>
          </Button>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden sm:flex sm:items-center sm:gap-4">
        <Checkbox
          checked={isOutOfStock ? false : isSelected}
          disabled={isOutOfStock}
          onCheckedChange={() => onToggleSelect(item.cartDetailId)}
          className="h-5 w-5 rounded-md"
          aria-label={`Chọn sản phẩm ${item.product.productName}`}
        />

        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-border/60 bg-muted/40">
          <Image
            src={imageUrl}
            alt={item.product.productName || "Sản phẩm"}
            fill
            className={`object-cover ${isOutOfStock ? "grayscale" : ""}`}
            sizes="80px"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="line-clamp-2 text-sm font-medium text-foreground">
              {item.product.productName}
            </h3>
            {isOutOfStock && (
              <span className="inline-flex items-center gap-1 rounded-md bg-destructive/10 px-2 py-0.5 text-xs font-semibold text-destructive border border-destructive/20 shrink-0">
                <AlertCircle className="h-3 w-3" />
                Tạm hết hàng
              </span>
            )}
            {isExceedingStock && (
              <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/15 px-2 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400 border border-amber-500/30 shrink-0">
                <AlertTriangle className="h-3 w-3" />
                Kho còn {availableStock} món
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Đơn giá: {formatCurrency(item.price)}
          </p>
          {isExceedingStock && (
            <p className="mt-1 text-xs font-medium text-amber-600 dark:text-amber-400">
              ⚠️ Bạn đang chọn {item.quantity} sản phẩm nhưng kho chỉ còn {availableStock}. Vui lòng giảm số lượng để thanh toán.
            </p>
          )}
        </div>

        <div className="flex items-center rounded-lg border border-border bg-muted/30 p-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onUpdateQuantity(item.cartDetailId, item.quantity - 1)}
            className="h-8 w-8 rounded-md text-muted-foreground hover:text-foreground"
          >
            <Minus className="h-3.5 w-3.5" />
          </Button>
          <span className="w-10 text-center text-sm font-semibold text-foreground">
            {item.quantity}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={isOutOfStock || isMaxStock}
            onClick={() => onUpdateQuantity(item.cartDetailId, item.quantity + 1)}
            className="h-8 w-8 rounded-md text-muted-foreground hover:text-foreground disabled:opacity-40"
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
        </div>

        <div className="w-28 text-right">
          <p className="text-base font-bold text-primary">
            {formatCurrency(itemTotal)}
          </p>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onRemove(item.cartDetailId)}
          className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg shrink-0"
          title="Xóa khỏi giỏ hàng"
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Xóa</span>
        </Button>
      </div>
    </div>
  );
};

export default CartItemCard;
