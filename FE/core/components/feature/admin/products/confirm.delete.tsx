"use client";

import type { Product } from "@/core/lib/type";
import { AlertTriangle, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/core/components/ui/dialog";
import { Button } from "@/core/components/ui/button";

interface ConfirmDeleteProps {
  open: boolean;
  product: Product | null;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

const ConfirmDelete = ({
  open,
  product,
  onConfirm,
  onCancel,
  loading = false,
}: ConfirmDeleteProps) => {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader className="gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <DialogTitle className="text-lg font-bold text-foreground">
              Xác nhận xóa sản phẩm
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-1">
              Hành động này không thể hoàn tác sau khi xác nhận.
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <div className="rounded-xl border bg-slate-50 dark:bg-slate-900/50 p-3.5">
            <p className="text-xs text-muted-foreground mb-1">
              Bạn có chắc chắn muốn xóa sản phẩm:
            </p>
            <p className="font-semibold text-sm text-foreground">
              "{product?.productName}"
            </p>
          </div>

          <p className="text-xs font-medium text-destructive">
            Cảnh báo: Việc xóa sản phẩm này có thể ảnh hưởng đến lịch sử các đơn hàng liên quan trong hệ thống.
          </p>
        </div>

        <DialogFooter className="flex sm:justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
            className="rounded-xl"
          >
            Hủy bỏ
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={loading}
            className="rounded-xl gap-1.5"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Đang xóa...</span>
              </>
            ) : (
              <span>Xác nhận xóa</span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDelete;
