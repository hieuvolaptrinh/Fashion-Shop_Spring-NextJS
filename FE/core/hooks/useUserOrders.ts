"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { getOrders, cancelOrder } from "@/core/apis/order";
import { getAuthStatus } from "@/core/lib/authUtils";
import { toast } from "sonner";
import type { OrderResponse } from "@/core/lib/type";

export type OrderStatusTab = "ALL" | "PENDING" | "SHIPPING" | "DELIVERED" | "CANCELLED";

export const useUserOrders = () => {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [isCancelling, setIsCancelling] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<OrderStatusTab>("ALL");
  const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);

  // Phân trang
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 5;

  const fetchOrders = useCallback(async () => {
    const auth = getAuthStatus();
    setIsAuthenticated(auth.isAuthenticated);

    if (!auth.isAuthenticated) {
      setOrders([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const list = await getOrders();
      setOrders(list);
    } catch (error) {
      console.error("Lỗi khi tải lịch sử đơn hàng:", error);
      toast.error("Không thể tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const filteredOrders = useMemo(() => {
    if (activeTab === "ALL") return orders;
    return orders.filter((o) => (o.status || "").toUpperCase() === activeTab);
  }, [orders, activeTab]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / pageSize));

  // Tự động điều chỉnh lại trang nếu trang hiện tại vượt quá tổng số trang
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  // Cắt danh sách đơn hàng cho trang hiện tại
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredOrders.slice(startIndex, startIndex + pageSize);
  }, [filteredOrders, currentPage, pageSize]);

  // Tóm tắt số đơn hàng hiển thị
  const paginationSummary = useMemo(() => {
    if (filteredOrders.length === 0) return { start: 0, end: 0, total: 0 };
    const start = (currentPage - 1) * pageSize + 1;
    const end = Math.min(currentPage * pageSize, filteredOrders.length);
    return { start, end, total: filteredOrders.length };
  }, [filteredOrders.length, currentPage, pageSize]);

  // Đổi tab trạng thái kèm tự động reset về trang 1
  const handleSelectTab = useCallback((tab: OrderStatusTab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  }, []);

  // Đổi trang kèm cuộn mượt về đầu danh sách
  const handlePageChange = useCallback(
    (page: number) => {
      if (page < 1 || page > totalPages) return;
      setCurrentPage(page);

      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    [totalPages]
  );

  const statusCounts = useMemo(() => {
    const counts = {
      ALL: orders.length,
      PENDING: 0,
      SHIPPING: 0,
      DELIVERED: 0,
      CANCELLED: 0,
    };

    orders.forEach((o) => {
      const s = (o.status || "").toUpperCase() as keyof typeof counts;
      if (counts[s] !== undefined && s !== "ALL") {
        counts[s]++;
      }
    });

    return counts;
  }, [orders]);

  const handleOpenDetail = (order: OrderResponse) => {
    setSelectedOrder(order);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setSelectedOrder(null);
    setIsDetailOpen(false);
  };

  const handleCancelOrder = async (orderId: number) => {
    try {
      setIsCancelling(true);
      await cancelOrder(orderId);
      toast.success(`Đã hủy đơn hàng #${orderId} thành công!`);
      setSelectedOrder((prev) =>
        prev && prev.orderId === orderId ? { ...prev, status: "CANCELLED" } : prev
      );
      await fetchOrders();
    } catch (error) {
      console.error("Lỗi khi hủy đơn hàng:", error);
      toast.error("Không thể hủy đơn hàng này. Vui lòng thử lại!");
    } finally {
      setIsCancelling(false);
    }
  };

  return {
    orders,
    filteredOrders,
    paginatedOrders,
    loading,
    isAuthenticated,
    isCancelling,
    activeTab,
    statusCounts,
    selectedOrder,
    isDetailOpen,
    currentPage,
    totalPages,
    pageSize,
    paginationSummary,
    setActiveTab: handleSelectTab,
    handlePageChange,
    handleOpenDetail,
    handleCloseDetail,
    handleCancelOrder,
    fetchOrders,
  };
};

export default useUserOrders;
