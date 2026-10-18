"use client";

import React from "react";
import { useOrderManager } from "@/core/hooks/useOrderManager";
import OrderHeader from "./OrderHeader";
import OrderFilterCard from "./OrderFilterCard";
import OrderDetails from "./OrderDetails";
import OrdersDataGrid from "./OrdersDataGrid";

export const OrderManager: React.FC = () => {
  const {
    orders,
    loading,
    isPrintingBatch,
    isUpdatingStatus,
    updatingOrderId,
    isBatchUpdatingStatus,
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
    handleUpdateStatus,
    handleBatchUpdateStatus,
  } = useOrderManager();

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      <OrderHeader
        loading={loading}
        isPrintingBatch={isPrintingBatch}
        isBatchUpdatingStatus={isBatchUpdatingStatus}
        showFilters={showFilters}
        selectedCount={selectedOrders.length}
        onRefresh={() => fetchOrders()}
        onToggleFilters={() => setShowFilters(!showFilters)}
        onPrintSelected={handlePrintSelected}
        onPrintAllUnprinted={handlePrintAllUnprinted}
        onBatchUpdateStatus={handleBatchUpdateStatus}
      />

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
        onUpdateStatus={handleUpdateStatus}
        updatingOrderId={updatingOrderId}
      />

      <OrderDetails
        open={orderDetailsOpen}
        onClose={handleOrderDetailsClose}
        order={selectedOrder}
        onUpdateStatus={handleUpdateStatus}
        isUpdating={isUpdatingStatus}
      />
    </div>
  );
};

export default OrderManager;
