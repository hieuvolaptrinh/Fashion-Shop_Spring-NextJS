import { useCallback, useEffect, useState } from "react";
import {
  getAllOrders,
  updateOrderStatus,
  updateBatchOrderStatus,
  type OrderFilterRequest,
} from "@/core/apis/order";
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
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null);
  const [isBatchUpdatingStatus, setIsBatchUpdatingStatus] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState<number[]>([]);

  // Pagination states
  const [paginationModel, setPaginationModel] =
    useState<PaginationModel>(DEFAULT_PAGINATION);
  const [totalRows, setTotalRows] = useState(0);

  // Filter states (draftFilters for form UI, appliedFilters for API trigger)
  const [showFilters, setShowFilters] = useState(false);
  const [draftFilters, setDraftFilters] =
    useState<OrderFilterRequest>(INITIAL_ORDER_FILTERS);
  const [appliedFilters, setAppliedFilters] =
    useState<OrderFilterRequest>(INITIAL_ORDER_FILTERS);

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
        ...appliedFilters,
      };

      const response = await getAllOrders(filterParams);
      const pageData = (response as any)?.data ?? response;

      let ordersData: Order[] = [];
      let total = 0;

      if (pageData && pageData.content && Array.isArray(pageData.content)) {
        ordersData = pageData.content;
        total = pageData.totalElements || 0;
      } else if (
        response &&
        response.content &&
        Array.isArray(response.content)
      ) {
        ordersData = response.content;
        total = response.totalElements || 0;
      } else if (Array.isArray(pageData)) {
        ordersData = pageData;
        total = pageData.length;
      } else if (Array.isArray(response)) {
        ordersData = response;
        total = response.length;
      }

      setOrders(ordersData);
      setTotalRows(total);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Không thể tải danh sách đơn hàng");
      setOrders([]);
      setTotalRows(0);
    } finally {
      setLoading(false);
    }
  }, [paginationModel, appliedFilters]);

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

  const handlePaginationModelChange = (newModel: PaginationModel) => {
    setPaginationModel(newModel);
  };

  const handleStatusToggle = (statusValue: string) => {
    setDraftFilters((prev) => {
      const current = prev.status || [];
      const exists = current.includes(statusValue);
      const nextStatus = exists
        ? current.filter((s) => s !== statusValue)
        : [...current, statusValue];
      return { ...prev, status: nextStatus };
    });
  };

  const handleBillFilterToggle = (targetValue: boolean) => {
    setDraftFilters((prev) => ({
      ...prev,
      isBill: prev.isBill === targetValue ? undefined : targetValue,
    }));
  };

  const handlePriceFilterChange = (
    field: "minTotalPrice" | "maxTotalPrice",
    value: number | undefined
  ) => {
    setDraftFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleClearFilters = () => {
    setDraftFilters(INITIAL_ORDER_FILTERS);
    setAppliedFilters(INITIAL_ORDER_FILTERS);
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  };

  const handleApplyFilters = () => {
    setAppliedFilters(draftFilters);
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  };

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
      // Cập nhật optimistic trạng thái đã in ngay trên UI
      setOrders((prev) =>
        prev.map((order) =>
          selectedOrders.includes(order.orderId)
            ? { ...order, isPrinted: true }
            : order
        )
      );
      setSelectedOrders([]);
      await fetchOrders();
    } catch (error) {
      console.error("Error printing selected orders:", error);
      toast.error("Không thể in hóa đơn các đơn đã chọn!");
    } finally {
      setIsPrintingBatch(false);
    }
  };

  const handlePrintAllUnprinted = async () => {
    try {
      setIsPrintingBatch(true);
      const pdfBlob = await exportAllBills(false);
      printPdfBlob(pdfBlob);

      toast.success("Đang mở toàn bộ hóa đơn chưa in...");
      // Cập nhật optimistic toàn bộ đơn hàng hiện tại sang trạng thái đã in
      setOrders((prev) =>
        prev.map((order) => ({ ...order, isPrinted: true }))
      );
      await fetchOrders();
    } catch (error) {
      console.error("Error printing all unprinted orders:", error);
      toast.error("Không có đơn hàng nào chưa in hoặc đã xảy ra lỗi!");
    } finally {
      setIsPrintingBatch(false);
    }
  };

  const handleOrderDetailsOpen = (order: Order) => {
    setSelectedOrder(order);
    setOrderDetailsOpen(true);
  };

  const handleOrderDetailsClose = () => {
    setOrderDetailsOpen(false);
    setSelectedOrder(null);
  };

  const handleUpdateStatus = async (orderId: number, newStatus: string) => {
    try {
      setUpdatingOrderId(orderId);
      setIsUpdatingStatus(true);
      await updateOrderStatus(orderId, newStatus);
      toast.success(`Cập nhật trạng thái đơn hàng #${orderId} thành công!`);

      // Optimistic state update
      setOrders((prev) =>
        prev.map((o) =>
          o.orderId === orderId ? { ...o, status: newStatus } : o
        )
      );
      setSelectedOrder((prev) =>
        prev && prev.orderId === orderId ? { ...prev, status: newStatus } : prev
      );

      await fetchOrders();
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
      toast.error("Không thể cập nhật trạng thái đơn hàng. Vui lòng thử lại!");
    } finally {
      setIsUpdatingStatus(false);
      setUpdatingOrderId(null);
    }
  };

  const handleBatchUpdateStatus = async (newStatus: string) => {
    if (selectedOrders.length === 0) {
      toast.error("Vui lòng chọn ít nhất 1 đơn hàng để đổi trạng thái!");
      return;
    }

    try {
      setIsBatchUpdatingStatus(true);
      await updateBatchOrderStatus(selectedOrders, newStatus);
      toast.success(
        `Đã cập nhật trạng thái thành công cho ${selectedOrders.length} đơn hàng!`
      );
      setSelectedOrders([]);
      await fetchOrders();
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái hàng loạt:", error);
      toast.error("Không thể cập nhật trạng thái các đơn đã chọn!");
    } finally {
      setIsBatchUpdatingStatus(false);
    }
  };

  return {
    orders,
    loading,
    isPrintingBatch,
    isUpdatingStatus,
    updatingOrderId,
    isBatchUpdatingStatus,
    selectedOrders,
    paginationModel,
    totalRows,
    showFilters,
    setShowFilters,
    filters: draftFilters,
    appliedFilters,
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
    handleUpdateStatus,
    handleBatchUpdateStatus,
  };
};

export default useOrderManager;
