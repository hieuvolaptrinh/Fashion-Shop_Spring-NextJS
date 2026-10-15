import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";
import LocalOffer from "@mui/icons-material/LocalOffer";
import Visibility from "@mui/icons-material/Visibility";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
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
interface ListImages {
  imageId: string;
  link: string;
}

interface ListTypes {
  typeId: string;
  typeName: string;
}

interface Product {
  productId: string;
  productName: string;
  originalPrice: number;
  usageInstructions: string;
  description: string;
  ingredients: string;
  salePrice: number;
  quantity: number;
  manufactureDate: Date;
  listImages: ListImages[];
  listTypes: ListTypes[];
  listCombo?: any[];
}

interface ProductsDataGridProps {
  products: Product[];
  loading: boolean;
  paginationModel: GridPaginationModel;
  totalRows: number;
  sortModel: GridSortModel;
  onPaginationModelChange: (newModel: GridPaginationModel) => void;
  onSortModelChange: (newModel: GridSortModel) => void;
  onView: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

const ProductsDataGrid = ({
  products,
  loading,
  paginationModel,
  totalRows,
  sortModel,
  onPaginationModelChange,
  onSortModelChange,
  onView,
  onEdit,
  onDelete,
}: ProductsDataGridProps) => {
  // Define columns
  const columns: GridColDef[] = [
    {
      field: "listImages",
      headerName: "Hình ảnh",
      width: 80,
      sortable: false,
      renderCell: (params) => (
        <Avatar
          src={params.value?.[0]?.link || ""}
          variant="rounded"
          sx={{ width: 50, height: 50 }}
        />
      ),
    },
    {
      field: "productName",
      headerName: "Tên sản phẩm",
      width: 250,
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{
            fontWeight: 500,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            maxWidth: 230,
          }}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: "originalPrice",
      headerName: "Giá gốc",
      width: 120,
      type: "number",
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{
            textDecoration: "line-through",
            color: "text.secondary",
          }}
        >
          {params.value.toLocaleString("vi-VN")}₫
        </Typography>
      ),
    },
    {
      field: "salePrice",
      headerName: "Giá bán",
      width: 120,
      type: "number",
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            color: "error.main",
          }}
        >
          {params.value.toLocaleString("vi-VN")}₫
        </Typography>
      ),
    },
    {
      field: "quantity",
      headerName: "Số lượng",
      width: 100,
      type: "number",
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          color={
            params.value > 50
              ? "success"
              : params.value > 10
                ? "warning"
                : "error"
          }
          variant="outlined"
        />
      ),
    },
    {
      field: "listTypes",
      headerName: "Loại sản phẩm",
      width: 200,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
          {params.value.slice(0, 2).map((type: ListTypes) => (
            <Chip
              key={type.typeId}
              label={type.typeName}
              size="small"
              variant="outlined"
              sx={{ fontSize: "0.75rem" }}
            />
          ))}
          {params.value.length > 2 && (
            <Chip
              label={`+${params.value.length - 2}`}
              size="small"
              variant="outlined"
              sx={{ fontSize: "0.75rem" }}
            />
          )}
        </Box>
      ),
    },
    {
      field: "listCombo",
      headerName: "Combo",
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {params.value && params.value.length > 0 ? (
            <Tooltip
              title={`${params.value.length} combo${params.value.length > 1 ? "s" : ""} khả dụng`}
            >
              <Chip
                icon={<LocalOffer />}
                label={params.value.length}
                size="small"
                color="secondary"
                variant="outlined"
              />
            </Tooltip>
          ) : (
            <Typography variant="body2" color="text.disabled">
              -
            </Typography>
          )}
        </Box>
      ),
    },
    {
      field: "actions",
      headerName: "Thao tác",
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 0.5 }}>
          <Tooltip title="Xem chi tiết">
            <IconButton
              size="small"
              color="info"
              onClick={() => onView(params.row)}
            >
              <Visibility fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <IconButton
              size="small"
              color="primary"
              onClick={() => onEdit(params.row)}
            >
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Xóa">
            <IconButton
              size="small"
              color="error"
              onClick={() => onDelete(params.row)}
            >
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
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
        rows={products}
        columns={columns}
        getRowId={(row) => row.productId}
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
          height: "100%", // Take full height of container
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
          "& .MuiDataGrid-virtualScroller": {
            overflowY: "auto", // Enable vertical scroll
          },
        }}
        // Other props
        disableRowSelectionOnClick
        localeText={{
          noRowsLabel: "Chưa có sản phẩm nào",
          footerRowSelected: (count) => `${count} sản phẩm được chọn`,
        }}
      />
    </Paper>
  );
};

export default ProductsDataGrid;
