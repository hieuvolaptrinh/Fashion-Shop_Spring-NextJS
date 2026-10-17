'use client'

import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/core/components/ui/carousel'
import { IMAGES, ROUTES } from '@/core/constants'
import { cn } from '@/core/lib/utils'
import Autoplay from 'embla-carousel-autoplay'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const BANNERS = [
  { id: 1, image: IMAGES.BANNERS.BANNER_2, alt: 'Banner khuyến mãi 1' },
  { id: 2, image: IMAGES.BANNERS.BANNER_1, alt: 'Banner khuyến mãi 2' },
]

export default function SlideShow() {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!api) return
    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap())

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap())
    }

    api.on('select', onSelect)
    return () => {
      api.off('select', onSelect)
    }
  }, [api])

  return (
    <div className="group relative overflow-hidden rounded-2xl shadow-sm transition-shadow hover:shadow-md md:rounded-3xl">
      <Carousel
        setApi={setApi}
        opts={{ loop: true }}
        plugins={[
          Autoplay({
            delay: 5000,
            stopOnInteraction: false,
          }),
        ]}
        className="w-full"
      >
        <CarouselContent className="-ml-0">
          {BANNERS.map((banner, index) => (
            <CarouselItem key={banner.id} className="pl-0">
              <Link
                href={ROUTES.USER.PRODUCTS}
                className="relative block w-full aspect-[3780/1222] overflow-hidden"
              >
                <Image
                  src={banner.image}
                  fill
                  priority={index === 0}
                  className="object-contain"
                  alt={banner.alt}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1200px"
                />
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Nút điều hướng kính mờ (Desktop) */}
        <div className="hidden md:block">
          <CarouselPrevious className="absolute top-1/2 left-4 h-10 w-10 -translate-y-1/2 border-white/20 bg-black/30 text-white opacity-0 backdrop-blur-md transition-all hover:bg-black/50 hover:text-white group-hover:opacity-100" />
          <CarouselNext className="absolute top-1/2 right-4 h-10 w-10 -translate-y-1/2 border-white/20 bg-black/30 text-white opacity-0 backdrop-blur-md transition-all hover:bg-black/50 hover:text-white group-hover:opacity-100" />
        </div>

        {/* Thanh chỉ số phân trang (Pagination Dots) */}
        <div className="absolute right-6 bottom-4 z-20 flex items-center gap-1.5 sm:right-10 sm:bottom-6 sm:gap-2">
          {Array.from({ length: count }).map((_, index) => (
            <button
              // biome-ignore lint/suspicious/noArrayIndexKey: Fixed slide snaps
              key={index}
              type="button"
              aria-label={`Chuyển đến slide ${index + 1}`}
              onClick={() => api?.scrollTo(index)}
              className={cn(
                'h-2 cursor-pointer rounded-full transition-all duration-300',
                current === index
                  ? 'w-6 bg-primary sm:w-8'
                  : 'w-2 bg-white/60 hover:bg-white/90',
              )}
            />
          ))}
        </div>
      </Carousel>
    </div>
  )
}
