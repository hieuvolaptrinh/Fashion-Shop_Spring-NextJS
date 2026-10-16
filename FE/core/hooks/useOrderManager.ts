import { useCallback, useEffect, useState } from "react";
import { getAllOrders, type OrderFilterRequest } from "@/core/apis/order";
import { exportMultipleBills, exportAllBills } from "@/core/apis/bill";
import { printPdfBlob } from "@/core/lib/printUtils";
import type { Order } from "@/core/lib/type";
import type { PaginationModel } from "@/core/components/feature/admin/common/AdminDataTable";
import { toast } from "sonner";
import {
  DEFAULT_PAGINATION,
  INITIAL_ORDER_FILTERS,
  ORDER_STATUS_OPTIONS,
} from "@/core/constants";

export { ORDER_STATUS_OPTIONS, INITIAL_ORDER_FILTERS };

export const useOrderManager = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [isPrintingBatch, setIsPrintingBatch] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState<number[]>([]);

  // Pagination states
  const [paginationModel, setPaginationModel] = useState<PaginationModel>(DEFAULT_PAGINATION);
  const [totalRows, setTotalRows] = useState(0);

  // Filter states
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<OrderFilterRequest>(INITIAL_ORDER_FILTERS);

  // Dialog states
  const [orderDetailsOpen, setOrderDetailsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Fetch orders from API
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const filterParams: OrderFilterRequest = {
        page: paginationModel.page,
        size: paginationModel.pageSize,
        ...filters,
      };

      const response = await getAllOrders(filterParams);

      if (response && response.content) {
        setOrders(response.content);
        setTotalRows(response.totalElements || 0);
      } else if (Array.isArray(response)) {
        setOrders(response);
        setTotalRows(response.length);
      } else {
        setOrders([]);
        setTotalRows(0);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Không thể tải danh sách đơn hàng");
      setOrders([]);
      setTotalRows(0);
    } finally {
      setLoading(false);
    }
  }, [paginationModel, filters]);

  // Initial load & when dependencies change
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Handlers for selection
  const handleOrderSelection = (orderId: number, checked: boolean) => {
    if (checked) {
      setSelectedOrders((prev) => [...prev, orderId]);
    } else {
      setSelectedOrders((prev) => prev.filter((id) => id !== orderId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrders(orders.map((order) => order.orderId));
    } else {
      setSelectedOrders([]);
    }
  };

  // Pagination handler
  const handlePaginationModelChange = (newModel: PaginationModel) => {
    setPaginationModel(newModel);
  };

  // Filter handlers
  const handleStatusToggle = (statusValue: string) => {
    setFilters((prev) => {
      const current = prev.status || [];
      const exists = current.includes(statusValue);
      const nextStatus = exists
        ? current.filter((s) => s !== statusValue)
        : [...current, statusValue];
      return { ...prev, status: nextStatus };
    });
  };

  const handleBillFilterToggle = (targetValue: boolean) => {
    setFilters((prev) => ({
      ...prev,
      isBill: prev.isBill === targetValue ? undefined : targetValue,
    }));
  };

  const handlePriceFilterChange = (
    field: "minTotalPrice" | "maxTotalPrice",
    value: number | undefined
  ) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleClearFilters = () => {
    setFilters(INITIAL_ORDER_FILTERS);
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  };

  const handleApplyFilters = () => {
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
    fetchOrders();
  };

  // Print selected orders
  const handlePrintSelected = async () => {
    if (selectedOrders.length === 0) {
      toast.error("Vui lòng chọn ít nhất 1 đơn hàng để in hóa đơn!");
      return;
    }

    try {
      setIsPrintingBatch(true);
      const pdfBlob = await exportMultipleBills(selectedOrders);
      printPdfBlob(pdfBlob);

      toast.success(`Đang mở ${selectedOrders.length} hóa đơn để in...`);
      setSelectedOrders([]);
      setTimeout(() => fetchOrders(), 1500);
    } catch (error) {
      console.error("Error printing selected orders:", error);
      toast.error("Không thể in hóa đơn các đơn đã chọn!");
    } finally {
      setIsPrintingBatch(false);
    }
  };

  // Print all unprinted orders
  const handlePrintAllUnprinted = async () => {
    try {
      setIsPrintingBatch(true);
      const pdfBlob = await exportAllBills(false);
      printPdfBlob(pdfBlob);

      toast.success("Đang mở toàn bộ hóa đơn chưa in...");
      setTimeout(() => fetchOrders(), 1500);
    } catch (error) {
      console.error("Error printing all unprinted orders:", error);
      toast.error("Không có đơn hàng nào chưa in hoặc đã xảy ra lỗi!");
    } finally {
      setIsPrintingBatch(false);
    }
  };

  // Order Details Modal Handlers
  const handleOrderDetailsOpen = (order: Order) => {
    setSelectedOrder(order);
    setOrderDetailsOpen(true);
  };

  const handleOrderDetailsClose = () => {
    setOrderDetailsOpen(false);
    setSelectedOrder(null);
  };

  return {
    orders,
    loading,
    isPrintingBatch,
    selectedOrders,
    paginationModel,
    totalRows,
    showFilters,
    setShowFilters,
    filters,
    orderDetailsOpen,
    selectedOrder,
    statusOptions: ORDER_STATUS_OPTIONS,
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
  };
};

export default useOrderManager;
