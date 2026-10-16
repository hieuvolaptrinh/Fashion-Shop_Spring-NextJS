"use client";

import React, { useState } from "react";
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
import { toast } from "sonner";
import { IMAGES } from "@/core/constants";
import { formatCurrency, formatDate } from "@/core/lib/utils";
import { exportMultipleBills } from "@/core/apis/bill";
import { printPdfBlob } from "@/core/lib/printUtils";
import type { Order, OrderItem } from "@/core/lib/type";

interface OrderDetailsProps {
  open: boolean;
  onClose: () => void;
  order: Order | null;
}

const OrderDetails = ({ open, onClose, order }: OrderDetailsProps) => {
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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl p-6">
        <DialogHeader className="pb-3 border-b">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-lg font-bold text-foreground">
                Chi Tiết Đơn Hàng #{order.orderId}
              </DialogTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Xem toàn bộ thông tin thanh toán, địa chỉ nhận và danh sách mặt hàng
              </p>
            </div>
            <Badge
              variant="outline"
              className={
                order.bill
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 gap-1 text-xs"
                  : "bg-amber-50 text-amber-700 border-amber-200 gap-1 text-xs"
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
          </div>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* Thông tin đơn hàng & giao nhận */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Thông tin đơn */}
            <Card className="rounded-xl border shadow-xs bg-slate-50/50 dark:bg-slate-900/40">
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
            <Card className="rounded-xl border shadow-xs bg-slate-50/50 dark:bg-slate-900/40">
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

            <div className="rounded-xl border overflow-hidden divide-y divide-border">
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
                        <img
                          src={imgUrl}
                          alt={item.product?.productName || "Product"}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = IMAGES.FALLBACK_PRODUCT;
                          }}
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

        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="rounded-xl"
          >
            Đóng
          </Button>

          <Button
            type="button"
            onClick={() => handlePrintedBill(order.orderId)}
            disabled={printing}
            className="rounded-xl gap-2 font-medium"
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
