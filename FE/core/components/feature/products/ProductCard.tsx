'use client';

import { Badge } from '@/core/components/ui/badge';
import { Button } from '@/core/components/ui/button';
import { Card, CardContent } from '@/core/components/ui/card';
import { IMAGES, ROUTES } from '@/core/constants';
import { convertToSlug } from '@/core/lib/convert';
import type { Product } from '@/core/lib/type';
import { formatCurrency } from '@/core/lib/utils';
import { useCartStore } from '@/core/store/cartStore';
import { Loader2, ShoppingCart, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { type MouseEvent, useState } from 'react';
import { toast } from 'sonner';

export interface ProductCardProps {
  product: Product;
  variant?: 'compact' | 'full';
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isAdding, setIsAdding] = useState(false);

  const hasDiscount =
    product.originalPrice > product.salePrice && product.originalPrice > 0;
  const discountPercent = hasDiscount
    ? Math.round(
        ((product.originalPrice - product.salePrice) / product.originalPrice) * 100
      )
    : 0;

  const isOutOfStock = (product.quantity ?? 0) <= 0;
  const slug = convertToSlug(product.productName);
  const productDetailUrl = ROUTES.USER.PRODUCT_DETAIL(slug, product.productId);

  const handleAddToCart = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock) {
      toast.error('Sản phẩm hiện đang tạm hết hàng');
      return;
    }

    setIsAdding(true);
    try {
      const result = await useCartStore.getState().addToCart(product, 1);
      if (result.success) {
        toast.success('Đã thêm vào giỏ hàng!');
      } else {
        toast.error(result.message || 'Không thể thêm vào giỏ hàng');
      }
    } catch {
      toast.error('Không thể thêm vào giỏ hàng');
    } finally {
      setIsAdding(false);
    }
  };

  const imageSrc = product.listImages?.[0]?.link || IMAGES.FALLBACK_PRODUCT;

  return (
    <Card className="group relative mx-auto flex h-full w-full max-w-[340px] flex-col overflow-hidden rounded-2xl border border-border/70 bg-card p-0 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md">
      <div className="relative aspect-square w-full overflow-hidden bg-muted/30">
        <Link href={productDetailUrl} className="relative block h-full w-full">
          <Image
            src={imageSrc}
            alt={product.productName}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        </Link>

        {hasDiscount && (
          <div className="pointer-events-none absolute top-2.5 left-2.5 z-10">
            <Badge variant="destructive" className="px-2 py-0.5 text-xs font-bold">
              -{discountPercent}%
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="flex flex-1 flex-col p-3.5 sm:p-4">
        <Link href={productDetailUrl} className="group-hover:text-primary">
          <h3
            className="mb-1.5 truncate text-sm font-semibold text-foreground transition-colors sm:text-base"
            title={product.productName}
          >
            {product.productName}
          </h3>
        </Link>

        <div className="mb-2 flex items-baseline justify-between gap-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-bold text-rose-600 sm:text-lg">
              {formatCurrency(product.salePrice)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-muted-foreground line-through">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="size-2.5 fill-warning text-warning sm:size-3" />
              ))}
            </div>
            <span className="text-[11px] font-medium text-muted-foreground sm:text-xs">
              5/5
            </span>
          </div>
        </div>

        <div className="mb-3.5 flex items-center justify-between gap-2 text-xs text-muted-foreground">
          <span className="truncate">
            Loại:{' '}
            <span className="font-medium text-foreground">
              {product.listTypes?.[0]?.typeName || 'Chưa phân loại'}
            </span>
          </span>
          <span className="shrink-0">
            {isOutOfStock ? (
              <span className="font-medium text-destructive">Hết hàng</span>
            ) : (
              <span>
                Còn:{' '}
                <strong className={product.quantity <= 5 ? 'text-warning' : 'text-foreground'}>
                  {product.quantity}
                </strong>
              </span>
            )}
          </span>
        </div>

        <div className="mt-auto grid grid-cols-4 gap-1.5 sm:gap-2">
          <Button
            type="button"
            size="sm"
            disabled={isOutOfStock || isAdding}
            onClick={handleAddToCart}
            className="col-span-3 w-full cursor-pointer rounded-xl bg-gradient-to-r from-primary to-blue-600 text-primary-foreground shadow-xs transition-all hover:opacity-90 disabled:opacity-50 disabled:pointer-events-none"
          >
            {isAdding ? (
              <>
                <Loader2 className="mr-1.5 size-3.5 animate-spin" />
                <span className="truncate">Đang thêm...</span>
              </>
            ) : isOutOfStock ? (
              <span>Hết hàng</span>
            ) : (
              <>
                <ShoppingCart className="mr-1.5 size-3.5 shrink-0" />
                <span className="truncate">Thêm vào giỏ</span>
              </>
            )}
          </Button>

          <Link href={productDetailUrl} className="col-span-1 w-full">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full cursor-pointer rounded-xl border-border/80 px-1 text-xs text-foreground hover:bg-muted"
            >
              <span className="truncate">Chi tiết</span>
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
