import type { PaginationModel } from "@/core/components/feature/admin/common/AdminDataTable";
import type { OrderFilterRequest } from "@/core/apis/order";
import type { ProductFiltersState } from "@/core/lib/type";

/**
 * Cấu hình phân trang mặc định cho các bảng dữ liệu quản trị
 */
export const DEFAULT_PAGINATION: PaginationModel = {
  page: 0,
  pageSize: 10,
};

/**
 * Tùy chọn số lượng bản ghi hiển thị trên mỗi trang
 */
export const PAGE_SIZE_OPTIONS: number[] = [10, 20, 50];

/**
 * Danh sách tùy chọn trạng thái đơn hàng phục vụ bộ lọc tìm kiếm
 */
export const ORDER_STATUS_OPTIONS = [
  { value: "PENDING", label: "Chờ xử lý" },
  { value: "CONFIRMED", label: "Đã xác nhận" },
  { value: "SHIPPING", label: "Đang giao" },
  { value: "DELIVERED", label: "Đã giao" },
  { value: "CANCELLED", label: "Đã hủy" },
];

/**
 * Trạng thái khởi tạo bộ lọc đơn hàng
 */
export const INITIAL_ORDER_FILTERS: OrderFilterRequest = {
  status: [],
  userId: undefined,
  isPay: undefined,
  isBill: undefined,
  minTotalPrice: undefined,
  maxTotalPrice: undefined,
};

/**
 * Trạng thái khởi tạo bộ lọc sản phẩm
 */
export const INITIAL_PRODUCT_FILTERS: ProductFiltersState = {
  productName: "",
  minSalePrice: "",
  maxSalePrice: "",
  typeId: [],
};
