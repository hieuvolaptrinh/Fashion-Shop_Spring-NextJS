"use client";

import React from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/core/components/ui/button";
import { ROUTES } from "@/core/constants";

export const EmptyCartView: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <ShoppingBag className="h-10 w-10" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Giỏ hàng của bạn đang trống
          </h2>
          <p className="text-sm text-muted-foreground">
            Bạn chưa chọn sản phẩm nào. Hãy khám phá bộ sưu tập thời trang mới nhất để tìm món đồ ưng ý nhé!
          </p>
        </div>

        <div>
          <Button asChild size="lg" className="rounded-xl px-8 shadow-sm font-medium">
            <Link href={ROUTES.USER.PRODUCTS}>
              Khám phá sản phẩm ngay
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmptyCartView;
