"use client";

import { Button } from "@/core/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/core/components/ui/dropdown-menu";
import { Input } from "@/core/components/ui/input";
import type { CategoryItem } from "@/core/lib/type";
import {
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
  Check,
  ChevronDown,
  CircleDollarSign,
  RotateCcw,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

export interface PriceRangeOption {
  key: string;
  label: string;
  min?: number;
  max?: number;
}

export const PRICE_RANGES: PriceRangeOption[] = [
  { key: "ALL", label: "Tất cả mức giá" },
  { key: "UNDER_100", label: "Dưới 100.000 đ", max: 100000 },
  { key: "100_300", label: "100.000 đ - 300.000 đ", min: 100000, max: 300000 },
  { key: "300_500", label: "300.000 đ - 500.000 đ", min: 300000, max: 500000 },
  { key: "ABOVE_500", label: "Trên 500.000 đ", min: 500000 },
];

export const SORT_OPTIONS = [
  { key: "DEFAULT", label: "Mới nhất" },
  { key: "PRICE_ASC", label: "Giá: Thấp đến Cao" },
  { key: "PRICE_DESC", label: "Giá: Cao đến Thấp" },
];

interface ProductsFilterBarProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  categories: CategoryItem[];
  selectedTypeId: string | null;
  onSelectCategory: (typeId?: string | number) => void;
  selectedPriceRange: string;
  onSelectPriceRange: (rangeKey: string) => void;
  sortBy: string;
  onSelectSort: (sortKey: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export const ProductsFilterBar = ({
  searchTerm,
  onSearchChange,
  categories,
  selectedTypeId,
  onSelectCategory,
  selectedPriceRange,
  onSelectPriceRange,
  sortBy,
  onSelectSort,
  onClearFilters,
  hasActiveFilters,
}: ProductsFilterBarProps) => {
  const currentPriceLabel =
    PRICE_RANGES.find((r) => r.key === selectedPriceRange)?.label ||
    "Tất cả mức giá";
  const currentSortLabel =
    SORT_OPTIONS.find((s) => s.key === sortBy)?.label || "Mới nhất";

  return (
    <div className="mb-8 space-y-4 rounded-2xl border border-border/70 bg-card p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            type="search"
            placeholder="Tìm kiếm theo tên sản phẩm..."
            className="h-10 w-full rounded-xl border-border/80 bg-background pr-9 pl-10 text-sm focus-visible:ring-primary/20"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              title="Xóa tìm kiếm"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={`h-10 rounded-xl border-border/80 px-3 text-xs sm:text-sm font-medium gap-1.5 ${
                  selectedPriceRange !== "ALL"
                    ? "border-primary/50 bg-primary/10 text-primary font-semibold"
                    : "bg-background text-foreground hover:bg-muted"
                }`}
              >
                <CircleDollarSign className="size-3.5" />
                <span>{currentPriceLabel}</span>
                <ChevronDown className="size-3 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-xl">
              {PRICE_RANGES.map((range) => (
                <DropdownMenuItem
                  key={range.key}
                  onClick={() => onSelectPriceRange(range.key)}
                  className="flex items-center justify-between text-xs sm:text-sm cursor-pointer"
                >
                  <span>{range.label}</span>
                  {selectedPriceRange === range.key && (
                    <Check className="size-4 text-primary" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-10 rounded-xl border-border/80 bg-background px-3 text-xs sm:text-sm font-medium text-foreground hover:bg-muted gap-1.5"
              >
                {sortBy === "PRICE_ASC" ? (
                  <ArrowUpNarrowWide className="size-3.5" />
                ) : sortBy === "PRICE_DESC" ? (
                  <ArrowDownWideNarrow className="size-3.5" />
                ) : (
                  <SlidersHorizontal className="size-3.5" />
                )}
                <span>{currentSortLabel}</span>
                <ChevronDown className="size-3 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-xl">
              {SORT_OPTIONS.map((opt) => (
                <DropdownMenuItem
                  key={opt.key}
                  onClick={() => onSelectSort(opt.key)}
                  className="flex items-center justify-between text-xs sm:text-sm cursor-pointer"
                >
                  <span>{opt.label}</span>
                  {sortBy === opt.key && <Check className="size-4 text-primary" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {hasActiveFilters && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="h-10 rounded-xl px-2.5 text-xs text-muted-foreground hover:text-foreground gap-1"
              title="Đặt lại tất cả bộ lọc"
            >
              <RotateCcw className="size-3.5" />
              <span className="hidden sm:inline">Đặt lại</span>
            </Button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => onSelectCategory()}
          className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
            !selectedTypeId
              ? "bg-primary text-primary-foreground shadow-xs shadow-primary/25"
              : "border border-border/80 bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
          }`}
        >
          Tất cả sản phẩm
        </button>

        {categories.map((category) => {
          const isSelected = selectedTypeId === category.typeId.toString();
          return (
            <button
              key={category.typeId}
              type="button"
              onClick={() => onSelectCategory(category.typeId)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                isSelected
                  ? "bg-primary text-primary-foreground shadow-xs shadow-primary/25"
                  : "border border-border/80 bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              {category.typeName}
            </button>
          );
        })}
      </div>
    </div>
  );
};
