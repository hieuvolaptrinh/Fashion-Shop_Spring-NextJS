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
  } = useOrderManager();

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      {/* Page Header Toolbar */}
      <OrderHeader
        loading={loading}
        isPrintingBatch={isPrintingBatch}
        showFilters={showFilters}
        selectedCount={selectedOrders.length}
        onRefresh={() => fetchOrders()}
        onToggleFilters={() => setShowFilters(!showFilters)}
        onPrintSelected={handlePrintSelected}
        onPrintAllUnprinted={handlePrintAllUnprinted}
      />

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
        onUpdateStatus={handleUpdateStatus}
        isUpdating={isUpdatingStatus}
      />
    </div>
  );
};

export default OrderManager;
