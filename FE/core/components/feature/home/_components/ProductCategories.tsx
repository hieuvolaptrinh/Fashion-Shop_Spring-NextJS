'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/core/components/ui/carousel';
import { ScrollReveal } from '@/core/components/ui/scroll-reveal';
import { ROUTES } from '@/core/constants';
import { useHomeCategories } from '@/core/hooks/useHomeCategories';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

function CategoryCardImage({
  src,
  alt,
  fallbackSrc,
}: {
  src: string;
  alt: string;
  fallbackSrc: string;
}) {
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  return (
    <Image
      src={imgSrc}
      fill
      className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
      alt={alt}
      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
      onError={() => {
        if (imgSrc !== fallbackSrc) {
          setImgSrc(fallbackSrc);
        }
      }}
    />
  );
}

export default function ProductCategories() {
  const { categories, loading, getCategoryImage, getCategoryFallbackImage } = useHomeCategories();

  // Khi đã tải xong mà không có danh mục nào trong hệ thống, tự động ẩn section để không vỡ layout
  if (!loading && categories.length === 0) {
    return null;
  }

  return (
    <section className="space-y-6 sm:space-y-8">
      {loading ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-7 w-48 animate-pulse rounded-lg bg-muted/60" />
              <div className="h-4 w-72 animate-pulse rounded-lg bg-muted/40" />
            </div>
            <div className="flex gap-2">
              <div className="h-9 w-9 animate-pulse rounded-full bg-muted/60" />
              <div className="h-9 w-9 animate-pulse rounded-full bg-muted/60" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="aspect-[3/4] w-full animate-pulse rounded-2xl bg-muted/60"
              />
            ))}
          </div>
        </div>
      ) : (
        <ScrollReveal direction="up" distance={20} duration={600}>
          <Carousel
            opts={{
              align: 'start',
              loop: false,
              dragFree: true,
            }}
            className="w-full select-none space-y-5"
          >
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  Danh Mục Sản Phẩm
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                  Khám phá các phong cách thời trang và phụ kiện xu hướng nhất
                </p>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto">
                <Link
                  href={ROUTES.USER.PRODUCTS}
                  className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                >
                  <span>Xem tất cả</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <div className="flex items-center gap-1.5">
                  <CarouselPrevious className="static translate-x-0 translate-y-0 h-9 w-9 rounded-xl border-border/80 bg-background/80 hover:bg-primary hover:text-primary-foreground transition-all shadow-xs" />
                  <CarouselNext className="static translate-x-0 translate-y-0 h-9 w-9 rounded-xl border-border/80 bg-background/80 hover:bg-primary hover:text-primary-foreground transition-all shadow-xs" />
                </div>
              </div>
            </div>

            <CarouselContent className="-ml-3 sm:-ml-4 md:-ml-5">
              {categories.map((item, index) => {
                const count = item.productCount ?? 0;
                return (
                  <CarouselItem
                    key={item.typeId}
                    className="basis-1/2 pl-3 sm:basis-1/3 sm:pl-4 md:basis-1/4 md:pl-5 lg:basis-1/5 xl:basis-1/6"
                  >
                    <Link
                      href={`${ROUTES.USER.PRODUCTS}?typeId=${item.typeId}`}
                      className="group block"
                    >
                      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-border/60 bg-muted/30 shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/50 hover:shadow-xl">
                        <CategoryCardImage
                          src={getCategoryImage(item, index)}
                          fallbackSrc={getCategoryFallbackImage(item, index)}
                          alt={item.typeName}
                        />

                        <div className="absolute top-2.5 left-2.5 z-10">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold bg-black/55 text-white backdrop-blur-md border border-white/15 shadow-xs">
                            {count > 0 ? `${count} sản phẩm` : 'Mới'}
                          </span>
                        </div>

                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent transition-opacity duration-300 group-hover:from-black/90 group-hover:via-black/40" />

                        <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 text-center z-10">
                          <p className="truncate text-sm font-bold text-white drop-shadow-md transition-colors duration-200 group-hover:text-primary sm:text-base">
                            {item.typeName}
                          </p>
                          <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-white/85 opacity-80 sm:opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0.5 sm:text-xs">
                            <span>Khám phá ngay</span>
                            <ArrowRight className="h-3 w-3" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
          </Carousel>
        </ScrollReveal>
      )}
    </section>
  );
}
