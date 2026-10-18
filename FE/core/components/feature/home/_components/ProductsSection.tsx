'use client';

import ProductCard from '@/core/components/feature/products/ProductCard';
import { ScrollReveal } from '@/core/components/ui/scroll-reveal';
import {
  DEFAULT_HOME_PRODUCT_LIMIT,
  useHomeProducts,
} from '@/core/hooks/useHomeProducts';

export default function ProductsSection() {
  const { products, loading } = useHomeProducts(DEFAULT_HOME_PRODUCT_LIMIT);

  return (
    <section className="space-y-6 sm:space-y-8">
      <ScrollReveal direction="up" distance={16} duration={500}>
        <div className="flex flex-col items-center justify-center space-y-2 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Hàng Mới Về
          </h2>
        </div>
      </ScrollReveal>

      {loading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
          {Array.from({ length: DEFAULT_HOME_PRODUCT_LIMIT }).map((_, index) => (
            <div
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
    </section>
  );
}
