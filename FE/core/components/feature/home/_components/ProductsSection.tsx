'use client';

import ProductCard from '@/core/components/feature/products/ProductCard';
import { ScrollReveal } from '@/core/components/ui/scroll-reveal';
import { ROUTES } from '@/core/constants';
import {
  DEFAULT_HOME_PRODUCT_LIMIT,
  useHomeProducts,
} from '@/core/hooks/useHomeProducts';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function ProductsSection() {
  const { products, loading } = useHomeProducts(DEFAULT_HOME_PRODUCT_LIMIT);

  return (
    <section className="space-y-6 sm:space-y-8">
      {/* Tiêu đề căn giữa đồng bộ kèm ScrollReveal */}
      <ScrollReveal direction="up" distance={16} duration={500}>
        <div className="flex flex-col items-center justify-center space-y-2 text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Sản phẩm tuyển chọn
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Hàng Mới Về
          </h2>
          <div className="h-1 w-12 rounded-full bg-primary/80" />
        </div>
      </ScrollReveal>

      {/* Danh sách sản phẩm */}
      {loading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
          {Array.from({ length: DEFAULT_HOME_PRODUCT_LIMIT }).map((_, index) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: Fixed skeleton placeholders
              key={index}
              className="flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card p-3 shadow-xs"
            >
              <div className="aspect-square w-full animate-pulse rounded-xl bg-muted/60" />
              <div className="mt-3 space-y-2">
                <div className="h-4 w-3/4 animate-pulse rounded-md bg-muted/60" />
                <div className="h-4 w-1/2 animate-pulse rounded-md bg-muted/60" />
                <div className="pt-2">
                  <div className="h-8 w-full animate-pulse rounded-lg bg-muted/50" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
          {products.map((product, index) => (
            <ScrollReveal
              key={product.productId}
              direction="up"
              distance={20}
              duration={500}
              delay={Math.min(index * 60, 420)}
              className="h-full"
            >
              <ProductCard product={product} variant="compact" />
            </ScrollReveal>
          ))}
        </div>
      )}

      {/* Đường dẫn văn bản tối giản 'Khám phá thêm tất cả sản phẩm ->' kèm ScrollReveal */}
      <ScrollReveal direction="up" distance={12} duration={500} delay={200}>
        <div className="pt-4 text-center sm:pt-6">
          <Link
            href={ROUTES.USER.PRODUCTS}
            className="group inline-flex items-center gap-2 text-sm font-semibold transition-all sm:text-base"
          >
            <span className="relative text-foreground transition-colors group-hover:text-primary after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-300 group-hover:after:w-full">
              Khám phá thêm tất cả sản phẩm
            </span>
            <ArrowRight className="h-4 w-4 text-primary transition-all duration-300 group-hover:translate-x-1.5" />
          </Link>
        </div>
      </ScrollReveal>
    </section>
  );
}
