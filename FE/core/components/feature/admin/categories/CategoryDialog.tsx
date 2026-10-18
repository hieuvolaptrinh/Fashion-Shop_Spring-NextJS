"use client";

import React, { useState, useEffect } from "react";
import { FolderTree, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/core/components/ui/dialog";
import { Button } from "@/core/components/ui/button";
import { Input } from "@/core/components/ui/input";
import { Label } from "@/core/components/ui/label";
import { getCategoryFallbackImage } from "@/core/lib/categoryUtils";
import { CategoryImagePicker } from "./CategoryImagePicker";
import type { CategoryItem } from "@/core/lib/type";

interface CategoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  category: CategoryItem | null;
  onSave: (typeName: string, imageUrl?: string) => Promise<void>;
  isSubmitting: boolean;
}

export function CategoryDialog({
  isOpen,
  onClose,
  category,
  onSave,
  isSubmitting,
}: CategoryDialogProps) {
  const [typeName, setTypeName] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const isEditing = Boolean(category);

  useEffect(() => {
    if (isOpen) {
      setTypeName(category ? category.typeName : "");
      const initialImage =
        category?.imageUrl?.trim() ||
        (category?.typeName ? getCategoryFallbackImage(category.typeName) : "");
      setImageUrl(initialImage);
      setError("");
      setIsUploading(false);
    }
  }, [isOpen, category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = typeName.trim();
    if (!trimmedName) {
      setError("Vui lòng nhập tên danh mục");
      return;
    }
    if (trimmedName.length < 2) {
      setError("Tên danh mục phải có ít nhất 2 ký tự");
      return;
    }
    if (trimmedName.length > 256) {
      setError("Tên danh mục không được vượt quá 256 ký tự");
      return;
    }

    setError("");
    await onSave(trimmedName, imageUrl.trim() || undefined);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[480px] rounded-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <FolderTree className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-foreground">
                {isEditing ? "Chỉnh Sửa Danh Mục" : "Thêm Danh Mục Mới"}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                {isEditing
                  ? `Chỉnh sửa tên và ảnh đại diện danh mục #${category?.typeId}`
                  : "Tạo danh mục mới để phân loại và trưng bày sản phẩm trên website"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="category-name" className="text-xs font-semibold">
              Tên danh mục <span className="text-destructive">*</span>
            </Label>
            <Input
              id="category-name"
              placeholder="VD: Thời Trang Nam, Đồ Thể Thao..."
              value={typeName}
              onChange={(e) => {
                setTypeName(e.target.value);
                if (error) setError("");
              }}
              disabled={isSubmitting || isUploading}
              autoFocus
              className={`rounded-xl text-sm ${
                error ? "border-destructive focus-visible:ring-destructive/20" : ""
              }`}
            />
            {error && (
              <p className="text-[11px] font-medium text-destructive">{error}</p>
            )}
          </div>

          <CategoryImagePicker
            imageUrl={imageUrl}
            onImageUrlChange={setImageUrl}
            disabled={isSubmitting || isUploading}
            onUploadingChange={setIsUploading}
          />

          <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting || isUploading}
              className="rounded-xl"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || isUploading || !typeName.trim()}
              className="rounded-xl gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Đang lưu...</span>
                </>
              ) : (
                <span>{isEditing ? "Cập nhật" : "Tạo danh mục"}</span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
