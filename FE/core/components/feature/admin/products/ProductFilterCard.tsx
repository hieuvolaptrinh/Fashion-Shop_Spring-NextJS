"use client";

import React from "react";
import { Filter, Search, DollarSign, Tag } from "lucide-react";
import { Button } from "@/core/components/ui/button";
import { Input } from "@/core/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import type { ListTypes, ProductFiltersState } from "@/core/lib/type";

interface ProductFilterCardProps {
  filters: ProductFiltersState;
  productTypes: ListTypes[];
  isFilterApplied: boolean;
  onFilterChange: (field: keyof ProductFiltersState, value: any) => void;
  onToggleFilterType: (typeIdNum: number) => void;
  onApplyFilters: () => void;
  onResetFilters: () => void;
}

const ProductFilterCard: React.FC<ProductFilterCardProps> = ({
  filters,
  productTypes,
  isFilterApplied,
  onFilterChange,
  onToggleFilterType,
  onApplyFilters,
  onResetFilters,
}) => {
  return (
    <Card className="rounded-2xl border shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
          <Filter className="h-4 w-4 text-primary" />
          <span>Bộ Lọc Tìm Kiếm</span>
        </CardTitle>
        <CardDescription className="text-xs">
          Tìm kiếm theo tên sản phẩm, danh mục và khoảng giá bán
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Tên sản phẩm */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={filters.productName}
              onChange={(e) => onFilterChange("productName", e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onApplyFilters()}
              placeholder="Nhập tên sản phẩm..."
              className="pl-9 h-9 text-xs rounded-xl"
            />
          </div>

          {/* Giá tối thiểu */}
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              type="number"
              min={0}
              step={1000}
              value={filters.minSalePrice}
              onChange={(e) => onFilterChange("minSalePrice", e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onApplyFilters()}
              placeholder="Giá từ (VNĐ)"
              className="pl-8 h-9 text-xs rounded-xl"
            />
          </div>

          {/* Giá tối đa */}
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              type="number"
              min={0}
              step={1000}
              value={filters.maxSalePrice}
              onChange={(e) => onFilterChange("maxSalePrice", e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onApplyFilters()}
              placeholder="Đến giá (VNĐ)"
              className="pl-8 h-9 text-xs rounded-xl"
            />
          </div>
        </div>

        {/* Chọn loại sản phẩm */}
        {productTypes.length > 0 && (
          <div className="space-y-1.5 pt-1">
            <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
              <Tag className="h-3 w-3" />
              <span>Loại sản phẩm:</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              {productTypes.map((type, idx) => {
                const typeIdNum = parseInt(type.typeId);
                const isSelected = filters.typeId.includes(typeIdNum);
                return (
                  <button
                    key={`filter-type-${type.typeId}-${idx}`}
                    type="button"
                    onClick={() => onToggleFilterType(typeIdNum)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-primary text-primary-foreground border-primary shadow-xs"
                        : "bg-muted/40 text-muted-foreground border-border hover:bg-muted"
                    }`}
                  >
                    {type.typeName}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center gap-2 pt-1">
          <Button
            size="sm"
            onClick={onApplyFilters}
            className="h-8 rounded-xl text-xs px-3 font-medium"
          >
            Áp dụng lọc
          </Button>
          {isFilterApplied && (
            <Button
              variant="outline"
              size="sm"
              onClick={onResetFilters}
              className="h-8 rounded-xl text-xs px-3"
            >
              Đặt lại
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductFilterCard;
