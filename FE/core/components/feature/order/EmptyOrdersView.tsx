"use client";

import React from "react";
import Link from "next/link";
import { PackageOpen, LogIn } from "lucide-react";
import { Button } from "@/core/components/ui/button";
import { ROUTES } from "@/core/constants";

interface EmptyOrdersViewProps {
  isFiltered?: boolean;
  isUnauthenticated?: boolean;
}

export const EmptyOrdersView: React.FC<EmptyOrdersViewProps> = ({
  isFiltered = false,
  isUnauthenticated = false,
}) => {
  if (isUnauthenticated) {
    return (
      <div className="rounded-2xl border border-dashed border-border/80 bg-muted/10 p-12 text-center space-y-4">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <LogIn className="h-7 w-7" />
        </div>

        <div className="space-y-1 max-w-sm mx-auto">
          <h3 className="text-base font-semibold text-foreground">
            Đăng nhập để xem đơn hàng
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Vui lòng đăng nhập vào tài khoản của bạn để tra cứu lịch sử mua sắm và theo dõi tình trạng giao hàng chi tiết.
          </p>
        </div>

        <Button asChild size="sm" className="rounded-xl px-6 font-medium shadow-xs">
          <Link href={`${ROUTES.AUTH.LOGIN}?redirect=/orders`}>
            Đăng nhập ngay
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-dashed border-border/80 bg-muted/10 p-12 text-center space-y-4">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
        <PackageOpen className="h-7 w-7" />
      </div>

      <div className="space-y-1 max-w-sm mx-auto">
        <h3 className="text-base font-semibold text-foreground">
          {isFiltered ? "Không tìm thấy đơn hàng" : "Bạn chưa có đơn hàng nào"}
        </h3>
        <p className="text-xs text-muted-foreground">
          {isFiltered
            ? "Không có đơn hàng nào phù hợp với bộ lọc hiện tại. Hãy thử chọn trạng thái khác."
            : "Bạn chưa đặt mua sản phẩm nào. Hãy khám phá các ưu đãi thời trang hot nhất hôm nay nhé!"}
        </p>
      </div>

      {!isFiltered && (
        <Button asChild size="sm" className="rounded-xl px-6 font-medium shadow-xs">
          <Link href={ROUTES.USER.PRODUCTS}>
            Khám phá sản phẩm
          </Link>
        </Button>
      )}
    </div>
  );
};

export default EmptyOrdersView;
