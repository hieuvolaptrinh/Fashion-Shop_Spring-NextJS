"use client";

import React, { useMemo } from "react";
import {
  Eye,
  ShoppingBag,
  FileCheck,
  FileClock,
} from "lucide-react";
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
import { formatCurrency, formatDate } from "@/core/lib/utils";
import { OrderStatusBadge } from "@/core/components/feature/admin/common/OrderStatusBadge";
import type { Order } from "@/core/lib/type";

interface OrdersDataGridProps {
  orders: Order[];
  loading: boolean;
  selectedOrders: number[];
  paginationModel: PaginationModel;
  totalRows: number;
  sortModel?: any;
  onPaginationModelChange: (newModel: PaginationModel) => void;
  onSortModelChange?: (newModel: any) => void;
  onOrderSelection: (orderId: number, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  onOrderDetailsOpen: (order: Order) => void;
}

const OrdersDataGrid = ({
  orders,
  loading,
  selectedOrders,
  paginationModel,
  totalRows,
  onPaginationModelChange,
  onOrderSelection,
  onSelectAll,
  onOrderDetailsOpen,
}: OrdersDataGridProps) => {
  const isAllSelected =
    orders.length > 0 && selectedOrders.length === orders.length;



  const columns: TableColumn<Order>[] = useMemo(
    () => [
      {
        key: "select",
        header: (
          <input
            type="checkbox"
            checked={isAllSelected}
            onChange={(e) => onSelectAll(e.target.checked)}
            disabled={orders.length === 0}
            className="h-4 w-4 rounded-sm border-gray-300 text-primary focus:ring-primary cursor-pointer accent-primary"
            aria-label="Chọn tất cả đơn hàng"
          />
        ),
        headClassName: "w-[48px] text-center",
        className: "text-center",
        render: (order: Order) => (
          <input
            type="checkbox"
            checked={selectedOrders.includes(order.orderId)}
            onChange={(e) => onOrderSelection(order.orderId, e.target.checked)}
            className="h-4 w-4 rounded-sm border-gray-300 text-primary focus:ring-primary cursor-pointer accent-primary"
            aria-label={`Chọn đơn hàng #${order.orderId}`}
          />
        ),
      },
      {
        key: "orderId",
        header: "Mã đơn",
        headClassName: "w-[100px]",
        render: (order: Order) => (
          <span className="font-bold text-primary font-mono text-xs">
            #{order.orderId}
          </span>
        ),
      },
      {
        key: "createAt",
        header: "Ngày tạo",
        headClassName: "w-[110px]",
        render: (order: Order) => (
          <span className="text-xs text-muted-foreground">
            {formatDate(order.createAt)}
          </span>
        ),
      },
      {
        key: "phoneNumber",
        header: "Số điện thoại",
        headClassName: "w-[130px]",
        render: (order: Order) => (
          <span className="text-xs font-medium text-foreground">
            {order.phoneNumber || "—"}
          </span>
        ),
      },
      {
        key: "shippingAddress",
        header: "Địa chỉ giao hàng",
        headClassName: "min-w-[200px]",
        render: (order: Order) => (
          <span
            className="text-xs text-muted-foreground line-clamp-1 max-w-[260px]"
            title={order.shippingAddress}
          >
            {order.shippingAddress || "Chưa cập nhật"}
          </span>
        ),
      },
      {
        key: "totalPrice",
        header: "Tổng tiền",
        headClassName: "w-[130px]",
        render: (order: Order) => (
          <span className="text-xs font-bold text-foreground">
            {formatCurrency(order.totalPrice)}
          </span>
        ),
      },
      {
        key: "bill",
        header: "In bill",
        headClassName: "w-[110px] text-center",
        className: "text-center",
        render: (order: Order) => (
          <Badge
            variant="outline"
            className={
              order.bill
                ? "bg-emerald-50 text-emerald-700 border-emerald-200 gap-1 text-[11px]"
                : "bg-amber-50 text-amber-700 border-amber-200 gap-1 text-[11px]"
            }
          >
            {order.bill ? (
              <>
                <FileCheck className="h-3 w-3" />
                <span>Đã in</span>
              </>
            ) : (
              <>
                <FileClock className="h-3 w-3" />
                <span>Chưa in</span>
              </>
            )}
          </Badge>
        ),
      },
      {
        key: "status",
        header: "Trạng thái",
        headClassName: "w-[120px] text-center",
        className: "text-center",
        render: (order: Order) => <OrderStatusBadge status={order.status} />,
      },
      {
        key: "actions",
        header: "Chi tiết",
        headClassName: "w-[90px] text-right",
        className: "text-right",
        render: (order: Order) => (
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onOrderDetailsOpen(order)}
                  className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
                >
                  <Eye className="h-4 w-4" />
                  <span className="sr-only">Xem chi tiết</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Xem chi tiết</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ),
      },
    ],
    [isAllSelected, orders.length, selectedOrders, onSelectAll, onOrderSelection, onOrderDetailsOpen]
  );

  return (
    <AdminDataTable<Order>
      data={orders}
      columns={columns}
      keyExtractor={(item) => item.orderId}
      loading={loading}
      totalRows={totalRows}
      paginationModel={paginationModel}
      onPaginationModelChange={onPaginationModelChange}
      itemName="đơn hàng"
      emptyMessage="Chưa có đơn hàng nào phù hợp với bộ lọc hiện tại."
      emptyIcon={<ShoppingBag className="h-10 w-10 opacity-40 text-muted-foreground" />}
    />
  );
};

export default OrdersDataGrid;
