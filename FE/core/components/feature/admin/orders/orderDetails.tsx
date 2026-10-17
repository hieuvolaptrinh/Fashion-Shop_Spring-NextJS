"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Calendar,
  Phone,
  MapPin,
  Printer,
  FileCheck,
  FileClock,
  DollarSign,
  Loader2,
  Package,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/core/components/ui/dialog";
import { Button } from "@/core/components/ui/button";
import { Badge } from "@/core/components/ui/badge";
import { Card, CardContent } from "@/core/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/components/ui/select";
import { toast } from "sonner";
import { IMAGES, ORDER_STATUS_OPTIONS } from "@/core/constants";
import { formatCurrency, formatDate } from "@/core/lib/utils";
import { exportMultipleBills } from "@/core/apis/bill";
import { printPdfBlob } from "@/core/lib/printUtils";
import { OrderStatusBadge } from "@/core/components/feature/admin/common/OrderStatusBadge";
import type { Order, OrderItem } from "@/core/lib/type";

interface OrderDetailsProps {
  open: boolean;
  onClose: () => void;
  order: Order | null;
  onUpdateStatus?: (orderId: number, status: string) => Promise<void>;
  isUpdating?: boolean;
}

export const OrderDetails = ({
  open,
  onClose,
  order,
  onUpdateStatus,
  isUpdating = false,
}: OrderDetailsProps) => {
  const [printing, setPrinting] = useState(false);

  if (!order) return null;

  const handlePrintedBill = async (orderId: number) => {
    try {
      setPrinting(true);
      const pdfBlob = await exportMultipleBills([orderId]);
      printPdfBlob(pdfBlob);
      toast.success(`Đang mở hóa đơn đơn hàng #${orderId} để in...`);
    } catch (error) {
      console.error("Lỗi khi in hóa đơn:", error);
      toast.error("Không thể xuất file hóa đơn. Vui lòng kiểm tra lại dịch vụ Backend!");
    } finally {
      setPrinting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl p-6 border-border/80">
        <DialogHeader className="pb-3 border-b border-border/60">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <DialogTitle className="text-lg font-bold text-foreground">
                Chi Tiết Đơn Hàng #{order.orderId}
              </DialogTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Xem toàn bộ thông tin thanh toán, địa chỉ nhận và danh sách mặt hàng
              </p>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <Badge
                variant="outline"
                className={
                  order.bill
                    ? "bg-success/15 text-success border-success/30 gap-1 text-xs font-medium"
                    : "bg-warning/15 text-warning border-warning/30 gap-1 text-xs font-medium"
                }
              >
                {order.bill ? (
                  <>
                    <FileCheck className="h-3 w-3" />
                    <span>Đã in bill</span>
                  </>
                ) : (
                  <>
                    <FileClock className="h-3 w-3" />
                    <span>Chưa in bill</span>
                  </>
                )}
              </Badge>
              <OrderStatusBadge status={order.status} />
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* Thanh cập nhật trạng thái đơn hàng dành cho Admin */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl border border-border/60 bg-muted/20">
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-foreground">
                Cập nhật trạng thái xử lý
              </span>
              <p className="text-[11px] text-muted-foreground">
                Chuyển trạng thái để khách hàng theo dõi tiến trình đơn hàng
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Select
                value={order.status}
                onValueChange={(val) => onUpdateStatus?.(order.orderId, val)}
                disabled={isUpdating}
              >
                <SelectTrigger className="h-8 text-xs rounded-xl w-[150px] bg-card border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {ORDER_STATUS_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value} className="text-xs">
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {isUpdating && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
            </div>
          </div>

          {/* Thông tin đơn hàng & giao nhận */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Thông tin đơn */}
            <Card className="rounded-xl border border-border/60 shadow-xs bg-muted/20">
              <CardContent className="p-4 space-y-2.5">
                <p className="text-xs font-semibold text-foreground uppercase tracking-wide">
                  Thông tin đơn hàng
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-4 w-4 shrink-0 text-primary" />
                  <span>
                    Ngày đặt: <strong className="text-foreground">{formatDate(order.createAt)}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <DollarSign className="h-4 w-4 shrink-0 text-primary" />
                  <span>
                    Tổng tiền:{" "}
                    <strong className="text-base font-bold text-primary">
                      {formatCurrency(order.totalPrice)}
                    </strong>
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Thông tin khách hàng */}
            <Card className="rounded-xl border border-border/60 shadow-xs bg-muted/20">
              <CardContent className="p-4 space-y-2.5">
                <p className="text-xs font-semibold text-foreground uppercase tracking-wide">
                  Thông tin giao hàng
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Phone className="h-4 w-4 shrink-0 text-primary" />
                  <span>
                    Số điện thoại: <strong className="text-foreground">{order.phoneNumber || "Chưa cập nhật"}</strong>
                  </span>
                </div>
                <div className="flex items-start gap-2 text-xs text-muted-foreground">
                  <MapPin className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                  <span className="leading-snug">
                    Địa chỉ: <strong className="text-foreground">{order.shippingAddress || "Chưa cập nhật"}</strong>
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Danh sách mặt hàng */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-foreground uppercase tracking-wide">
              Mặt hàng đã đặt ({order.items?.length || 0} sản phẩm)
            </p>

            <div className="rounded-xl border border-border/60 overflow-hidden divide-y divide-border/40 bg-card">
              {order.items && order.items.length > 0 ? (
                order.items.map((item: OrderItem, idx: number) => {
                  const imgUrl =
                    item.product?.listImages?.[0]?.link || IMAGES.FALLBACK_PRODUCT;
                  const itemTotal = (item.price || 0) * (item.quantity || 1);

                  return (
                    <div
                      key={item.orderDetailId || idx}
                      className="flex items-center gap-3.5 p-3.5 hover:bg-muted/30 transition-colors"
                    >
                      <div className="relative h-14 w-14 rounded-lg overflow-hidden border border-border/60 bg-muted/30 shrink-0">
                        <Image
                          src={imgUrl}
                          alt={item.product?.productName || "Product"}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-foreground line-clamp-1">
                          {item.product?.productName || "Sản phẩm thời trang"}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-muted-foreground">
                          <span>
                            Đơn giá: {formatCurrency(item.price)}
                          </span>
                          <span>×</span>
                          <span className="font-semibold text-foreground">
                            {item.quantity} cái
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-bold text-primary">
                          {formatCurrency(itemTotal)}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-8 text-center text-xs text-muted-foreground">
                  <Package className="h-8 w-8 mx-auto opacity-30 mb-1" />
                  Không có thông tin chi tiết sản phẩm cho đơn hàng này.
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-border/60">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="rounded-xl text-xs h-9"
          >
            Đóng
          </Button>

          <Button
            type="button"
            onClick={() => handlePrintedBill(order.orderId)}
            disabled={printing}
            className="rounded-xl gap-2 font-medium text-xs h-9"
          >
            {printing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Đang xử lý in...</span>
              </>
            ) : (
              <>
                <Printer className="h-4 w-4" />
                <span>In hóa đơn đơn này</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetails;
