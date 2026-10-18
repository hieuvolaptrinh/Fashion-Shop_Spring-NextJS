"use client";

import React from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/core/components/ui/dialog";
import { Button } from "@/core/components/ui/button";
import ConfirmDialog from "@/core/components/ui/confirm-dialog";
import { OrderStatusBadge } from "@/core/components/feature/admin/common/OrderStatusBadge";
import { formatCurrency, formatDate } from "@/core/lib/utils";
import { IMAGES } from "@/core/constants";
import { Clock, Truck, CheckCircle2, AlertCircle, MapPin, Phone, Receipt, Loader2, Ban } from "lucide-react";
import type { OrderResponse } from "@/core/lib/type";

interface UserOrderDetailDialogProps {
  open: boolean;
  onClose: () => void;
  order: OrderResponse | null;
  onCancelOrder?: (orderId: number) => Promise<void>;
  isCancelling?: boolean;
}

export const UserOrderDetailDialog: React.FC<UserOrderDetailDialogProps> = ({
  open,
  onClose,
  order,
  onCancelOrder,
  isCancelling = false,
}) => {
  const [confirmCancelOpen, setConfirmCancelOpen] = React.useState(false);

  if (!order) return null;

  const isPaid = order.isPay ?? order.pay ?? false;
  const isBilled = order.isBill ?? order.bill ?? false;

  const items = order.items || [];
  const itemsTotal = items.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );
  const shippingFee = Math.max(0, (order.totalPrice || 0) - itemsTotal);

  const renderStatusBanner = () => {
    const s = (order.status || "PENDING").toUpperCase();

    if (s === "PENDING") {
      return (
        <div className="flex items-start gap-3 rounded-xl border border-warning/30 bg-warning/10 p-3.5 text-xs text-warning">
          <Clock className="h-4 w-4 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-semibold text-foreground">Đơn hàng đang được chờ xác nhận</p>
            <p className="text-muted-foreground">Shop đang chuẩn bị hàng và sẽ sớm bàn giao cho đơn vị vận chuyển.</p>
          </div>
        </div>
      );
    }

    if (s === "SHIPPING") {
      return (
        <div className="flex items-start gap-3 rounded-xl border border-info/30 bg-info/10 p-3.5 text-xs text-info">
          <Truck className="h-4 w-4 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-semibold text-foreground">Đơn hàng đang trên đường giao đến bạn</p>
            <p className="text-muted-foreground">Dự kiến giao hàng trong 1-2 ngày tới. Vui lòng để ý điện thoại khi shipper liên hệ.</p>
          </div>
        </div>
      );
    }

    if (s === "DELIVERED") {
      return (
        <div className="flex items-start gap-3 rounded-xl border border-success/30 bg-success/10 p-3.5 text-xs text-success">
          <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-semibold text-foreground">Đơn hàng đã được giao thành công</p>
            <p className="text-muted-foreground">Cảm ơn bạn đã tin tưởng mua sắm tại Lan Chuyên Hàng Sale!</p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-3.5 text-xs text-destructive">
        <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-semibold text-foreground">Đơn hàng đã bị hủy</p>
          <p className="text-muted-foreground">Đơn hàng này không còn hiệu lực. Hãy liên hệ hotline nếu bạn cần hỗ trợ thêm.</p>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-h-[90vh] w-full max-w-[95vw] sm:max-w-xl overflow-hidden p-0 rounded-2xl border-border/80">
        <DialogHeader className="border-b border-border/60 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <DialogTitle className="text-base font-semibold text-foreground">
                Chi tiết đơn hàng #{order.orderId}
              </DialogTitle>
              <p className="text-xs text-muted-foreground">
                Đặt lúc: {formatDate(order.createAt)}
              </p>
            </div>
            <OrderStatusBadge status={order.status as string} />
          </div>
        </DialogHeader>

        <div className="max-h-[calc(90vh-120px)] overflow-y-auto p-6 space-y-5">
          {renderStatusBanner()}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="rounded-xl border border-border/60 bg-muted/20 p-3.5 space-y-1">
              <span className="flex items-center gap-1.5 text-muted-foreground font-medium">
                <Phone className="h-3.5 w-3.5 text-primary" />
                Số điện thoại liên hệ:
              </span>
              <p className="font-semibold text-foreground pl-5">{order.phoneNumber}</p>
            </div>

            <div className="rounded-xl border border-border/60 bg-muted/20 p-3.5 space-y-1">
              <span className="flex items-center gap-1.5 text-muted-foreground font-medium">
                <Receipt className="h-3.5 w-3.5 text-primary" />
                Trạng thái thanh toán:
              </span>
              <p className="font-semibold text-foreground pl-5">
                {isPaid ? "Đã thanh toán" : "Thanh toán khi nhận hàng (COD)"}
                {isBilled && " • Đã in phiếu"}
              </p>
            </div>

            <div className="sm:col-span-2 rounded-xl border border-border/60 bg-muted/20 p-3.5 space-y-1">
              <span className="flex items-center gap-1.5 text-muted-foreground font-medium">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                Địa chỉ nhận hàng:
              </span>
              <p className="font-medium text-foreground pl-5">{order.shippingAddress}</p>
            </div>
          </div>

          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Danh sách sản phẩm ({(order.items || []).length})
            </h4>

            <div className="divide-y divide-border/40 rounded-xl border border-border/60 bg-card p-3">
              {(order.items || []).map((detail) => {
                const product = detail.product;
                const imageUrl = product?.listImages?.[0]?.link || IMAGES.FALLBACK_PRODUCT;

                return (
                  <div
                    key={detail.orderDetailId}
                    className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0"
                  >
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-border/60 bg-muted/40">
                      <Image
                        src={imageUrl}
                        alt={product?.productName || "Sản phẩm"}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-1 text-xs font-medium text-foreground">
                        {product?.productName}
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {formatCurrency(detail.price)} × {detail.quantity}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-foreground shrink-0">
                      {formatCurrency(detail.price * detail.quantity)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl border border-border/60 bg-muted/30 p-4 space-y-2 text-xs">
            <div className="flex justify-between items-center text-muted-foreground">
              <span>Tạm tính ({items.length} món):</span>
              <span className="font-medium text-foreground">{formatCurrency(itemsTotal)}</span>
            </div>
            <div className="flex justify-between items-center text-muted-foreground">
              <span>Phí vận chuyển:</span>
              <span className={shippingFee === 0 ? "font-medium text-success" : "font-medium text-foreground"}>
                {shippingFee === 0 ? "Miễn phí" : formatCurrency(shippingFee)}
              </span>
            </div>
            <div className="border-t border-border/40 pt-2 flex justify-between items-center text-sm">
              <span className="font-semibold text-foreground">Tổng thanh toán:</span>
              <span className="text-base font-bold text-rose-600">{formatCurrency(order.totalPrice)}</span>
            </div>
          </div>

          {/* Action Button: Hủy đơn nếu còn ở trạng thái Chờ xử lý */}
          {order.status === "PENDING" && onCancelOrder && (
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-border/60">
              <p className="text-[11px] text-muted-foreground">
                Bạn có thể hủy đơn hàng khi đơn chưa được chuyển cho đơn vị vận chuyển.
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isCancelling}
                onClick={() => setConfirmCancelOpen(true)}
                className="text-xs text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive rounded-xl gap-1.5 font-normal h-8 shrink-0"
              >
                {isCancelling ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Ban className="h-3.5 w-3.5" />
                )}
                <span>Hủy đơn hàng</span>
              </Button>
            </div>
          )}
        </div>
      </DialogContent>

      <ConfirmDialog
        open={confirmCancelOpen}
        variant="destructive"
        title={`Xác nhận hủy đơn hàng #${order.orderId}`}
        description="Đơn hàng của bạn sẽ bị hủy và toàn bộ các mặt hàng đã chọn sẽ được hoàn trả về kho dữ liệu. Bạn có chắc chắn muốn hủy đơn không?"
        confirmText="Xác nhận hủy"
        cancelText="Giữ lại đơn"
        loading={isCancelling}
        onConfirm={async () => {
          if (onCancelOrder) {
            await onCancelOrder(order.orderId);
            setConfirmCancelOpen(false);
          }
        }}
        onCancel={() => setConfirmCancelOpen(false)}
      />
    </Dialog>
  );
};

export default UserOrderDetailDialog;
