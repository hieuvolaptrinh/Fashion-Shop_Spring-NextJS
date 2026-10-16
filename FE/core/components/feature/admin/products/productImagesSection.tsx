"use client";

import React from "react";
import { ImagePlus, Trash2 } from "lucide-react";
import { Label } from "@/core/components/ui/label";
import type { ListImages } from "@/core/lib/type";

export interface ProductImagesSectionProps {
  images: ListImages[];
  isViewing?: boolean;
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (index: number) => void;
}

export function ProductImagesSection({
  images,
  isViewing = false,
  onUpload,
  onRemove,
}: ProductImagesSectionProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-semibold">
          Hình ảnh sản phẩm
        </Label>
        {!isViewing && (
          <label className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl border border-border bg-background hover:bg-muted/50 cursor-pointer transition-colors">
            <ImagePlus className="h-4 w-4 text-primary" />
            <span>Thêm ảnh từ máy</span>
            <input
              type="file"
              hidden
              multiple
              accept="image/*"
              onChange={onUpload}
            />
          </label>
        )}
      </div>

      {images.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-xl overflow-hidden border border-border/80 group bg-muted/20"
            >
              <img
                src={image.link}
                alt={`Ảnh sản phẩm ${index + 1}`}
                className="h-full w-full object-cover"
              />
              {!isViewing && (
                <button
                  type="button"
                  onClick={() => onRemove(index)}
                  className="absolute top-1.5 right-1.5 h-6 w-6 rounded-lg bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-destructive transition-all cursor-pointer"
                  title="Xóa ảnh"
                >
                  <Trash2 className="h-3 w-3" />
                  <span className="sr-only">Xóa ảnh</span>
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed py-8 text-center text-xs text-muted-foreground">
          Chưa có hình ảnh nào được tải lên cho sản phẩm này.
        </div>
      )}
    </div>
  );
}

export default ProductImagesSection;
