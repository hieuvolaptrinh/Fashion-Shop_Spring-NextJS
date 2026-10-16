"use client";

import React, { useMemo } from "react";
import { Eye, Pencil, Trash2, Package, Layers } from "lucide-react";
import { Badge } from "@/core/components/ui/badge";
import { Button } from "@/core/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/core/components/ui/tooltip";
import { IMAGES } from "@/core/constants";
import AdminDataTable, {
  TableColumn,
  PaginationModel,
} from "@/core/components/feature/admin/common/AdminDataTable";
import { formatCurrency } from "@/core/lib/utils";
import type { Product } from "@/core/lib/type";

interface ProductsDataGridProps {
  products: Product[];
  loading: boolean;
  paginationModel: PaginationModel;
  totalRows: number;
  sortModel?: unknown;
  onPaginationModelChange: (newModel: PaginationModel) => void;
  onSortModelChange?: (newModel: unknown) => void;
  onView: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

const ProductsDataGrid = ({
  products,
  loading,
  paginationModel,
  totalRows,
  onPaginationModelChange,
  onView,
  onEdit,
  onDelete,
}: ProductsDataGridProps) => {
  const getQuantityBadge = (qty: number) => {
    if (qty > 50) {
      return (
        <Badge className="bg-success/15 text-success hover:bg-success/25 border-success/30 font-medium">
          Còn {qty}
        </Badge>
      );
    }
    if (qty > 10) {
      return (
        <Badge className="bg-warning/15 text-warning hover:bg-warning/25 border-warning/30 font-medium">
          Còn {qty}
        </Badge>
      );
    }
    return (
      <Badge className="bg-destructive/15 text-destructive hover:bg-destructive/25 border-destructive/30 font-bold">
        Sắp hết ({qty})
      </Badge>
    );
  };

  const columns: TableColumn<Product>[] = useMemo(
    () => [
      {
        key: "image",
        header: "Ảnh",
        headClassName: "w-[80px]",
        render: (item: Product) => {
          const imgUrl = item.listImages?.[0]?.link || IMAGES.FALLBACK_PRODUCT;
          return (
            <div className="relative h-12 w-12 rounded-xl overflow-hidden border border-border/60 bg-muted/30 shrink-0">
              <img
                src={imgUrl}
                alt={item.productName}
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = IMAGES.FALLBACK_PRODUCT;
                }}
              />
            </div>
          );
        },
      },
      {
        key: "productName",
        header: "Tên sản phẩm",
        headClassName: "min-w-[200px]",
        render: (item: Product) => (
          <div className="flex flex-col max-w-[280px]">
            <span className="font-semibold text-foreground text-sm line-clamp-2 leading-snug">
              {item.productName}
            </span>
            <span className="text-[11px] text-muted-foreground font-mono mt-0.5">
              ID: #{item.productId}
            </span>
          </div>
        ),
      },
      {
        key: "originalPrice",
        header: "Giá gốc",
        headClassName: "w-[120px]",
        render: (item: Product) => (
          <span className="text-xs text-muted-foreground line-through">
            {formatCurrency(item.originalPrice || 0)}
          </span>
        ),
      },
      {
        key: "salePrice",
        header: "Giá bán",
        headClassName: "w-[130px]",
        render: (item: Product) => (
          <span className="text-sm font-bold text-primary">
            {formatCurrency(item.salePrice || 0)}
          </span>
        ),
      },
      {
        key: "quantity",
        header: "Tồn kho",
        headClassName: "w-[110px]",
        render: (item: Product) => getQuantityBadge(item.quantity || 0),
      },
      {
        key: "categories",
        header: "Danh mục",
        headClassName: "min-w-[150px]",
        render: (item: Product) => (
          <div className="flex flex-wrap gap-1 max-w-[220px]">
            {item.listTypes && item.listTypes.length > 0 ? (
              <>
                {item.listTypes.slice(0, 2).map((type) => (
                  <Badge
                    key={type.typeId}
                    variant="secondary"
                    className="text-[10px] font-normal px-2 py-0.5"
                  >
                    {type.typeName}
                  </Badge>
                ))}
                {item.listTypes.length > 2 && (
                  <Badge
                    variant="outline"
                    className="text-[10px] px-1.5 py-0.5 text-muted-foreground"
                  >
                    +{item.listTypes.length - 2}
                  </Badge>
                )}
              </>
            ) : (
              <span className="text-xs text-muted-foreground">-</span>
            )}
          </div>
        ),
      },
      {
        key: "combo",
        header: "Combo",
        headClassName: "w-[90px] text-center",
        className: "text-center",
        render: (item: Product) =>
          item.listCombo && item.listCombo.length > 0 ? (
            <Badge
              variant="outline"
              className="border-primary/40 text-primary gap-1 text-[11px]"
            >
              <Layers className="h-3 w-3" />
              <span>{item.listCombo.length}</span>
            </Badge>
          ) : (
            <span className="text-xs text-muted-foreground">-</span>
          ),
      },
      {
        key: "actions",
        header: "Thao tác",
        headClassName: "w-[130px] text-right",
        className: "text-right",
        render: (item: Product) => (
          <TooltipProvider delayDuration={100}>
            <div className="flex items-center justify-end gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onView(item)}
                    className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
                  >
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">Xem chi tiết</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Xem chi tiết</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(item)}
                    className="h-8 w-8 rounded-lg text-primary hover:text-primary hover:bg-primary/10"
                  >
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Chỉnh sửa</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Chỉnh sửa</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(item)}
                    className="h-8 w-8 rounded-lg text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Xóa</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Xóa sản phẩm</TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        ),
      },
    ],
    [onView, onEdit, onDelete]
  );

  return (
    <AdminDataTable<Product>
      data={products}
      columns={columns}
      keyExtractor={(item) => item.productId}
      loading={loading}
      totalRows={totalRows}
      paginationModel={paginationModel}
      onPaginationModelChange={onPaginationModelChange}
      itemName="sản phẩm"
      emptyMessage="Không tìm thấy sản phẩm nào phù hợp."
      emptyIcon={<Package className="h-10 w-10 opacity-40 text-muted-foreground" />}
    />
  );
};

export default ProductsDataGrid;
