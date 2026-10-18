"use client";

import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { Button } from "@/core/components/ui/button";
import Pagination from "@/core/components/ui/pagination";
import CartItemCard from "./CartItemCard";
import type { CartItem } from "@/core/lib/type";
import { CART_ITEMS_PER_PAGE } from "@/core/constants";

interface CartItemListProps {
  cartItems: CartItem[];
  selected: number[];
  isAllSelected: boolean;
  onToggleSelect: (id: number) => void;
  onCheckAll: () => void;
  onUpdateQuantity: (id: number, newQuantity: number) => void;
  onRemove: (id: number) => void;
}

export const CartItemList: React.FC<CartItemListProps> = ({
  cartItems,
  selected,
  isAllSelected,
  onToggleSelect,
  onCheckAll,
  onUpdateQuantity,
  onRemove,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages = Math.ceil(cartItems.length / CART_ITEMS_PER_PAGE);
  // Tính trang an toàn trực tiếp (derived value) - tránh re-render kép bằng useEffect
  const safeCurrentPage = Math.min(currentPage, Math.max(1, totalPages));

  const paginatedItems = useMemo(() => {
    const start = (safeCurrentPage - 1) * CART_ITEMS_PER_PAGE;
    return cartItems.slice(start, start + CART_ITEMS_PER_PAGE);
  }, [cartItems, safeCurrentPage]);

  return (
    <Card className="border border-border/60 bg-card shadow-xs">
      <CardHeader className="border-b border-border/60 px-5 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
            <span>Sản phẩm trong giỏ hàng ({cartItems.length})</span>
          </CardTitle>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onCheckAll}
            className="rounded-lg text-xs h-8 border-border hover:bg-muted/50 font-normal"
          >
            {isAllSelected ? "Bỏ chọn tất cả" : `Chọn tất cả (${cartItems.length})`}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 p-4 sm:p-5">
        {paginatedItems.map((item) => (
          <CartItemCard
            key={item.cartDetailId}
            item={item}
            isSelected={selected.includes(item.cartDetailId)}
            onToggleSelect={onToggleSelect}
            onUpdateQuantity={onUpdateQuantity}
            onRemove={onRemove}
          />
        ))}

        <Pagination
          currentPage={safeCurrentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={cartItems.length}
          itemsPerPage={CART_ITEMS_PER_PAGE}
          itemName="sản phẩm"
        />
      </CardContent>
    </Card>
  );
};

export default CartItemList;
