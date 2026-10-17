"use client";

import React from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/core/components/ui/button";
import Pagination from "@/core/components/ui/pagination";
import { useUserOrders } from "@/core/hooks/useUserOrders";
import UserOrderFilterTabs from "./UserOrderFilterTabs";
import UserOrderCard from "./UserOrderCard";
import UserOrderDetailDialog from "./UserOrderDetailDialog";
import EmptyOrdersView from "./EmptyOrdersView";

export const Order: React.FC = () => {
  const {
    orders,
    filteredOrders,
    paginatedOrders,
    loading,
    activeTab,
    statusCounts,
    selectedOrder,
    isDetailOpen,
    currentPage,
    totalPages,
    paginationSummary,
    setActiveTab,
    handlePageChange,
    handleOpenDetail,
    handleCloseDetail,
    fetchOrders,
  } = useUserOrders();

  return (
    <div className="min-h-screen py-8 bg-background">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-border/60">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Đơn hàng của tôi
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Theo dõi tình trạng vận chuyển và lịch sử mua sắm của bạn.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={fetchOrders}
            disabled={loading}
            className="rounded-xl text-xs h-9 gap-1.5 border-border hover:bg-muted self-start sm:self-auto font-normal"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin text-primary" : ""}`} />
            <span>Làm mới</span>
          </Button>
        </div>

        {/* Status Filter Tabs */}
        <UserOrderFilterTabs
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          counts={statusCounts}
        />

        {/* Content Section */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Đang tải lịch sử đơn hàng...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <EmptyOrdersView isFiltered={orders.length > 0} />
        ) : (
          <div className="space-y-6">
            <div className="space-y-4">
              {paginatedOrders.map((order) => (
                <UserOrderCard
                  key={order.orderId}
                  order={order}
                  onOpenDetail={handleOpenDetail}
                />
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              totalItems={paginationSummary.total}
              itemsPerPage={5}
              itemName="đơn hàng"
              disabled={loading}
            />
          </div>
        )}

        {/* Order Detail Modal */}
        <UserOrderDetailDialog
          open={isDetailOpen}
          onClose={handleCloseDetail}
          order={selectedOrder}
        />
      </div>
    </div>
  );
};

export default Order;
