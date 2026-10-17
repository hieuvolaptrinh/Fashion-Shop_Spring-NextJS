'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/core/components/ui/carousel';
import { ScrollReveal } from '@/core/components/ui/scroll-reveal';
import { ROUTES } from '@/core/constants';
import { useHomeCategories } from '@/core/hooks/useHomeCategories';
import Image from 'next/image';
import Link from 'next/link';

export default function ProductCategories() {
  const { categories, loading, getCategoryImage } = useHomeCategories();

  return (
    <section className="space-y-6 sm:space-y-8">
      {/* Tiêu đề phần danh mục kèm ScrollReveal */}
      <ScrollReveal direction="up" distance={16} duration={500}>
        <div className="flex flex-col items-center justify-center space-y-2 text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Khám phá theo phong cách
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Danh Mục Sản Phẩm
          </h2>
          <div className="h-1 w-12 rounded-full bg-primary/80" />
        </div>
      </ScrollReveal>

      {loading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="aspect-[3/4] w-full animate-pulse rounded-2xl bg-muted/60"
            />
          ))}
        </div>
      ) : (
        <ScrollReveal direction="up" distance={24} duration={600} delay={100}>
          <Carousel
            opts={{
              align: 'start',
              loop: false,
              dragFree: true,
            }}
            className="w-full select-none"
          >
            <CarouselContent className="-ml-3 sm:-ml-4 md:-ml-6">
              {categories.map((item, index) => (
                <CarouselItem
                  key={item.typeId}
                  className="basis-1/2 pl-3 sm:basis-1/3 sm:pl-4 md:basis-1/4 md:pl-6 lg:basis-1/5 xl:basis-1/6"
                >
                  <Link
                    href={`${ROUTES.USER.PRODUCTS}?typeId=${item.typeId}`}
                    className="group block"
                  >
                    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-border/60 bg-muted/30 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg">
                      <Image
                        src={getCategoryImage(index)}
                        fill
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-108"
                        alt={item.typeName}
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      />
                      {/* Lớp phủ mờ chân thẻ */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent transition-opacity duration-300 group-hover:from-black/90 group-hover:via-black/40" />

                      {/* Tên danh mục & Nhãn phụ */}
                      <div className="absolute inset-x-0 bottom-0 p-3.5 text-center sm:p-4">
                        <p className="truncate text-sm font-semibold text-primary-foreground drop-shadow-xs transition-colors duration-200 group-hover:text-primary sm:text-base">
                          {item.typeName}
                        </p>
                        <span className="mt-1 inline-block text-[11px] font-medium text-primary-foreground/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:text-xs">
                          Xem sản phẩm →
                        </span>
                      </div>
                    </div>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </ScrollReveal>
      )}
    </section>
  );
}
