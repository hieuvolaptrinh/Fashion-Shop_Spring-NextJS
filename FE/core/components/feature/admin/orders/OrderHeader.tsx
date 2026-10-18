"use client";

import React from "react";
import {
  RotateCcw,
  Printer,
  Filter,
  FileSpreadsheet,
  ChevronDown,
  ChevronUp,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/core/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/core/components/ui/select";
import { ORDER_STATUS_OPTIONS } from "@/core/constants";

interface OrderHeaderProps {
  loading: boolean;
  isPrintingBatch: boolean;
  isBatchUpdatingStatus?: boolean;
  showFilters: boolean;
  selectedCount: number;
  onRefresh: () => void;
  onToggleFilters: () => void;
  onPrintSelected: () => void;
  onPrintAllUnprinted: () => void;
  onBatchUpdateStatus?: (status: string) => Promise<void>;
}

export const OrderHeader: React.FC<OrderHeaderProps> = ({
  loading,
  isPrintingBatch,
  isBatchUpdatingStatus = false,
  showFilters,
  selectedCount,
  onRefresh,
  onToggleFilters,
  onPrintSelected,
  onPrintAllUnprinted,
  onBatchUpdateStatus,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Quản Lý Đơn Hàng
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Theo dõi, xử lý giao vận và in phiếu hóa đơn hàng loạt cho các đơn hàng.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={onRefresh}
          disabled={loading}
          className="h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground"
          title="Tải lại dữ liệu"
        >
          <RotateCcw
            className={`h-4 w-4 ${loading ? "animate-spin text-primary" : ""}`}
          />
          <span className="sr-only">Tải lại</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onToggleFilters}
          className="rounded-xl gap-1.5 text-xs h-9"
        >
          <Filter className="h-3.5 w-3.5" />
          <span>Bộ lọc</span>
          {showFilters ? (
            <ChevronUp className="h-3.5 w-3.5" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5" />
          )}
        </Button>

        {selectedCount > 0 && onBatchUpdateStatus && (
          <Select
            onValueChange={(val) => onBatchUpdateStatus(val)}
            disabled={isBatchUpdatingStatus}
          >
            <SelectTrigger className="rounded-xl gap-1.5 text-xs h-9 border-primary/40 bg-primary/10 text-primary font-medium hover:bg-primary/20 transition-colors w-[175px]">
              {isBatchUpdatingStatus ? (
                <div className="flex items-center gap-1.5">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Đang cập nhật...</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Đổi trạng thái ({selectedCount})</span>
                </div>
              )}
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {ORDER_STATUS_OPTIONS.map((opt) => (
                <SelectItem
                  key={`batch-opt-${opt.value}`}
                  value={opt.value}
                  className="text-xs cursor-pointer"
                >
                  Chuyển sang: {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={onPrintSelected}
          disabled={selectedCount === 0 || isPrintingBatch}
          className="rounded-xl gap-1.5 text-xs h-9 border-primary/40 hover:bg-primary/10"
        >
          {isPrintingBatch ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Printer className="h-3.5 w-3.5" />
          )}
          <span>
            In đơn đã chọn {selectedCount > 0 && `(${selectedCount})`}
          </span>
        </Button>

        <Button
          size="sm"
          onClick={onPrintAllUnprinted}
          disabled={isPrintingBatch}
          className="rounded-xl gap-1.5 text-xs h-9 font-medium"
        >
          <FileSpreadsheet className="h-4 w-4" />
          <span>In tất cả đơn chưa in</span>
        </Button>
      </div>
    </div>
  );
};

export default OrderHeader;
