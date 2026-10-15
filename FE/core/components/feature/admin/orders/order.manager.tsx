"use client";

import { getAllOrders } from "@/core/apis/order";
import FilterList from "@mui/icons-material/FilterList";
import Print from "@mui/icons-material/Print";
import Refresh from "@mui/icons-material/Refresh";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Collapse from "@mui/material/Collapse";
import Container from "@mui/material/Container";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { GridPaginationModel, GridSortModel } from "@mui/x-data-grid";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import OrderDetails from "./orderDetails";
import OrdersDataGrid from "./ordersDataGrid";

// Types
interface OrderFilterRequest {
  status?: string[];
  userId?: number;
  isPay?: boolean;
  isBill?: boolean;
  minTotalPrice?: number;
  maxTotalPrice?: number;
  page?: number;
  size?: number;
}

interface OrderItem {
  orderDetailId: number;
  product: {
    productId: number;
    productName: string;
    originalPrice: number;
    salePrice: number;
    listImages: Array<{ imageId: number; link: string }>;
  };
  quantity: number;
  price: number;
}

interface Order {
  orderId: number;
  createAt: string;
  status: string;
  totalPrice: number;
  userId: number;
  shippingAddress: string;
  phoneNumber: string;
  items: OrderItem[];
  bill: boolean;
  pay: boolean;
}

interface PageResponse {
  content: Order[];
  totalElements: number;
  totalPages: number;
  pageNumber: number;
  size: number;
}

