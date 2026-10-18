"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { Pencil, Trash2, FolderTree } from "lucide-react";
import { Badge } from "@/core/components/ui/badge";
import { Button } from "@/core/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/core/components/ui/tooltip";
import AdminDataTable, {
  TableColumn,
  PaginationModel,
} from "@/core/components/feature/admin/common/AdminDataTable";
import type { CategoryItem } from "@/core/lib/type";
import { getCategoryImage } from "@/core/lib/categoryUtils";

function CategoryThumbnail({
  imageUrl,
  typeName,
  isCustom,
}: {
  imageUrl: string;
  typeName: string;
  isCustom?: boolean;
}) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-muted/40 text-muted-foreground"
        title="Ảnh không thể tải"
      >
        <FolderTree className="h-4 w-4" />
      </div>
    );
  }

  return (
    <div
      className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-border/80 bg-muted/30 shadow-xs group/thumb"
      title={isCustom ? "Ảnh tùy chỉnh" : "Ảnh mẫu khởi tạo hệ thống"}
    >
      <Image
        src={imageUrl}
        alt={typeName}
        fill
        unoptimized
        className="object-cover transition-transform duration-300 group-hover/thumb:scale-110"
        sizes="40px"
        onError={() => setHasError(true)}
      />
      {!isCustom && (
        <span className="absolute bottom-0 inset-x-0 bg-black/65 text-[8px] text-white/90 text-center py-0.5 leading-none backdrop-blur-[1px] font-medium tracking-tight">
          Mẫu
        </span>
      )}
    </div>
  );
}

interface CategoriesDataGridProps {
  categories: CategoryItem[];
  loading: boolean;
  paginationModel: PaginationModel;
  totalRows: number;
  onPaginationModelChange: (newModel: PaginationModel) => void;
  onEdit: (category: CategoryItem) => void;
  onDelete: (category: CategoryItem) => void;
}

export function CategoriesDataGrid({
  categories,
  loading,
  paginationModel,
  totalRows,
  onPaginationModelChange,
  onEdit,
  onDelete,
}: CategoriesDataGridProps) {
  const columns: TableColumn<CategoryItem>[] = useMemo(
    () => [
      {
        key: "typeId",
        header: "Mã",
        headClassName: "w-[70px]",
        render: (item: CategoryItem) => (
          <span className="font-mono text-xs font-bold text-primary">
            #{item.typeId}
          </span>
        ),
      },
      {
        key: "thumbnail",
        header: "Ảnh",
        headClassName: "w-[80px]",
        render: (item: CategoryItem, index: number) => {
          const finalImage = getCategoryImage(item, index);
          const isCustom = Boolean(item.imageUrl && item.imageUrl.trim().length > 0);

          return (
            <CategoryThumbnail
              imageUrl={finalImage}
              typeName={item.typeName}
              isCustom={isCustom}
            />
          );
        },
      },
      {
        key: "typeName",
        header: "Tên danh mục",
        headClassName: "min-w-[220px]",
        render: (item: CategoryItem) => (
          <div className="flex items-center gap-2.5">
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-foreground">
                {item.typeName}
              </span>
              <span className="text-[11px] text-muted-foreground">
                Phân loại sản phẩm
              </span>
            </div>
          </div>
        ),
      },
      {
        key: "productCount",
        header: "Sản phẩm liên kết",
        headClassName: "w-[180px]",
        render: (item: CategoryItem) => {
          const count = item.productCount ?? 0;
          if (count > 0) {
            return (
              <Badge
                variant="secondary"
                className="gap-1.5 px-2.5 py-0.5 font-medium rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20"
              >
                <span>{count} sản phẩm</span>
              </Badge>
            );
          }
          return (
            <Badge
              variant="outline"
              className="px-2.5 py-0.5 text-xs text-muted-foreground rounded-lg border-dashed"
            >
              Chưa có SP
            </Badge>
          );
        },
      },
      {
        key: "actions",
        header: "Thao tác",
        headClassName: "w-[120px] text-right",
        className: "text-right",
        render: (item: CategoryItem) => (
          <TooltipProvider delayDuration={150}>
            <div className="flex items-center justify-end gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(item);
                    }}
                    className="h-8 w-8 rounded-lg text-primary hover:text-primary hover:bg-primary/10"
                  >
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Chỉnh sửa</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Chỉnh sửa tên danh mục</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(item);
                    }}
                    className="h-8 w-8 rounded-lg text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Xóa</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Xóa danh mục</TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        ),
      },
    ],
    [onEdit, onDelete]
  );

  return (
    <AdminDataTable
      data={categories}
      columns={columns}
      keyExtractor={(item) => item.typeId}
      loading={loading}
      totalRows={totalRows}
      paginationModel={paginationModel}
      onPaginationModelChange={onPaginationModelChange}
      emptyMessage="Không tìm thấy danh mục nào phù hợp với tìm kiếm."
      emptyIcon={<FolderTree className="h-10 w-10 text-muted-foreground/40" />}
      itemName="danh mục"
      pageSizeOptions={[5, 10, 20]}
    />
  );
}
