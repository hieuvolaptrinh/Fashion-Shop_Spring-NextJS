'use client';

import { IMAGES } from '@/core/constants';
import type { Product } from '@/core/lib/type';
import { cn } from '@/core/lib/utils';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface ProductGalleryProps {
  product: Product;
  selectedImage: number;
  onSelectImage: (index: number) => void;
}

export function ProductGallery({
  product,
  selectedImage,
  onSelectImage,
}: ProductGalleryProps) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const images = product.listImages || [];
  const currentImageSrc = images[selectedImage]?.link || IMAGES.FALLBACK_PRODUCT;
  const hasMultipleImages = images.length > 1;

  const handlePrev = () => {
    onSelectImage(selectedImage === 0 ? images.length - 1 : selectedImage - 1);
  };

  const handleNext = () => {
    onSelectImage(selectedImage === images.length - 1 ? 0 : selectedImage + 1);
  };

  // Lắng nghe phím ESC và phím mũi tên khi mở Lightbox
  useEffect(() => {
    if (!isLightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsLightboxOpen(false);
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isLightboxOpen, selectedImage, images.length]);

  return (
    <div className="space-y-3">
      <div className="flex flex-col-reverse gap-3.5 md:flex-row md:items-start">
        {hasMultipleImages && (
          <div className="flex gap-2.5 overflow-x-auto pb-1 md:flex-col md:overflow-y-auto md:pb-0 md:max-h-[500px] scrollbar-none shrink-0">
            {images.map((image, index) => {
              const isSelected = selectedImage === index;
              return (
                <button
                  type="button"
                  key={image.imageId || index}
                  onClick={() => onSelectImage(index)}
                  className={cn(
                    'relative aspect-square size-16 shrink-0 cursor-pointer overflow-hidden rounded-xl border-2 transition-all duration-200 md:size-18',
                    isSelected
                      ? 'border-primary ring-2 ring-primary/25 scale-[1.02]'
                      : 'border-border/60 hover:border-primary/50 opacity-80 hover:opacity-100'
                  )}
                  aria-label={`Xem ảnh ${index + 1}`}
                >
                  <Image
                    src={image.link || IMAGES.FALLBACK_PRODUCT}
                    alt={`${product.productName} thu nhỏ ${index + 1}`}
                    fill
                    sizes="(max-width: 768px) 64px, 72px"
                    className="object-cover"
                  />
                </button>
              );
            })}
          </div>
        )}

        <div className="group relative aspect-square w-full flex-1 overflow-hidden rounded-2xl border border-border/70 bg-muted/20 shadow-xs">
          <Image
            src={currentImageSrc}
            alt={product.productName}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            onClick={() => setIsLightboxOpen(true)}
            className="cursor-zoom-in object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />

          <button
            type="button"
            onClick={() => setIsLightboxOpen(true)}
            className="absolute top-3 right-3 rounded-full border border-border/40 bg-background/85 p-2 text-foreground opacity-90 shadow-xs backdrop-blur-xs transition-all hover:bg-background hover:scale-105"
            aria-label="Phóng to ảnh"
          >
            <Maximize2 className="size-4" />
          </button>

          {hasMultipleImages && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                className="absolute top-1/2 left-3 -translate-y-1/2 rounded-full border border-border/40 bg-background/85 p-2 text-foreground opacity-0 shadow-sm backdrop-blur-xs transition-all group-hover:opacity-100 hover:bg-background hover:scale-105"
                aria-label="Ảnh trước"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full border border-border/40 bg-background/85 p-2 text-foreground opacity-0 shadow-sm backdrop-blur-xs transition-all group-hover:opacity-100 hover:bg-background hover:scale-105"
                aria-label="Ảnh tiếp theo"
              >
                <ChevronRight className="size-4" />
              </button>

              <div className="absolute right-3 bottom-3 rounded-lg bg-background/85 px-2.5 py-1 text-xs font-semibold text-foreground shadow-xs backdrop-blur-xs">
                {selectedImage + 1} / {images.length}
              </div>
            </>
          )}
        </div>
      </div>

      {hasMultipleImages && (
        <div className="flex justify-center gap-1.5 md:hidden">
          {images.map((_, index) => (
            <button
              type="button"
              key={index}
              onClick={() => onSelectImage(index)}
              className={cn(
                'h-1.5 rounded-full transition-all duration-300',
                selectedImage === index
                  ? 'w-6 bg-primary'
                  : 'w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/60'
              )}
              aria-label={`Chuyển đến ảnh ${index + 1}`}
            />
          ))}
        </div>
      )}

      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-black/92 p-4 sm:p-6 backdrop-blur-sm animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-label="Xem ảnh phóng to"
        >
          <div className="flex w-full max-w-5xl items-center justify-between text-white">
            <span className="text-sm font-semibold opacity-80">
              {product.productName} ({selectedImage + 1} / {images.length})
            </span>
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="cursor-pointer rounded-full bg-white/10 p-2 text-white transition-all hover:bg-white/20 hover:scale-105"
              aria-label="Đóng xem ảnh"
            >
              <X className="size-5" />
            </button>
          </div>

          <div className="relative my-auto flex h-[70vh] w-full max-w-4xl items-center justify-center">
            <Image
              src={currentImageSrc}
              alt={product.productName}
              fill
              className="object-contain"
              sizes="90vw"
            />

            {hasMultipleImages && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-white/10 p-3 text-white backdrop-blur-xs transition-all hover:bg-white/25 hover:scale-105"
                  aria-label="Ảnh trước"
                >
                  <ChevronLeft className="size-6" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-white/10 p-3 text-white backdrop-blur-xs transition-all hover:bg-white/25 hover:scale-105"
                  aria-label="Ảnh tiếp theo"
                >
                  <ChevronRight className="size-6" />
                </button>
              </>
            )}
          </div>

          {hasMultipleImages && (
            <div className="flex max-w-2xl gap-2 overflow-x-auto pb-2 scrollbar-none">
              {images.map((image, index) => (
                <button
                  type="button"
                  key={image.imageId || index}
                  onClick={() => onSelectImage(index)}
                  className={cn(
                    'relative aspect-square size-14 shrink-0 cursor-pointer overflow-hidden rounded-lg border-2 transition-all',
                    selectedImage === index
                      ? 'border-primary ring-2 ring-primary/40 scale-105'
                      : 'border-white/20 opacity-60 hover:opacity-100'
                  )}
                  aria-label={`Xem ảnh lớn ${index + 1}`}
                >
                  <Image
                    src={image.link || IMAGES.FALLBACK_PRODUCT}
                    alt={`Ảnh nhỏ ${index + 1}`}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
