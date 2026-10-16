"use client";

import React from "react";
import { ChevronLeft, ChevronRight, Inbox } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/core/components/ui/table";
import { Button } from "@/core/components/ui/button";
import { Skeleton } from "@/core/components/ui/skeleton";

export interface PaginationModel {
  page: number; // 0-indexed
  pageSize: number;
}

export interface TableColumn<T> {
  key: string;
  header: React.ReactNode;
  headClassName?: string;
  className?: string;
  render?: (row: T, index: number) => React.ReactNode;
}

export interface AdminDataTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  keyExtractor: (item: T, index: number) => string | number;
  loading?: boolean;
  loadingRowCount?: number;
  totalRows: number;
  paginationModel: PaginationModel;
  onPaginationModelChange: (model: PaginationModel) => void;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
  itemName?: string;
  pageSizeOptions?: number[];
  onRowClick?: (item: T) => void;
  className?: string;
}

export function AdminDataTable<T>({
  data,
  columns,
  keyExtractor,
  loading = false,
  loadingRowCount = 5,
  totalRows,
  paginationModel,
  onPaginationModelChange,
  emptyMessage = "Không tìm thấy dữ liệu phù hợp.",
  emptyIcon,
  itemName = "bản ghi",
  pageSizeOptions = [10, 20, 50],
  onRowClick,
  className = "",
}: AdminDataTableProps<T>) {
  const totalPages = Math.max(1, Math.ceil(totalRows / paginationModel.pageSize));
  const currentPage = paginationModel.page;

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      onPaginationModelChange({ ...paginationModel, page: newPage });
    }
  };

  const handlePageSizeChange = (newSize: number) => {
    onPaginationModelChange({ page: 0, pageSize: newSize });
  };

  // Generate visible page numbers
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 0; i < totalPages; i++) pages.push(i);
    } else {
      pages.push(0);
      if (currentPage > 2) pages.push("...");
      const start = Math.max(1, currentPage - 1);
      const end = Math.min(totalPages - 2, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 3) pages.push("...");
      pages.push(totalPages - 1);
    }
    return pages;
  };

  const startRecord =
    totalRows === 0 ? 0 : currentPage * paginationModel.pageSize + 1;
  const endRecord = Math.min(
    (currentPage + 1) * paginationModel.pageSize,
    totalRows
  );

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Table Container */}
      <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              {columns.map((col) => (
                <TableHead key={col.key} className={col.headClassName}>
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              // Loading Skeleton Rows
              Array.from({ length: loadingRowCount }).map((_, index) => (
                <TableRow key={`skeleton-row-${index}`}>
                  {columns.map((col, colIdx) => (
                    <TableCell key={`skeleton-col-${colIdx}`} className={col.className}>
                      <Skeleton className="h-5 w-full rounded-md" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : data.length === 0 ? (
              // Empty State
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-44 text-center text-muted-foreground"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    {emptyIcon || <Inbox className="h-10 w-10 text-muted-foreground/40 stroke-1" />}
                    <p className="text-sm font-medium">{emptyMessage}</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              // Data Rows
              data.map((item, index) => (
                <TableRow
                  key={keyExtractor(item, index)}
                  onClick={() => onRowClick?.(item)}
                  className={`transition-colors hover:bg-muted/40 ${
                    onRowClick ? "cursor-pointer" : ""
                  }`}
                >
                  {columns.map((col) => (
                    <TableCell key={col.key} className={col.className}>
                      {col.render
                        ? col.render(item, index)
                        : (item as any)[col.key] ?? "-"}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-1 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span>
            Hiển thị{" "}
            <span className="font-medium text-foreground">{startRecord}</span> -{" "}
            <span className="font-medium text-foreground">{endRecord}</span> trên tổng
            số <span className="font-medium text-foreground">{totalRows}</span>{" "}
            {itemName}
          </span>

          <div className="flex items-center gap-1.5 ml-4">
            <span className="text-xs">Kích thước:</span>
            <select
              value={paginationModel.pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              aria-label="Kích thước trang"
              className="h-8 rounded-lg border border-input bg-background px-2 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0 || loading}
            className="h-8 w-8 p-0 rounded-lg"
            title="Trang trước"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Trang trước</span>
          </Button>

          {getPageNumbers().map((pageNum, idx) => {
            if (pageNum === "...") {
              return (
                <span key={`ellipsis-${idx}`} className="px-2 text-xs text-muted-foreground">
                  ...
                </span>
              );
            }

            const pNum = pageNum as number;
            const isActive = pNum === currentPage;

            return (
              <Button
                key={`page-${pNum}`}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(pNum)}
                disabled={loading}
                className={`h-8 w-8 p-0 rounded-lg text-xs ${
                  isActive ? "pointer-events-none font-semibold shadow-sm" : ""
                }`}
              >
                {pNum + 1}
              </Button>
            );
          })}

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages - 1 || loading}
            className="h-8 w-8 p-0 rounded-lg"
            title="Trang tiếp"
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Trang tiếp</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AdminDataTable;
