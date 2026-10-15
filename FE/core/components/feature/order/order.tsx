"use client";

import { getOrders } from "@/core/apis/order";
import { Badge } from "@/core/components/ui/badge";
import { Button } from "@/core/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/core/components/ui/dialog";
import { Separator } from "@/core/components/ui/separator";
import type { Product } from "@/core/lib/type";
import { CheckCircle, Clock, Eye, Package, Truck } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";

export const metadata: Metadata = {
  title: "Đơn hàng của tôi",
  description:
    "Theo dõi trạng thái và lịch sử đơn hàng của bạn tại Lan Chuyên Hàng Sale. Xem chi tiết đơn hàng, sản phẩm đã mua và tổng thanh toán.",
};

type OrderItem = {
  orderDetailId: number;
  product: Product;
  quantity: number;
  price: number;
};

type Order = {
  bill: boolean;
  createAt: string; // ISO date string, e.g. "2025-07-03"
  items: OrderItem[];
  orderId: number;
  pay: boolean;
  phoneNumber: string;
  shippingAddress: string;
  status: "PENDING" | "SHIPPING" | "DELIVERED" | "CANCELLED"; // Add more if needed
  totalPrice: number;
  userId: number;
};

const Order = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "PENDING":
        return {
          label: "Đang xử lý",
          icon: Clock,
          variant: "secondary" as const,
          color: "text-yellow-600",
        };
      case "SHIPPING":
        return {
          label: "Đang giao",
          icon: Truck,
          variant: "default" as const,
          color: "text-blue-600",
        };
      case "DELIVERED":
        return {
          label: "Đã giao",
          icon: CheckCircle,
          variant: "outline" as const,
          color: "text-green-600",
        };
      default:
        return {
          label: "Không xác định",
          icon: Package,
          variant: "secondary" as const,
          color: "text-gray-600",
        };
    }
  };
  useEffect(() => {
    const fetchOrders = async () => {
      const data = await getOrders();
      setOrders(data.data);
    };
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            Đơn hàng của tôi
          </h1>
          <p className="text-gray-600">
            Theo dõi trạng thái và lịch sử đơn hàng của bạn
          </p>
        </div>

        <div className="space-y-6">
          {orders.map((order) => {
            const statusInfo = getStatusInfo(order.status);
            const StatusIcon = statusInfo.icon;

            return (
              <Card key={order.orderId} className="overflow-hidden">
                <CardHeader className="border-b bg-white">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                      <div>
                        <CardTitle className="text-lg">
                          Đơn hàng #{order.orderId}
                        </CardTitle>
                        <p className="mt-1 text-sm text-gray-600">
                          Ngày đặt: {order.createAt}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge
                        variant={statusInfo.variant}
                        className="flex items-center gap-1"
                      >
                        <StatusIcon className="h-3 w-3" />
                        {statusInfo.label}
                      </Badge>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Eye className="mr-2 h-4 w-4" />
                            Chi tiết
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-h-[90vh] w-full max-w-[95vw] overflow-hidden p-0 sm:max-w-2xl">
                          <DialogHeader className="border-b p-4 pb-2">
                            <DialogTitle className="text-lg">
                              Chi tiết đơn hàng #{order.orderId}
                            </DialogTitle>
                            <p className="text-sm text-gray-600">
                              Ngày đặt: {order.createAt}
                            </p>
                          </DialogHeader>

                          <div className="max-h-[calc(90vh-80px)] space-y-4 overflow-y-auto p-4">
                            {/* Thông tin khách hàng */}
                            <div className="rounded-lg bg-gray-50 p-4">
                              <h4 className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-900">
                                <div className="h-2 w-2 rounded-full bg-blue-500" />
                                Thông tin khách hàng
                              </h4>
                              <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                                <div>
                                  <span className="block text-gray-600">
                                    Tên khách hàng
                                  </span>
                                  <span className="font-medium">
                                    Người dùng
                                  </span>
                                </div>
                                <div>
                                  <span className="block text-gray-600">
                                    Số điện thoại
                                  </span>
                                  <span className="font-medium">
                                    {order.phoneNumber}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Địa chỉ giao hàng */}
                            <div className="rounded-lg bg-gray-50 p-4">
                              <h4 className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-900">
                                <div className="h-2 w-2 rounded-full bg-green-500" />
                                Địa chỉ giao hàng
                              </h4>
                              <p className="text-sm leading-relaxed text-gray-700">
                                {order.shippingAddress}
                              </p>
                            </div>

                            {/* Trạng thái đơn hàng */}
                            <div className="rounded-lg bg-gray-50 p-4">
                              <h4 className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-900">
                                <div className="h-2 w-2 rounded-full bg-orange-500"></div>
                                Trạng thái đơn hàng
                              </h4>
                              <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                  <StatusIcon
                                    className={`h-5 w-5 ${statusInfo.color}`}
                                  />
                                  <Badge
                                    variant={statusInfo.variant}
                                    className="px-3 py-1 text-sm"
                                  >
                                    {statusInfo.label}
                                  </Badge>
                                </div>
                              </div>
                            </div>

                            {/* Danh sách sản phẩm */}
                            <div className="rounded-lg bg-gray-50 p-4">
                              <h4 className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-900">
                                <div className="h-2 w-2 rounded-full bg-purple-500" />
                                Sản phẩm ({order.items.length})
                              </h4>
                              <div className="space-y-4">
                                {order.items.map((product) => (
                                  <div key={product.product.productId}>
                                    <div className="flex gap-3 rounded-lg border bg-white p-3">
                                      <img
                                        src={
                                          product.product.listImages[0]?.link ||
                                          "/placeholder.svg"
                                        }
                                        alt={product.product.productName}
                                        width={60}
                                        height={60}
                                        className="flex-shrink-0 rounded border object-cover"
                                      />
                                      <div className="min-w-0 flex-1">
                                        <p className="mb-1 line-clamp-2 text-sm font-medium text-gray-900">
                                          {product.product.productName}
                                        </p>
                                        <div className="flex items-center justify-between">
                                          <span className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-600">
                                            SL: {product.quantity}
                                          </span>
                                          <span className="text-sm font-bold text-gray-900">
                                            {product.price.toLocaleString(
                                              "vi-VN",
                                            )}
                                            ₫
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Tổng tiền */}
                            <div className="rounded-lg border-2 border-blue-100 bg-gradient-to-r from-blue-50 to-purple-50 p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <span className="block text-sm text-gray-600">
                                    Tổng thanh toán
                                  </span>
                                  <span className="text-2xl font-bold text-gray-900">
                                    {order.totalPrice}₫
                                  </span>
                                </div>
                                <div className="text-right">
                                  <Badge variant="outline" className="text-xs">
                                    {order.items.length} sản phẩm
                                  </Badge>
                                </div>
                              </div>
                            </div>

                            {/* Ghi chú trạng thái */}
                            {order.status === "SHIPPING" && (
                              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                                <div className="flex items-start gap-3">
                                  <Truck className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
                                  <div>
                                    <p className="mb-1 font-medium text-blue-800">
                                      Đang vận chuyển
                                    </p>
                                    <p className="text-sm text-blue-700">
                                      Đơn hàng của bạn đang được vận chuyển và
                                      sẽ được giao trong 1-2 ngày tới.
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}

                            {order.status === "PENDING" && (
                              <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                                <div className="flex items-start gap-3">
                                  <Clock className="mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-600" />
                                  <div>
                                    <p className="mb-1 font-medium text-yellow-800">
                                      Đang xử lý
                                    </p>
                                    <p className="text-sm text-yellow-700">
                                      Đơn hàng của bạn đang được xử lý và sẽ
                                      được giao đến tay bạn sớm.
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}

                            {order.status === "DELIVERED" && (
                              <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                                <div className="flex items-start gap-3">
                                  <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                                  <div>
                                    <p className="mb-1 font-medium text-green-800">
                                      Đã giao thành công
                                    </p>
                                    <p className="text-sm text-green-700">
                                      Đơn hàng đã được giao thành công. Cảm ơn
                                      bạn đã mua sắm!
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  <div className="space-y-4">
                    {order.items.map((product, index) => (
                      <div key={product.orderDetailId}>
                        <div className="flex gap-4">
                          <div className="flex-shrink-0">
                            <img
                              src={
                                product.product.listImages[0]?.link ||
                                "/placeholder.svg"
                              }
                              alt={product.product.productName}
                              width={80}
                              height={80}
                              className="rounded-lg border object-cover"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="mb-1 font-semibold text-gray-900">
                              {product.product.productName}
                            </h3>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">
                                Số lượng: {product.quantity}
                              </span>
                              <span className="text-lg font-semibold">
                                {(
                                  product.product.salePrice * product.quantity
                                ).toLocaleString("vi-VN")}
                                ₫
                              </span>
                            </div>
                          </div>
                        </div>
                        {index < order.items.length - 1 && (
                          <Separator className="mt-4" />
                        )}
                      </div>
                    ))}
                  </div>

                  <Separator className="my-6" />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <StatusIcon className={`h-5 w-5 ${statusInfo.color}`} />
                      <span className={`font-medium ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="mb-1 text-sm text-gray-600">Tổng cộng</p>
                      <p className="text-xl font-bold text-gray-900">
                        {order.totalPrice.toLocaleString("vi-VN")}₫
                      </p>
                    </div>
                  </div>

                  {order.status === "SHIPPING" && (
                    <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
                      <div className="flex items-center gap-2 text-blue-800">
                        <Truck className="h-4 w-4" />
                        <span className="font-medium">Đang vận chuyển</span>
                      </div>
                      <p className="mt-1 text-sm text-blue-700">
                        Đơn hàng của bạn đang được vận chuyển và sẽ được giao
                        trong 1-2 ngày tới.
                      </p>
                    </div>
                  )}

                  {order.status === "PENDING" && (
                    <div className="mt-4 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                      <div className="flex items-center gap-2 text-yellow-800">
                        <Clock className="h-4 w-4" />
                        <span className="font-medium">Đang xử lý</span>
                      </div>
                      <p className="mt-1 text-sm text-yellow-700">
                        Đơn hàng của bạn đang được xử lý và sẽ được giao cho đơn
                        vị vận chuyển sớm.
                      </p>
                    </div>
                  )}

                  {order.status === "DELIVERED" && (
                    <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-4">
                      <div className="flex items-center gap-2 text-green-800">
                        <CheckCircle className="h-4 w-4" />
                        <span className="font-medium">Đã giao thành công</span>
                      </div>
                      <p className="mt-1 text-sm text-green-700">
                        Đơn hàng đã được giao thành công. Cảm ơn bạn đã mua sắm!
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {orders.length === 0 && (
          <Card className="py-12 text-center">
            <CardContent>
              <Package className="mx-auto mb-4 h-16 w-16 text-gray-400" />
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                Chưa có đơn hàng nào
              </h3>
              <p className="mb-6 text-gray-600">
                Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm ngay!
              </p>
              <Button asChild>
                <Link href="/products">Khám phá sản phẩm</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
export default Order;
