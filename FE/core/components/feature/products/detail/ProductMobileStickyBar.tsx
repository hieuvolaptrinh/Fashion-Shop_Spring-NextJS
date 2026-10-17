'use client';

import { Button } from '@/core/components/ui/button';
import { IMAGES } from '@/core/constants';
import type { Product } from '@/core/lib/type';
import { formatCurrency } from '@/core/lib/utils';
import { Loader2, ShoppingCart, Zap } from 'lucide-react';
import Image from 'next/image';

interface ProductMobileStickyBarProps {
  product: Product;
  currentPrice: number;
  maxQuantity: number;
  onAddToCart: () => void;
  onBuyNow: () => void;
  isSubmitting: boolean;
}

export function ProductMobileStickyBar({
  product,
  currentPrice,
  maxQuantity,
  onAddToCart,
  onBuyNow,
  isSubmitting,
}: ProductMobileStickyBarProps) {
  const isOutOfStock = maxQuantity <= 0;
  const imageSrc = product.listImages?.[0]?.link || IMAGES.FALLBACK_PRODUCT;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border/80 bg-background/95 p-3 shadow-lg backdrop-blur-md md:hidden">
      <div className="flex items-center justify-between gap-3">
        {/* Thông tin nhanh sản phẩm */}
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="relative aspect-square size-11 shrink-0 overflow-hidden rounded-lg border border-border/60 bg-muted/20">
            <Image
              src={imageSrc}
              alt={product.productName}
              fill
              sizes="44px"
              className="object-cover"
            />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-foreground">
              {product.productName}
            </p>
            <p className="text-sm font-black text-primary">
              {formatCurrency(currentPrice)}
            </p>
          </div>
        </div>

        {/* Các nút hành động nhanh */}
        <div className="flex shrink-0 items-center gap-2">
          <Button
            type="button"
            size="icon"
            variant="outline"
            disabled={isOutOfStock || isSubmitting}
            onClick={onAddToCart}
            className="size-10 rounded-xl border-primary text-primary hover:bg-primary/10 cursor-pointer"
            aria-label="Thêm vào giỏ hàng"
          >
            {isSubmitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <ShoppingCart className="size-4" />
            )}
          </Button>

          <Button
            type="button"
            size="sm"
            disabled={isOutOfStock || isSubmitting}
            onClick={onBuyNow}
            className="h-10 rounded-xl bg-primary px-4 text-xs font-bold text-primary-foreground shadow-xs cursor-pointer active:scale-95"
          >
            <Zap className="mr-1 size-3.5" />
            <span>Mua ngay</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
