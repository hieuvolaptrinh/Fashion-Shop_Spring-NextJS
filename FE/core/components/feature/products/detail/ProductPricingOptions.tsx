'use client';

import { Badge } from '@/core/components/ui/badge';
import { Button } from '@/core/components/ui/button';
import { Label } from '@/core/components/ui/label';
import type { PurchaseOption } from '@/core/hooks/useProductDetail';
import type { Product } from '@/core/lib/type';
import { cn, formatCurrency, formatDate } from '@/core/lib/utils';
import { Check, Gift, Package, Share2, Star } from 'lucide-react';
import { useMemo } from 'react';
import { toast } from 'sonner';

interface ProductPricingOptionsProps {
  product: Product;
  selectedOption: PurchaseOption;
  onSelectOption: (option: PurchaseOption) => void;
  currentPrice: number;
  currentOriginalPrice: number;
  averageRating?: number;
  totalReviews?: number;
}

export function ProductPricingOptions({
  product,
  selectedOption,
  onSelectOption,
  currentPrice,
  currentOriginalPrice,
  averageRating = 5.0,
  totalReviews = 0,
}: ProductPricingOptionsProps) {
  const hasDiscount = currentOriginalPrice > currentPrice && currentOriginalPrice > 0;
  const discountPercent = hasDiscount
    ? Math.round(((currentOriginalPrice - currentPrice) / currentOriginalPrice) * 100)
    : 0;

  // Tìm combo có mức tiết kiệm cao nhất
  const bestComboId = useMemo(() => {
    if (!product.listCombo || product.listCombo.length === 0) return null;
    let maxSavings = 0;
    let bestId: number | null = null;

    product.listCombo.forEach((combo) => {
      const origTotal = product.salePrice * combo.quantityInCombo;
      const savings = origTotal - combo.comboPrice;
      if (savings > maxSavings && combo.comboId !== undefined) {
        maxSavings = savings;
        bestId = combo.comboId;
      }
    });

    return bestId;
  }, [product]);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Đã sao chép liên kết sản phẩm vào bộ nhớ tạm!');
    }
  };

  return (
    <div className="space-y-5">
      {/* Danh mục, Tên sản phẩm, Nút chia sẻ & Thông số */}
      <div>
        <div className="mb-2 flex items-center justify-between gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer rounded-lg"
            title="Chia sẻ sản phẩm"
          >
            <Share2 className="size-3.5" />
            <span className="hidden sm:inline">Chia sẻ</span>
          </Button>
        </div>

        <h1 className="text-2xl font-black tracking-tight text-foreground md:text-3xl">
          {product.productName}
        </h1>

        {product.usageInstructions && (
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground md:text-base">
            {product.usageInstructions}
          </p>
        )}

        {product.manufactureDate && (
          <div className="mt-2.5 text-xs text-muted-foreground sm:text-sm">
            <span className="font-semibold text-foreground">Hạn sử dụng: </span>
            {formatDate(product.manufactureDate)}
          </div>
        )}
      </div>

      {/* Đánh giá sao & Uy tín */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star
              key={i}
              className={`size-4 ${
                i <= Math.round(averageRating)
                  ? 'fill-warning text-warning'
                  : 'text-muted-foreground/30'
              }`}
            />
          ))}
        </div>
        <span className="text-xs font-medium text-muted-foreground sm:text-sm">
          {totalReviews > 0
            ? `(${averageRating.toFixed(1)} / 5 từ ${totalReviews} đánh giá)`
            : 'Chưa có đánh giá'}
        </span>
        <span className="text-muted-foreground/40">•</span>
        <span className="text-xs font-medium text-success">Đã bán 340+</span>
      </div>

      {/* Giá tiền hiện tại tổng hợp */}
      <div className="flex flex-wrap items-baseline gap-3 rounded-2xl bg-muted/30 p-4 border border-border/60">
        <span className="text-3xl font-black text-primary md:text-4xl">
          {formatCurrency(currentPrice)}
        </span>
        {hasDiscount && (
          <span className="text-base text-muted-foreground line-through md:text-lg">
            {formatCurrency(currentOriginalPrice)}
          </span>
        )}
        {hasDiscount && (
          <Badge variant="destructive" className="font-bold text-xs">
            Giảm {discountPercent}%
          </Badge>
        )}
      </div>

      {/* Khối tùy chọn mua hàng Bento Combo */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-bold text-foreground">
            Tùy chọn mua hàng & Combo ưu đãi
          </Label>
          <span className="text-xs text-muted-foreground">Chọn gói để nhận chiết khấu</span>
        </div>

        <div className="grid gap-2.5">
          {/* Mua sản phẩm đơn lẻ */}
          <div
            onClick={() => onSelectOption({ type: 'single' })}
            className={cn(
              'group relative cursor-pointer rounded-2xl border-2 p-3.5 transition-all duration-200',
              selectedOption.type === 'single'
                ? 'border-primary bg-primary/5 shadow-xs'
                : 'border-border/70 bg-card hover:border-border'
            )}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                    selectedOption.type === 'single'
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-muted-foreground/40'
                  )}
                >
                  {selectedOption.type === 'single' && <Check className="size-3" />}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <Package className="size-4 text-primary" />
                    <span className="text-sm font-bold text-foreground">
                      Mua lẻ 1 sản phẩm
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">Quy cách đóng gói tiêu chuẩn</p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-base font-black text-primary">
                  {formatCurrency(product.salePrice)}
                </span>
                {product.originalPrice > product.salePrice && (
                  <div className="text-xs text-muted-foreground line-through">
                    {formatCurrency(product.originalPrice)}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Các tùy chọn Combo ưu đãi Bento Card */}
          {product.listCombo && product.listCombo.length > 0 && (
            <>
              {product.listCombo.map((combo) => {
                const isSelected =
                  selectedOption.type === 'combo' &&
                  selectedOption.data?.comboId === combo.comboId;
                const isBest = bestComboId === combo.comboId;
                const comboOriginalTotal = product.salePrice * combo.quantityInCombo;
                const comboSavingsPercent =
                  comboOriginalTotal > combo.comboPrice
                    ? Math.round(
                        ((comboOriginalTotal - combo.comboPrice) / comboOriginalTotal) * 100
                      )
                    : 0;
                const unitPrice = Math.round(combo.comboPrice / combo.quantityInCombo);

                return (
                  <div
                    key={combo.comboId}
                    onClick={() => onSelectOption({ type: 'combo', data: combo })}
                    className={cn(
                      'group relative cursor-pointer rounded-2xl border-2 p-3.5 transition-all duration-200',
                      isSelected
                        ? 'border-primary bg-primary/5 shadow-xs'
                        : 'border-border/70 bg-card hover:border-border',
                      isBest && !isSelected && 'border-primary/40'
                    )}
                  >
                    {isBest && (
                      <span className="absolute -top-2.5 right-4 rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-primary-foreground shadow-xs">
                        Tiết kiệm nhất
                      </span>
                    )}

                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            'flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                            isSelected
                              ? 'border-primary bg-primary text-primary-foreground'
                              : 'border-muted-foreground/40'
                          )}
                        >
                          {isSelected && <Check className="size-3" />}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <Gift className="size-4 text-primary" />
                            <span className="text-sm font-bold text-foreground">
                              {combo.comboDescription || `Combo ${combo.quantityInCombo} sản phẩm`}
                            </span>
                            {comboSavingsPercent > 0 && (
                              <Badge variant="destructive" className="px-1.5 py-0 text-[10px] font-bold">
                                -{comboSavingsPercent}%
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Chỉ <span className="font-semibold text-foreground">{formatCurrency(unitPrice)}</span> / sản phẩm
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-base font-black text-primary">
                          {formatCurrency(combo.comboPrice)}
                        </span>
                        {comboOriginalTotal > combo.comboPrice && (
                          <div className="text-xs text-muted-foreground line-through">
                            {formatCurrency(comboOriginalTotal)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
