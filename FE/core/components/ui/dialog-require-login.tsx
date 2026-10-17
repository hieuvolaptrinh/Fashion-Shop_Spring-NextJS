"use client";

import React from "react";
import { LogIn, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/core/constants";
import { Button } from "./button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./dialog";

interface RequireLoginDialogProps {
  open: boolean;
  onClose: () => void;
  redirectUrl?: string;
  title?: string;
  description?: string;
}

export default function RequireLoginDialog({
  open,
  onClose,
  redirectUrl,
  title = "Đăng nhập để tiếp tục",
  description = "Bạn cần đăng nhập để tiến hành đặt hàng và thanh toán.",
}: RequireLoginDialogProps) {
  const loginHref = redirectUrl
    ? `${ROUTES.AUTH.LOGIN}?redirect=${encodeURIComponent(redirectUrl)}`
    : `${ROUTES.AUTH.LOGIN}?redirect=${encodeURIComponent(ROUTES.USER.CART)}`;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[90vw] max-w-[420px] rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-lg">
        <DialogHeader>
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <ShoppingCart className="h-7 w-7" />
          </div>
          <DialogTitle className="text-center text-xl font-bold text-foreground sm:text-2xl">
            {title}
          </DialogTitle>
          <DialogDescription className="text-center text-xs sm:text-sm text-muted-foreground mt-1">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="py-2">
          <div className="rounded-xl border border-border/60 bg-muted/40 p-3 text-xs sm:text-sm text-muted-foreground space-y-2">
            <p className="font-semibold text-foreground">Đăng nhập giúp bạn:</p>
            <ul className="ml-4 list-disc space-y-1">
              <li>Theo dõi và tra cứu đơn hàng nhanh chóng</li>
              <li>Tự động lưu địa chỉ và lịch sử giao hàng</li>
              <li>Nhận các ưu đãi, mã giảm giá độc quyền</li>
            </ul>
          </div>
        </div>

        <DialogFooter className="flex flex-col gap-2 pt-2 sm:gap-2">
          <Button
            asChild
            className="w-full h-11 rounded-xl text-sm font-semibold shadow-xs gap-2"
          >
            <Link href={loginHref} onClick={onClose}>
              <LogIn className="h-4 w-4" />
              <span>Đăng nhập ngay</span>
            </Link>
          </Button>

          <Button
            variant="outline"
            onClick={onClose}
            className="w-full h-10 rounded-xl text-sm font-medium border-border/80 hover:bg-muted"
          >
            Để sau
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
