import Print from "@mui/icons-material/Print";
import Receipt from "@mui/icons-material/Receipt";
import Visibility from "@mui/icons-material/Visibility";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
  GridSortModel,
} from "@mui/x-data-grid";

// Types
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

interface OrdersDataGridProps {
  orders: Order[];
  loading: boolean;
  selectedOrders: number[];
  paginationModel: GridPaginationModel;
  totalRows: number;
  sortModel: GridSortModel;
  onPaginationModelChange: (newModel: GridPaginationModel) => void;
  onSortModelChange: (newModel: GridSortModel) => void;
  onOrderSelection: (orderId: number, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  onOrderDetailsOpen: (order: Order) => void;
}

const OrdersDataGrid = ({
  orders,
  loading,
  selectedOrders,
  paginationModel,
  totalRows,
  sortModel,
  onPaginationModelChange,
  onSortModelChange,
  onOrderSelection,
  onSelectAll,
  onOrderDetailsOpen,
}: OrdersDataGridProps) => {
  // Define columns (removed items and pay columns)
  const columns: GridColDef[] = [
    {
      field: "select",
      headerName: "",
      width: 50,
      sortable: false,
      renderHeader: () => (
        <Tooltip title="Chọn tất cả (bao gồm cả bill đã in)" arrow>
          <Checkbox
            checked={
              selectedOrders.length > 0 &&
              selectedOrders.length === orders.length
            }
            indeterminate={
              selectedOrders.length > 0 && selectedOrders.length < orders.length
            }
            onChange={(e) => onSelectAll(e.target.checked)}
            disabled={orders.length === 0}
            size="small"
          />
        </Tooltip>
      ),
      renderCell: (params) => (
        <Checkbox
          checked={selectedOrders.includes(params.row.orderId)}
          onChange={(e) =>
            onOrderSelection(params.row.orderId, e.target.checked)
          }
          size="small"
        />
      ),
    },
    {
      field: "orderId",
      headerName: "Mã đơn hàng",
      width: 120,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight={600} color="primary">
          #{params.value}
        </Typography>
      ),
    },
    {
      field: "createAt",
      headerName: "Ngày tạo",
      width: 120,
      renderCell: (params) => (
        <Typography variant="body2">
          {new Date(params.value).toLocaleDateString("vi-VN")}
        </Typography>
      ),
    },
    {
      field: "phoneNumber",
      headerName: "Số điện thoại",
      width: 130,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight={500}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: "totalPrice",
      headerName: "Tổng tiền",
      width: 130,
      type: "number",
      renderCell: (params) => (
        <Typography variant="body2" fontWeight={600} color="error.main">
          {params.value.toLocaleString("vi-VN")}₫
        </Typography>
      ),
    },
    {
      field: "shippingAddress",
      headerName: "Địa chỉ giao hàng",
      width: 300,
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: 280,
          }}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: "bill",
      headerName: "In bill",
      width: 100,
      renderCell: (params) => (
        <Tooltip
          title={params.value ? "Đã in bill - có thể in lại" : "Chưa in bill"}
          arrow
        >
          <Chip
            icon={params.value ? <Receipt /> : <Print />}
            label={params.value ? "Đã in" : "Chưa in"}
            color={params.value ? "success" : "warning"}
            size="small"
            variant="outlined"
          />
        </Tooltip>
      ),
    },
    {
      field: "actions",
      headerName: "Thao tác",
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <Tooltip title="Xem chi tiết">
          <IconButton
            size="small"
            color="info"
            onClick={() => onOrderDetailsOpen(params.row)}
          >
            <Visibility fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  return (
    <Paper
      sx={{
        borderRadius: 2,
        overflow: "hidden",
        height: "calc(100vh - 200px)", // Fixed height container
        display: "flex",
        flexDirection: "column",
      }}
    >
      <DataGrid
        rows={orders}
        columns={columns}
        getRowId={(row) => row.orderId}
        loading={loading}
        paginationMode="server"
        sortingMode="client"
        // Pagination
        paginationModel={paginationModel}
        onPaginationModelChange={onPaginationModelChange}
        rowCount={totalRows}
        pageSizeOptions={[5, 10, 25, 50]}
        // Sorting
        sortModel={sortModel}
        onSortModelChange={onSortModelChange}
        // Styling
        sx={{
          border: "none",
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "1px solid rgba(224, 224, 224, 1)",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "rgba(0, 0, 0, 0.02)",
            borderBottom: "2px solid rgba(224, 224, 224, 1)",
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: 600,
          },
          "& .MuiDataGrid-row:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.02)",
          },
        }}
        // Other props
        autoHeight
        disableRowSelectionOnClick
        localeText={{
          noRowsLabel: "Chưa có đơn hàng nào",
          footerRowSelected: (count) => `${count} đơn hàng được chọn`,
        }}
      />
    </Paper>
  );
};

export default OrdersDataGrid;
