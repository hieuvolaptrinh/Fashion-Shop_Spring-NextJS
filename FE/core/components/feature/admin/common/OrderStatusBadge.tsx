"use client";

import React from "react";
import { Badge } from "@/core/components/ui/badge";
import { CheckCircle2, Truck, AlertCircle, Clock } from "lucide-react";

interface OrderStatusBadgeProps {
  status?: string;
  className?: string;
}

export function OrderStatusBadge({ status, className = "" }: OrderStatusBadgeProps) {
  const s = (status || "PENDING").toUpperCase();

  switch (s) {
    case "COMPLETED":
    case "DELIVERED":
    case "SUCCESS":
      return (
        <Badge
          className={`bg-success/15 text-success hover:bg-success/25 border-success/30 gap-1 font-medium ${className}`}
        >
          <CheckCircle2 className="h-3 w-3" />
          <span>Đã giao</span>
        </Badge>
      );
    case "SHIPPING":
    case "PROCESSING":
      return (
        <Badge
          className={`bg-info/15 text-info hover:bg-info/25 border-info/30 gap-1 font-medium ${className}`}
        >
          <Truck className="h-3 w-3" />
          <span>Đang giao</span>
        </Badge>
      );
    case "CANCELLED":
      return (
        <Badge
          className={`bg-destructive/15 text-destructive hover:bg-destructive/25 border-destructive/30 gap-1 font-medium ${className}`}
        >
          <AlertCircle className="h-3 w-3" />
          <span>Đã hủy</span>
        </Badge>
      );
    case "PENDING":
    default:
      return (
        <Badge
          className={`bg-warning/15 text-warning hover:bg-warning/25 border-warning/30 gap-1 font-medium ${className}`}
        >
          <Clock className="h-3 w-3" />
          <span>Chờ xử lý</span>
        </Badge>
      );
  }
}

export default OrderStatusBadge;
