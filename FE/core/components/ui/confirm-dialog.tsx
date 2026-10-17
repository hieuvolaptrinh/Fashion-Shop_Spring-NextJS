"use client";

import React, { ReactNode } from "react";
import { AlertCircle, AlertTriangle, HelpCircle, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/core/components/ui/dialog";
import { Button } from "@/core/components/ui/button";

export type ConfirmVariant = "destructive" | "warning" | "default";

export interface ConfirmDialogProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  variant?: ConfirmVariant;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  icon?: ReactNode;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
}

const VARIANT_CONFIG: Record<
  ConfirmVariant,
  {
    iconBoxClass: string;
    defaultIcon: React.ReactElement;
    confirmButtonVariant?: "default" | "destructive" | "outline";
    confirmButtonClass?: string;
  }
> = {
  destructive: {
    iconBoxClass: "bg-destructive/10 text-destructive border border-destructive/20",
    defaultIcon: <AlertCircle className="h-6 w-6" />,
    confirmButtonVariant: "destructive",
  },
  warning: {
    iconBoxClass: "bg-warning/15 text-warning border border-warning/30",
    defaultIcon: <AlertTriangle className="h-6 w-6" />,
    confirmButtonClass:
      "bg-warning text-warning-foreground hover:bg-warning/90 shadow-xs",
  },
  default: {
    iconBoxClass: "bg-primary/10 text-primary border border-primary/20",
    defaultIcon: <HelpCircle className="h-6 w-6" />,
    confirmButtonVariant: "default",
  },
};

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  variant = "default",
  confirmText = "Xác nhận",
  cancelText = "Hủy bỏ",
  loading = false,
  icon,
  onConfirm,
  onCancel,
}) => {
  const config = VARIANT_CONFIG[variant] || VARIANT_CONFIG.default;

  const handleOpenChange = (isOpen: boolean) => {
    if (loading) return; // Không cho phép đóng khi đang loading xử lý
    if (onOpenChange) {
      onOpenChange(isOpen);
    }
    if (!isOpen) {
      onCancel();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl p-6 border-border/80">
        <DialogHeader className="gap-3 sm:text-left">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-2xl shrink-0 ${config.iconBoxClass}`}
          >
            {icon || config.defaultIcon}
          </div>

          <div className="space-y-1">
            <DialogTitle className="text-base font-bold text-foreground">
              {title}
            </DialogTitle>
            {description && (
              <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
                {description}
              </DialogDescription>
            )}
          </div>
        </DialogHeader>

        {children && <div className="py-2 text-xs text-foreground">{children}</div>}

        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2 pt-2 border-t border-border/60">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onCancel}
            disabled={loading}
            className="rounded-xl text-xs h-9 font-normal border-border hover:bg-muted"
          >
            {cancelText}
          </Button>

          <Button
            type="button"
            size="sm"
            variant={config.confirmButtonVariant || "default"}
            className={`rounded-xl text-xs h-9 font-medium gap-1.5 ${
              config.confirmButtonClass || ""
            }`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            <span>{confirmText}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDialog;
