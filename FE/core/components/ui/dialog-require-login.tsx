"use client";

import { LoginOutlined, ShoppingCartOutlined } from "@mui/icons-material";
import Link from "next/link";
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
}

export default function RequireLoginDialog({
  open,
  onClose,
}: RequireLoginDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[90vw] max-w-[400px] rounded-2xl border-rose-200 bg-white p-4 sm:p-6">
        <DialogHeader>
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-rose-100">
            <ShoppingCartOutlined
              sx={{ fontSize: 24, color: "#e11d48" }} // rose-600
            />
          </div>
          <DialogTitle className="text-center text-xl font-bold text-gray-900 sm:text-2xl">
            Đăng nhập để tiếp tục
          </DialogTitle>
          <DialogDescription className="text-center text-sm text-gray-600 sm:text-base">
            Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng và tiến hành thanh
            toán.
          </DialogDescription>
        </DialogHeader>
        <div className="py-3">
          <div className="rounded-lg bg-rose-50 p-3 text-xs text-rose-700 sm:p-4 sm:text-sm">
            <p>Đăng nhập giúp bạn:</p>
            <ul className="mt-2 ml-4 list-disc space-y-1">
              <li>Theo dõi đơn hàng của bạn</li>
              <li>Lưu sản phẩm yêu thích</li>
              <li>Nhận ưu đãi và khuyến mãi đặc biệt</li>
            </ul>
          </div>
        </div>
        <DialogFooter className="flex max-w-full flex-col gap-2 overflow-hidden sm:gap-3">
          <Button className="box-border w-full max-w-full truncate bg-gradient-to-r from-rose-600 to-red-600 px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:from-rose-700 hover:to-red-700 sm:px-6 sm:py-3 sm:text-base">
            <Link href="/login" className="flex items-center justify-center">
              <LoginOutlined sx={{ mr: 1, fontSize: { xs: 16, sm: 18 } }} />
              Đăng nhập ngay
            </Link>
          </Button>
        </DialogFooter>
        <DialogFooter className="flex max-w-full flex-col gap-2 overflow-hidden sm:gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="box-border w-full max-w-full truncate border-2 border-rose-200 px-4 py-2 text-sm font-medium text-rose-700 hover:bg-rose-50 hover:text-rose-800 sm:px-6 sm:py-3 sm:text-base"
          >
            Để sau
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
