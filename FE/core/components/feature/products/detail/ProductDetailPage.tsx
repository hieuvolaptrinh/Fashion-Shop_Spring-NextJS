'use client';

import { useProductDetail } from '@/core/hooks/useProductDetail';
import { Loader2 } from 'lucide-react';
import { ProductActions } from './ProductActions';
import { ProductBreadcrumb } from './ProductBreadcrumb';
import { ProductGallery } from './ProductGallery';
import { ProductMobileStickyBar } from './ProductMobileStickyBar';
import { ProductPricingOptions } from './ProductPricingOptions';
import { ProductRelated } from './ProductRelated';
import { ProductTabs } from './ProductTabs';

interface ProductDetailPageProps {
  productId: string;
}

export default function ProductDetailPage({ productId }: ProductDetailPageProps) {
  const p = useProductDetail(productId);

  if (p.loading) {
    return (
      <div className="container mx-auto py-28 text-center">
        <div className="inline-flex items-center gap-2.5 rounded-full border border-border/60 bg-muted/30 px-5 py-2.5 text-sm font-medium text-muted-foreground shadow-2xs">
          <Loader2 className="size-4 animate-spin text-primary" />
          <span>Đang tải thông tin chi tiết sản phẩm...</span>
        </div>
      </div>
    );
  }

  if (!p.product) {
    return (
      <div className="container mx-auto py-28 text-center">
        <h2 className="text-xl font-bold text-foreground sm:text-2xl">
          Không tìm thấy sản phẩm
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã ngừng kinh doanh.
        </p>
      </div>
    );
  }

  const primaryTypeId = p.product.listTypes?.[0]?.typeId;

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 pb-28 md:pb-16">
      <ProductBreadcrumb product={p.product} />

      <div className="grid gap-8 lg:grid-cols-12 lg:gap-10 items-start">
        <div className="lg:col-span-7">
          <ProductGallery
            product={p.product}
            selectedImage={p.selectedImage}
            onSelectImage={p.setSelectedImage}
          />
        </div>

        <div className="space-y-6 lg:sticky lg:top-24 lg:col-span-5 rounded-3xl border border-border/70 bg-card/60 p-5 sm:p-7 backdrop-blur-xs shadow-xs">
          <ProductPricingOptions
            product={p.product}
            selectedOption={p.selectedOption}
            onSelectOption={p.setSelectedOption}
            currentPrice={p.currentPrice}
            currentOriginalPrice={p.currentOriginalPrice}
            averageRating={p.averageRating}
            totalReviews={p.totalReviews}
          />

          <ProductActions
            maxQuantity={p.maxQuantity}
            quantity={p.quantity}
            onQuantityChange={p.handleQuantityChange}
            onAddToCart={p.handleAddToCart}
            onBuyNow={p.handleBuyNow}
            isSubmitting={p.isSubmitting}
          />
        </div>
      </div>

      <ProductTabs
        product={p.product}
        comments={p.comments}
        loadingComments={p.loadingComments}
        onRefreshComments={p.refreshComments}
      />

      <ProductRelated
        currentProductId={p.product.productId}
        typeId={primaryTypeId}
      />

      <ProductMobileStickyBar
        product={p.product}
        currentPrice={p.currentPrice}
        maxQuantity={p.maxQuantity}
        onAddToCart={p.handleAddToCart}
        onBuyNow={p.handleBuyNow}
        isSubmitting={p.isSubmitting}
      />
    </div>
  );
}
