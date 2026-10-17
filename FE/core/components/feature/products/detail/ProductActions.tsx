'use client';

import { Button } from '@/core/components/ui/button';
import { Label } from '@/core/components/ui/label';
import {
  AlertCircle,
  CheckCircle,
  ChevronRight,
  Headphones,
  Loader2,
  Minus,
  Plus,
  RotateCcw,
  ShieldCheck,
  ShoppingCart,
  Truck,
  Zap,
} from 'lucide-react';

interface ProductActionsProps {
  maxQuantity: number;
  quantity: number;
  onQuantityChange: (qty: number) => void;
  onAddToCart: () => void;
  onBuyNow: () => void;
  isSubmitting: boolean;
}

export function ProductActions({
  maxQuantity,
  quantity,
  onQuantityChange,
  onAddToCart,
  onBuyNow,
  isSubmitting,
}: ProductActionsProps) {
  const isOutOfStock = maxQuantity <= 0;

  return (
    <div className="space-y-6 pt-2">
      {/* Bộ chọn số lượng */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-bold text-foreground">Số lượng mua</Label>
          <span className="text-xs text-muted-foreground">Tối đa: {maxQuantity}</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="inline-flex items-center rounded-xl border border-border/80 bg-card p-1 shadow-2xs">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8 rounded-lg cursor-pointer hover:bg-muted text-foreground"
              onClick={() => onQuantityChange(quantity - 1)}
              disabled={quantity <= 1 || isOutOfStock}
              aria-label="Giảm số lượng"
            >
              <Minus className="size-3.5" />
            </Button>

            <span className="w-12 text-center text-sm font-bold text-foreground">
              {quantity}
            </span>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8 rounded-lg cursor-pointer hover:bg-muted text-foreground"
              onClick={() => onQuantityChange(quantity + 1)}
              disabled={quantity >= maxQuantity || isOutOfStock}
              aria-label="Tăng số lượng"
            >
              <Plus className="size-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Trạng thái tồn kho */}
      {!isOutOfStock ? (
        <div className="flex items-center justify-between rounded-xl border border-success/30 bg-success/10 px-4 py-3">
          <div className="flex items-center gap-2.5">
            <div className="relative flex size-2.5 items-center justify-center">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-success" />
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-success sm:text-sm">
              <CheckCircle className="size-4" />
              <span>Còn lại: {maxQuantity} sản phẩm sẵn sàng giao</span>
            </div>
          </div>
          <span className="rounded-md bg-success/20 px-2 py-0.5 text-xs font-bold text-success">
            Có sẵn
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-xs font-medium text-destructive sm:text-sm">
          <AlertCircle className="size-5 shrink-0" />
          <span>Sản phẩm hiện đang tạm hết hàng. Vui lòng quay lại sau!</span>
        </div>
      )}

      {/* Nút hành động Mua hàng */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Button
          type="button"
          size="lg"
          variant="outline"
          disabled={isOutOfStock || isSubmitting}
          onClick={onAddToCart}
          className="h-12 w-full cursor-pointer rounded-xl border-2 border-primary text-sm font-bold text-primary transition-all hover:bg-primary/10 active:scale-[0.98]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              <span>Đang xử lý...</span>
            </>
          ) : (
            <>
              <ShoppingCart className="mr-2 size-4" />
              <span>Thêm vào giỏ</span>
            </>
          )}
        </Button>

        <Button
          type="button"
          size="lg"
          disabled={isOutOfStock || isSubmitting}
          onClick={onBuyNow}
          className="h-12 w-full cursor-pointer rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow-xs transition-all hover:bg-primary/90 active:scale-[0.98]"
        >
          <Zap className="mr-2 size-4" />
          <span>Mua ngay</span>
          <ChevronRight className="ml-1 size-4" />
        </Button>
      </div>

      {/* 4 Thẻ Cam Kết An Tâm Mua Sắm */}
      <div className="grid grid-cols-2 gap-2.5 pt-2">
        <div className="flex items-start gap-2.5 rounded-xl border border-border/70 bg-card p-3">
          <ShieldCheck className="size-5 shrink-0 text-primary mt-0.5" />
          <div>
            <h5 className="text-xs font-bold text-foreground">Chính hãng 100%</h5>
            <p className="text-[11px] text-muted-foreground">Cam kết nguồn gốc rõ ràng</p>
          </div>
        </div>

        <div className="flex items-start gap-2.5 rounded-xl border border-border/70 bg-card p-3">
          <RotateCcw className="size-5 shrink-0 text-primary mt-0.5" />
          <div>
            <h5 className="text-xs font-bold text-foreground">Đổi trả 30 ngày</h5>
            <p className="text-[11px] text-muted-foreground">Miễn phí nếu lỗi từ NSX</p>
          </div>
        </div>

        <div className="flex items-start gap-2.5 rounded-xl border border-border/70 bg-card p-3">
          <Truck className="size-5 shrink-0 text-primary mt-0.5" />
          <div>
            <h5 className="text-xs font-bold text-foreground">Freeship từ 500k</h5>
            <p className="text-[11px] text-muted-foreground">Giao hàng toàn quốc</p>
          </div>
        </div>

        <div className="flex items-start gap-2.5 rounded-xl border border-border/70 bg-card p-3">
          <Headphones className="size-5 shrink-0 text-primary mt-0.5" />
          <div>
            <h5 className="text-xs font-bold text-foreground">Tư vấn tận tâm</h5>
            <p className="text-[11px] text-muted-foreground">Hỗ trợ 24/7 nhanh chóng</p>
          </div>
        </div>
      </div>
    </div>
  );
}
