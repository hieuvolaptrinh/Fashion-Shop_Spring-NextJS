/**
 * Định nghĩa tập trung toàn bộ đường dẫn URL (Routes) của ứng dụng Fashion Shop
 * Giúp tránh lỗi chính tả do gõ tay (typo) và dễ dàng tái cấu trúc URL khi cần.
 */
export const ROUTES = {
  // Phân hệ Quản trị (Admin)
  ADMIN: {
    DASHBOARD: "/admin",
    PRODUCTS: "/admin/products",
    CATEGORIES: "/admin/categories",
    ORDERS: "/admin/orders",
  },

  // Phân hệ Khách hàng (User)
  USER: {
    HOME: "/",
    PRODUCTS: "/products",
    PRODUCT_DETAIL: (slug: string, id: number | string) =>
      `/products/${slug}-${id}.html`,
    CART: "/shopping-cart",
    ORDERS: "/orders",
    ABOUT: "/about-us",
    CONTACT: "/contact",
  },

  // Phân hệ Xác thực (Auth)
  AUTH: {
    LOGIN: "/login",
    REGISTER: "/register",
    FORGOT_PASSWORD: "/forgot-password",
    OAUTH2_CALLBACK: "/oauth2/callback",
  },
} as const;
