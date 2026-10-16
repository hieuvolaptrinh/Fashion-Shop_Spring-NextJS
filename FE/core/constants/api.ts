/**
 * Định nghĩa tập trung toàn bộ Endpoint API kết nối với Spring Boot Backend
 * Giúp tránh sai sót cú pháp URL, hỗ trợ tự động gợi ý code (IntelliSense)
 * và dễ dàng chuyển đổi base URL hoặc phiên bản API (v1 -> v2) khi cần.
 */

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081";

export const API_ENDPOINTS = {
  // Xác thực & Phân quyền (Auth)
  AUTH: {
    LOGIN: "/api/v1/auth/login",
    REGISTER: "/api/v1/auth/register",
  },

  // Đăng nhập bên thứ ba (OAuth2)
  OAUTH2: {
    GOOGLE: "/api/v1/oauth2/google",
    FACEBOOK: "/api/v1/oauth2/facebook",
  },

  // Người dùng & Tài khoản (User)
  USERS: {
    BASE: "/api/v1/users",
    BY_ID: (id: number | string) => `/api/v1/users/${id}`,
  },

  // Sản phẩm & Danh mục (Products & Types)
  PRODUCTS: {
    BASE: "/api/v1/products",
    BY_ID: (id: number | string) => `/api/v1/products/${id}`,
    TYPES: "/api/v1/types",
  },

  // Giỏ hàng (Shopping Cart)
  CARTS: {
    BASE: "/api/v1/carts",
    ITEMS: "/api/v1/carts/items",
    ITEM_BY_ID: (id: number | string) => `/api/v1/carts/items/${id}`,
  },

  // Đơn hàng (Orders)
  ORDERS: {
    BASE: "/api/v1/orders",
    ADMIN_FILTER: "/api/v1/orders/admin/filter",
    BY_ID: (id: number | string) => `/api/v1/orders/${id}`,
  },

  // Hóa đơn & Xuất phiếu (Bills & Invoices)
  BILLS: {
    EXPORT_MULTIPLE: "/api/v1/bills/export-multiple",
    EXPORT_ALL: "/api/v1/bills/export-all-invoice",
    EXPORT_SINGLE: (orderId: number | string) => `/api/v1/bills/export/${orderId}`,
  },

  // Đánh giá & Bình luận (Comments)
  COMMENTS: {
    BASE: "/api/v1/comments",
    BY_PRODUCT: (productId: number | string) =>
      `/api/v1/comments?productId=${productId}`,
  },

  // Tải lên & Quản lý Hình ảnh (Cloudinary Upload)
  IMAGES: {
    UPLOAD: "/api/v1/images/upload",
    DELETE: "/api/v1/images/delete",
  },
} as const;
