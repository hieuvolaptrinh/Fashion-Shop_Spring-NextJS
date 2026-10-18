"use client";

import React from "react";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/core/components/ui/dialog";
import { Button } from "@/core/components/ui/button";
import type { CategoryItem } from "@/core/lib/type";

interface ConfirmDeleteCategoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  category: CategoryItem | null;
  onConfirm: () => Promise<void>;
  isSubmitting: boolean;
}

export function ConfirmDeleteCategoryDialog({
  isOpen,
  onClose,
  category,
  onConfirm,
  isSubmitting,
}: ConfirmDeleteCategoryDialogProps) {
  if (!category) return null;

  const productCount = category.productCount ?? 0;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isSubmitting && onClose()}>
      <DialogContent className="sm:max-w-[420px] rounded-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-foreground">
                Xác Nhận Xóa Danh Mục
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                Hành động này sẽ xóa danh mục khỏi hệ thống.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-3 py-2 text-sm text-foreground">
          <p>
            Bạn có chắc chắn muốn xóa danh mục{" "}
            <strong className="text-destructive font-semibold">
              &quot;{category.typeName}&quot;
            </strong>{" "}
            (Mã: #{category.typeId})?
          </p>

          {productCount > 0 ? (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-800 dark:text-amber-300 space-y-1">
              <div className="font-semibold flex items-center gap-1.5">
                <span>⚠️ Lưu ý về sản phẩm liên kết:</span>
              </div>
              <p className="leading-relaxed opacity-95">
                Danh mục này hiện đang được gán cho{" "}
                <strong className="font-bold underline">{productCount} sản phẩm</strong>.
                Khi xóa, hệ thống sẽ <strong>tự động gỡ liên kết</strong> danh mục khỏi các
                sản phẩm này, <strong>không làm mất dữ liệu sản phẩm</strong> của bạn.
              </p>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">
              Danh mục này hiện không có sản phẩm nào liên kết.
            </p>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-xl"
          >
            Hủy bỏ
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="rounded-xl gap-1.5"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Đang xóa...</span>
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                <span>Xác nhận xóa</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
