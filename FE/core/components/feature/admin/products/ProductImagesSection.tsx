"use client";

import React, { useState } from "react";
import { ImagePlus, Trash2, Link as LinkIcon, Plus } from "lucide-react";
import { Label } from "@/core/components/ui/label";
import { Input } from "@/core/components/ui/input";
import { Button } from "@/core/components/ui/button";
import { IMAGES } from "@/core/constants";
import type { ListImages } from "@/core/lib/type";

export interface ProductImagesSectionProps {
  images: ListImages[];
  isViewing?: boolean;
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (index: number) => void;
  onAddUrl?: (url: string) => void;
}

export function ProductImagesSection({
  images,
  isViewing = false,
  onUpload,
  onRemove,
  onAddUrl,
}: ProductImagesSectionProps) {
  const [inputUrl, setInputUrl] = useState("");

  const handleAddUrl = () => {
    if (!inputUrl.trim()) return;
    onAddUrl?.(inputUrl.trim());
    setInputUrl("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddUrl();
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Label className="text-xs font-semibold">
            Hình ảnh sản phẩm
          </Label>
          <span className="text-[11px] text-muted-foreground font-normal">
            ({images.length} ảnh)
          </span>
        </div>
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

      {!isViewing && onAddUrl && (
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <LinkIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              type="url"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Dán liên kết ảnh ngoài (https://...) rồi nhấn Thêm hoặc Enter"
              className="pl-8 h-8 text-xs rounded-xl"
            />
          </div>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={handleAddUrl}
            disabled={!inputUrl.trim()}
            className="h-8 rounded-xl px-3 text-xs gap-1 font-medium shrink-0"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Thêm link</span>
          </Button>
        </div>
      )}

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
                onError={(e) => {
                  (e.target as HTMLImageElement).src = IMAGES.FALLBACK_PRODUCT;
                }}
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
          Chưa có hình ảnh nào cho sản phẩm này. Hãy chọn tải ảnh từ máy hoặc dán liên kết ảnh ngoài.
        </div>
      )}
    </div>
  );
}

export default ProductImagesSection;
