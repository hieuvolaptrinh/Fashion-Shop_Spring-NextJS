"use client";

import React from "react";
import type { Product } from "@/core/lib/type";
import ConfirmDialog from "@/core/components/ui/confirm-dialog";

interface ConfirmDeleteProps {
  open: boolean;
  product: Product | null;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export const ConfirmDelete: React.FC<ConfirmDeleteProps> = ({
  open,
  product,
  onConfirm,
  onCancel,
  loading = false,
}) => {
  return (
    <ConfirmDialog
      open={open}
      variant="destructive"
      title="Xác nhận xóa sản phẩm"
      description="Hành động này không thể hoàn tác sau khi xác nhận."
      confirmText="Xác nhận xóa"
      cancelText="Hủy bỏ"
      loading={loading}
      onConfirm={onConfirm}
      onCancel={onCancel}
    >
      <div className="space-y-3">
        <div className="rounded-xl border border-border/60 bg-muted/30 p-3.5">
          <p className="text-xs text-muted-foreground mb-1">
            Bạn có chắc chắn muốn xóa sản phẩm:
          </p>
          <p className="font-semibold text-sm text-foreground">
            &ldquo;{product?.productName}&rdquo;
          </p>
        </div>

        <p className="text-xs font-medium text-destructive">
          Cảnh báo: Việc xóa sản phẩm này có thể ảnh hưởng đến các đơn hàng và danh mục liên quan trong hệ thống.
        </p>
      </div>
    </ConfirmDialog>
  );
};

export default ConfirmDelete;