const OrderManager = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState<number[]>([]);

  // Pagination
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });
  const [totalRows, setTotalRows] = useState(0);

  // Sorting
  const [sortModel, setSortModel] = useState<GridSortModel>([]);

  // Filter states
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<OrderFilterRequest>({
    status: [],
    userId: undefined,
    isPay: undefined,
    isBill: undefined,
    minTotalPrice: undefined,
    maxTotalPrice: undefined,
  });

  // Dialog states
  const [orderDetailsOpen, setOrderDetailsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Status options
  const statusOptions = [
    { value: "PENDING", label: "Chờ xử lý" },
    { value: "CONFIRMED", label: "Đã xác nhận" },
    { value: "SHIPPING", label: "Đang giao" },
    { value: "DELIVERED", label: "Đã giao" },
    { value: "CANCELLED", label: "Đã hủy" },
  ];

  // Fetch orders function
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const filterParams: OrderFilterRequest = {
        page: paginationModel.page,
        size: paginationModel.pageSize,
        ...filters,
      };

      // Remove undefined values
      Object.keys(filterParams).forEach((key) => {
        const value = filterParams[key as keyof OrderFilterRequest];
        // @ts-ignore
        if (value === undefined || value === null || value === "") {
          delete filterParams[key as keyof OrderFilterRequest];
        }
      });

      const response: PageResponse = await getAllOrders(
        filterParams,
        localStorage.getItem("accessToken") || "",
      );

      if (response?.content && Array.isArray(response.content)) {
        // Map the response data to match our interface
        const mappedOrders = response.content.map((order: any) => ({
          ...order,
          bill: order.bill || order.isBill || false,
          pay: order.pay || order.isPay || false,
        }));

        setOrders(mappedOrders);
        setTotalRows(response.totalElements || 0);
      } else {
        console.warn("Invalid response structure:", response);
        setOrders([]);
        setTotalRows(0);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
      setTotalRows(0);
    } finally {
      setLoading(false);
    }
  }, [paginationModel, filters]);

  // Handle pagination change
  const handlePaginationModelChange = (newModel: GridPaginationModel) => {
    setPaginationModel(newModel);
  };

  // Handle sort change
  const handleSortModelChange = (newModel: GridSortModel) => {
    setSortModel(newModel);
  };

  // Handle row selection
  const handleOrderSelection = (orderId: number, checked: boolean) => {
    if (checked) {
      setSelectedOrders([...selectedOrders, orderId]);
    } else {
      setSelectedOrders(selectedOrders.filter((id) => id !== orderId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      // Cho phép chọn tất cả đơn hàng (cả đã in và chưa in)
      const allOrderIds = orders.map((order) => order.orderId);
      setSelectedOrders(allOrderIds);
    } else {
      setSelectedOrders([]);
    }
  };

  // Filter handlers
  const handleFilterChange = (key: keyof OrderFilterRequest, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      status: [],
      userId: undefined,
      isPay: undefined,
      isBill: undefined,
      minTotalPrice: undefined,
      maxTotalPrice: undefined,
    });
  };

  const handleApplyFilters = () => {
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
    fetchOrders();
  };

  // Print functions
  const handlePrintSelected = async () => {
    try {
      const localStorageToken = localStorage.getItem("accessToken");
      if (!localStorageToken) {
        throw new Error("No access token provided");
      }

      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const res = await axios.post(
        `${API_URL}/api/v1/bills/export-multiple`,
        selectedOrders,
        {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${localStorageToken}`,
            Accept: "application/pdf",
            "Content-Type": "application/json",
          },
        },
      );

      const pdfBlob = new Blob([res.data], { type: "application/pdf" });
      const pdfUrl = URL.createObjectURL(pdfBlob);

      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.src = pdfUrl;

      iframe.onload = () => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      };
      document.body.appendChild(iframe);

      // Refresh data after printing
      setTimeout(() => {
        fetchOrders();
      }, 1000);
    } catch (error) {
      console.error("Error printing selected orders:", error);
    }
  };

  const handlePrintAllUnprinted = async () => {
    try {
      const localStorageToken = localStorage.getItem("accessToken");
      if (!localStorageToken) {
        throw new Error("No access token provided");
      }

      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const res = await axios.get(
        `${API_URL}/api/v1/bills/export-all-invoice`,
        {
          params: { printed: false },
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${localStorageToken}`,
            Accept: "application/pdf",
          },
        },
      );

      const pdfBlob = new Blob([res.data], { type: "application/pdf" });
      const pdfUrl = URL.createObjectURL(pdfBlob);

      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.src = pdfUrl;

      iframe.onload = () => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      };
      document.body.appendChild(iframe);

      // Refresh data after printing
      setTimeout(() => {
        fetchOrders();
      }, 1000);
    } catch (error) {
      console.error("Error printing all unprinted orders:", error);
    }
  };

  // Get unpaid orders count
  const unprintedCount = orders.filter((order) => !order.bill).length;

  // Effects
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Auto refresh every 5 minutes
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchOrders();
    }, 300000);
    return () => clearInterval(intervalId);
  }, [fetchOrders]);

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Page Header */}
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <Box>
          <Typography
            variant="h4"
            component="h1"
            sx={{ fontWeight: 700, color: "text.primary", mb: 1 }}
          >
            Quản lý đơn hàng
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary" }}>
            Quản lý và theo dõi các đơn hàng trong hệ thống
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Tooltip title="Bộ lọc">
            <IconButton
              onClick={() => setShowFilters(!showFilters)}
              sx={{
                bgcolor: showFilters ? "action.selected" : "action.hover",
                "&:hover": { bgcolor: "action.selected" },
              }}
            >
              <FilterList />
            </IconButton>
          </Tooltip>
          <Tooltip title="Tải lại dữ liệu">
            <IconButton
              onClick={() => fetchOrders()}
              disabled={loading}
              sx={{
                bgcolor: "action.hover",
                "&:hover": { bgcolor: "action.selected" },
              }}
            >
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Filter Panel */}
      <Collapse in={showFilters}>
        <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Bộ lọc tìm kiếm
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 3,
            }}
          >
            <FormControl fullWidth size="small">
              <InputLabel>Trạng thái</InputLabel>
              <Select
                multiple
                value={filters.status || []}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                label="Trạng thái"
              >
                {statusOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              size="small"
              label="ID người dùng"
              type="number"
              value={filters.userId || ""}
              onChange={(e) =>
                handleFilterChange(
                  "userId",
                  e.target.value ? parseInt(e.target.value) : undefined,
                )
              }
            />

            <TextField
              fullWidth
              size="small"
              label="Giá tối thiểu"
              type="number"
              value={filters.minTotalPrice || ""}
              onChange={(e) =>
                handleFilterChange(
                  "minTotalPrice",
                  e.target.value ? parseFloat(e.target.value) : undefined,
                )
              }
            />

            <TextField
              fullWidth
              size="small"
              label="Giá tối đa"
              type="number"
              value={filters.maxTotalPrice || ""}
              onChange={(e) =>
                handleFilterChange(
                  "maxTotalPrice",
                  e.target.value ? parseFloat(e.target.value) : undefined,
                )
              }
            />

            <FormControlLabel
              control={
                <Switch
                  checked={filters.isPay === true}
                  onChange={(e) =>
                    handleFilterChange(
                      "isPay",
                      e.target.checked ? true : undefined,
                    )
                  }
                />
              }
              label="Đã thanh toán"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={filters.isBill === true}
                  onChange={(e) =>
                    handleFilterChange(
                      "isBill",
                      e.target.checked ? true : undefined,
                    )
                  }
                />
              }
              label="Đã in bill"
            />

            <Box>
              <Button
                variant="contained"
                onClick={handleApplyFilters}
                sx={{ mr: 1 }}
              >
                Áp dụng
              </Button>
              <Button variant="outlined" onClick={handleClearFilters}>
                Xóa bộ lọc
              </Button>
            </Box>
          </Box>
        </Paper>
      </Collapse>

      {/* Print Actions */}
      <Card sx={{ mb: 3, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Bạn có thể chọn và in lại các đơn hàng đã in bill trước đó
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="contained"
              startIcon={<Print />}
              onClick={handlePrintAllUnprinted}
              disabled={unprintedCount === 0 || loading}
              sx={{ borderRadius: 2 }}
            >
              In tất cả bill chưa in ({unprintedCount})
            </Button>
            <Button
              variant="outlined"
              startIcon={<Print />}
              onClick={handlePrintSelected}
              disabled={selectedOrders.length === 0 || loading}
              sx={{ borderRadius: 2 }}
            >
              In bill đã chọn ({selectedOrders.length})
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* DataGrid */}
      <OrdersDataGrid
        orders={orders}
        loading={loading}
        selectedOrders={selectedOrders}
        paginationModel={paginationModel}
        totalRows={totalRows}
        sortModel={sortModel}
        onPaginationModelChange={handlePaginationModelChange}
        onSortModelChange={handleSortModelChange}
        onOrderSelection={handleOrderSelection}
        onSelectAll={handleSelectAll}
        onOrderDetailsOpen={(order) => {
          setSelectedOrder(order);
          setOrderDetailsOpen(true);
        }}
      />

      {/* Order Details Dialog */}
      <OrderDetails
        open={orderDetailsOpen}
        onClose={() => {
          setOrderDetailsOpen(false);
          setSelectedOrder(null);
        }}
        order={selectedOrder}
      />
    </Container>
  );
};

export default OrderManager;
