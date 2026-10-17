"use client";

import Image from "next/image";
import Link from "next/link";
import { IMAGES, ROUTES } from "@/core/constants";
import { convertToSlug } from "@/core/lib/convert";
import { formatCurrency } from "@/core/lib/utils";
import type { Product } from "@/core/lib/type";
import { ExternalLink, Tag } from "lucide-react";

interface ChatProductCardProps {
  product: Product;
}

export default function ChatProductCard({ product }: ChatProductCardProps) {
  const imageUrl =
    product.listImages && product.listImages.length > 0 && product.listImages[0]?.link
      ? product.listImages[0].link
      : IMAGES.FALLBACK_PRODUCT;

  const slug = convertToSlug(product.productName || "san-pham");
  const detailUrl = ROUTES.USER.PRODUCT_DETAIL(slug, product.productId);

  const hasDiscount =
    product.originalPrice > product.salePrice && product.originalPrice > 0;
  const discountPercent = hasDiscount
    ? Math.round(
        ((product.originalPrice - product.salePrice) / product.originalPrice) * 100
      )
    : 0;

  return (
    <div className="flex-shrink-0 w-44 rounded-xl border border-border/60 bg-card p-2.5 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 group">
      {/* Product Image */}
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-muted/40 mb-2">
        <Image
          src={imageUrl}
          alt={product.productName}
          fill
          sizes="176px"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {hasDiscount && (
          <span className="absolute top-1 left-1 bg-rose-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm flex items-center gap-0.5">
            <Tag className="w-2.5 h-2.5" /> -{discountPercent}%
          </span>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-1">
        <h4 className="text-xs font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors" title={product.productName}>
          {product.productName}
        </h4>

        <div className="flex items-baseline gap-1.5 flex-wrap">
          <span className="text-xs font-bold text-rose-600">
            {formatCurrency(product.salePrice > 0 ? product.salePrice : product.originalPrice)}
          </span>
          {hasDiscount && (
            <span className="text-[10px] text-muted-foreground line-through">
              {formatCurrency(product.originalPrice)}
            </span>
          )}
        </div>

        {/* View Detail Link */}
        <Link
          href={detailUrl}
          className="mt-2 inline-flex items-center justify-center gap-1 w-full py-1 text-[11px] font-medium text-primary bg-primary/10 hover:bg-primary hover:text-primary-foreground rounded-md transition-colors"
        >
          <span>Xem chi tiết</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
