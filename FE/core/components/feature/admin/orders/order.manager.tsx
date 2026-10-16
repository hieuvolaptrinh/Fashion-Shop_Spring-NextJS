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
} from "lucide-react";
import { Button } from "@/core/components/ui/button";
import { useOrderManager } from "@/core/hooks/useOrderManager";
import OrderFilterCard from "./OrderFilterCard";
import OrderDetails from "./orderDetails";
import OrdersDataGrid from "./ordersDataGrid";

export const OrderManager = () => {
  const {
    orders,
    loading,
    isPrintingBatch,
    selectedOrders,
    paginationModel,
    totalRows,
    showFilters,
    setShowFilters,
    filters,
    orderDetailsOpen,
    selectedOrder,
    statusOptions,
    fetchOrders,
    handleOrderSelection,
    handleSelectAll,
    handlePaginationModelChange,
    handleStatusToggle,
    handleBillFilterToggle,
    handlePriceFilterChange,
    handleClearFilters,
    handleApplyFilters,
    handlePrintSelected,
    handlePrintAllUnprinted,
    handleOrderDetailsOpen,
    handleOrderDetailsClose,
  } = useOrderManager();

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      {/* Page Header */}
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
          {/* Tải lại */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => fetchOrders()}
            disabled={loading}
            className="h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground"
            title="Tải lại dữ liệu"
          >
            <RotateCcw
              className={`h-4 w-4 ${loading ? "animate-spin text-primary" : ""}`}
            />
            <span className="sr-only">Tải lại</span>
          </Button>

          {/* Toggle Bộ lọc */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
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

          {/* In đơn đã chọn */}
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrintSelected}
            disabled={selectedOrders.length === 0 || isPrintingBatch}
            className="rounded-xl gap-1.5 text-xs h-9 border-primary/40 text-primary hover:bg-primary/10"
          >
            {isPrintingBatch ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Printer className="h-3.5 w-3.5" />
            )}
            <span>
              In đơn đã chọn {selectedOrders.length > 0 && `(${selectedOrders.length})`}
            </span>
          </Button>

          {/* In tất cả đơn chưa in */}
          <Button
            size="sm"
            onClick={handlePrintAllUnprinted}
            disabled={isPrintingBatch}
            className="rounded-xl gap-1.5 text-xs h-9 font-medium"
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span>In tất cả đơn chưa in</span>
          </Button>
        </div>
      </div>

      {/* Filter Section (Collapsible) */}
      {showFilters && (
        <OrderFilterCard
          filters={filters}
          statusOptions={statusOptions}
          onClose={() => setShowFilters(false)}
          onStatusToggle={handleStatusToggle}
          onBillFilterToggle={handleBillFilterToggle}
          onPriceFilterChange={handlePriceFilterChange}
          onApply={handleApplyFilters}
          onReset={handleClearFilters}
        />
      )}

      {/* Orders Table */}
      <OrdersDataGrid
        orders={orders}
        loading={loading}
        selectedOrders={selectedOrders}
        paginationModel={paginationModel}
        totalRows={totalRows}
        onPaginationModelChange={handlePaginationModelChange}
        onOrderSelection={handleOrderSelection}
        onSelectAll={handleSelectAll}
        onOrderDetailsOpen={handleOrderDetailsOpen}
      />

      {/* Order Details Modal */}
      <OrderDetails
        open={orderDetailsOpen}
        onClose={handleOrderDetailsClose}
        order={selectedOrder}
      />
    </div>
  );
};

export default OrderManager;
