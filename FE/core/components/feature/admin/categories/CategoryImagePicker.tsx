"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import {
  Upload,
  Link as LinkIcon,
  X,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import { Button } from "@/core/components/ui/button";
import { Input } from "@/core/components/ui/input";
import { Label } from "@/core/components/ui/label";
import { uploadImage } from "@/core/apis/images";
import { IMAGES } from "@/core/constants";
import { toast } from "sonner";

const PRESET_TEMPLATES = [
  { label: "Nam", url: IMAGES.CATEGORIES.MEN },
  { label: "Nữ", url: IMAGES.CATEGORIES.WOMEN },
  { label: "Phụ kiện", url: IMAGES.CATEGORIES.ACCESSORIES },
  { label: "Sức khỏe", url: IMAGES.CATEGORIES.WELLNESS },
  { label: "Mỹ phẩm", url: IMAGES.CATEGORIES.COSMETICS },
  { label: "Gia dụng", url: IMAGES.CATEGORIES.HOMEWARE },
];

interface CategoryImagePickerProps {
  imageUrl: string;
  onImageUrlChange: (url: string) => void;
  disabled?: boolean;
  onUploadingChange?: (uploading: boolean) => void;
}

export function CategoryImagePicker({
  imageUrl,
  onImageUrlChange,
  disabled = false,
  onUploadingChange,
}: CategoryImagePickerProps) {
  const [isImageBroken, setIsImageBroken] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn tệp hình ảnh hợp lệ (PNG, JPG, WEBP...)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Kích thước ảnh tối đa là 5MB");
      return;
    }

    setIsUploading(true);
    onUploadingChange?.(true);
    try {
      const uploadedUrl = await uploadImage(file);
      if (uploadedUrl) {
        onImageUrlChange(uploadedUrl);
        setIsImageBroken(false);
        toast.success("Tải ảnh lên thành công!");
      }
    } catch (err: unknown) {
      console.error("Lỗi tải ảnh danh mục:", err);
      toast.error("Không thể tải ảnh lên. Vui lòng thử lại hoặc dán liên kết ảnh.");
    } finally {
      setIsUploading(false);
      onUploadingChange?.(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-semibold">Ảnh đại diện danh mục</Label>
        {imageUrl && (
          <button
            type="button"
            onClick={() => {
              onImageUrlChange("");
              setIsImageBroken(false);
            }}
            className="text-[11px] font-medium text-destructive hover:underline inline-flex items-center gap-1"
          >
            <X className="h-3 w-3" />
            <span>Xóa ảnh</span>
          </button>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-border/80 bg-muted/40 shadow-xs flex items-center justify-center">
          {imageUrl && !isImageBroken ? (
            <Image
              src={imageUrl}
              alt="Xem trước ảnh danh mục"
              fill
              unoptimized
              className="object-cover"
              sizes="80px"
              onError={() => setIsImageBroken(true)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-muted-foreground/60 p-2 text-center">
              <ImageIcon className="h-6 w-6 stroke-[1.5]" />
              <span className="text-[9px] mt-1">
                {isImageBroken ? "Ảnh lỗi link" : "Chưa có ảnh"}
              </span>
            </div>
          )}
          {isUploading && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-xs flex items-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            </div>
          )}
        </div>

        <div className="flex-1 space-y-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled || isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="w-full rounded-xl text-xs gap-1.5 h-8 font-medium"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Đang tải ảnh lên...</span>
              </>
            ) : (
              <>
                <Upload className="h-3.5 w-3.5" />
                <span>Chọn ảnh từ thiết bị</span>
              </>
            )}
          </Button>

          <div className="relative">
            <LinkIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Hoặc dán liên kết URL ảnh..."
              value={imageUrl}
              onChange={(e) => {
                onImageUrlChange(e.target.value);
                setIsImageBroken(false);
              }}
              disabled={disabled || isUploading}
              className="pl-8 text-xs h-8 rounded-xl bg-muted/20"
            />
          </div>
        </div>
      </div>

      <div className="pt-1">
        <span className="text-[11px] text-muted-foreground font-medium block mb-1.5">
          Gợi ý mẫu ảnh thời trang:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {PRESET_TEMPLATES.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => {
                onImageUrlChange(preset.url);
                setIsImageBroken(false);
              }}
              className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[11px] font-medium border transition-colors ${
                imageUrl === preset.url
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-muted/40 hover:bg-muted text-muted-foreground border-border/60"
              }`}
            >
              <span>{preset.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
