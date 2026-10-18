"use client";

import React, { useMemo } from "react";
import {
  Eye,
  ShoppingBag,
  FileCheck,
  FileClock,
  Loader2,
} from "lucide-react";
import { Badge } from "@/core/components/ui/badge";
import { Button } from "@/core/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/components/ui/select";
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
import { ORDER_STATUS_OPTIONS } from "@/core/constants";
import type { Order } from "@/core/lib/type";

interface OrdersDataGridProps {
  orders: Order[];
  loading: boolean;
  selectedOrders: number[];
  paginationModel: PaginationModel;
  totalRows: number;
  onPaginationModelChange: (newModel: PaginationModel) => void;
  onOrderSelection: (orderId: number, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  onOrderDetailsOpen: (order: Order) => void;
  onUpdateStatus?: (orderId: number, status: string) => Promise<void>;
  updatingOrderId?: number | null;
}

export const OrdersDataGrid = ({
  orders,
  loading,
  selectedOrders,
  paginationModel,
  totalRows,
  onPaginationModelChange,
  onOrderSelection,
  onSelectAll,
  onOrderDetailsOpen,
  onUpdateStatus,
  updatingOrderId,
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
            className="h-4 w-4 rounded-sm border-input text-primary focus:ring-primary cursor-pointer accent-primary"
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
            className="h-4 w-4 rounded-sm border-input text-primary focus:ring-primary cursor-pointer accent-primary"
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
          <span className="text-xs font-bold text-rose-600">
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
              order.bill || order.isBill
                ? "bg-success/15 text-success border-success/30 gap-1 text-[11px] font-medium"
                : "bg-warning/15 text-warning border-warning/30 gap-1 text-[11px] font-medium"
            }
          >
            {order.bill || order.isBill ? (
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
        headClassName: "w-[160px] text-center",
        className: "text-center",
        render: (order: Order) => {
          const isRowUpdating = updatingOrderId === order.orderId;

          if (!onUpdateStatus) {
            return <OrderStatusBadge status={order.status} />;
          }

          return (
            <div className="flex items-center justify-center">
              <Select
                value={String(order.status)}
                onValueChange={(val) => onUpdateStatus(order.orderId, val)}
                disabled={isRowUpdating}
              >
                <SelectTrigger className="h-8 text-xs rounded-xl px-2.5 border-border/70 bg-card hover:bg-muted/40 transition-colors w-[130px] justify-between">
                  {isRowUpdating ? (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                      <span>Đang lưu...</span>
                    </div>
                  ) : (
                    <SelectValue>
                      <OrderStatusBadge
                        status={order.status}
                        className="border-0 px-0 py-0 bg-transparent text-[11px]"
                      />
                    </SelectValue>
                  )}
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {ORDER_STATUS_OPTIONS.map((opt) => (
                    <SelectItem
                      key={opt.value}
                      value={opt.value}
                      className="text-xs cursor-pointer"
                    >
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          );
        },
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
    [
      isAllSelected,
      orders.length,
      selectedOrders,
      updatingOrderId,
      onSelectAll,
      onOrderSelection,
      onOrderDetailsOpen,
      onUpdateStatus,
    ]
  );

  return (
    <AdminDataTable<Order>
      data={orders}
      columns={columns}
      keyExtractor={(item, index) =>
        item.orderId ? `order-${item.orderId}-${index}` : `order-${index}`
      }
      loading={loading}
      totalRows={totalRows}
      paginationModel={paginationModel}
      onPaginationModelChange={onPaginationModelChange}
      itemName="đơn hàng"
      emptyMessage="Chưa có đơn hàng nào phù hợp với bộ lọc hiện tại."
      emptyIcon={
        <ShoppingBag className="h-10 w-10 opacity-40 text-muted-foreground" />
      }
    />
  );
};

export default OrdersDataGrid;
