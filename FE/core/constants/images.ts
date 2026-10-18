/**
 * Định nghĩa tập trung toàn bộ đường dẫn ảnh tĩnh (Static Images) trong thư mục public/
 * Đảm bảo đường dẫn luôn chính xác và dễ dàng thay thế tài nguyên ảnh khi cần.
 */
export const IMAGES = {
  // Logo & Nhận diện thương hiệu
  LOGO: "/logo.jpg",

  // Ảnh mặc định & Giữ chỗ (Fallback / Placeholder)
  FALLBACK_PRODUCT: "/older.png",
  PLACEHOLDER: "/placeholder.svg",

  // Banners trang chủ
  BANNERS: {
    BANNER_1: "/banner1.png",
    BANNER_2: "/banner2.png",
  },

  // Ảnh hỗ trợ khách hàng & Vận chuyển
  SUPPORT: {
    HOTRO: "/hoTro.jpg",
    TUVAN: "/tuVan.png",
    SHIPPER: "/shipper.jpg",
  },

  // Ảnh sản phẩm demo / mẫu
  DEMO_PRODUCTS: {
    DEMO_1: "/productDemo1.jpg",
    DEMO_2: "/productDemo2.jpg",
    DEMO_3: "/productDemo3.jpg",
    DEMO_4: "/productDemo4.jpg",
    DEMO_5: "/productDemo5.jpg",
    DEMO_6: "/productDemo6.jpg",
  },

  // Ảnh danh mục sản phẩm (Boutique Fashion & Lifestyle)
  CATEGORIES: {
    MEN: "/categories/men.jpg",
    WOMEN: "/categories/women.jpg",
    ACCESSORIES: "/categories/accessories.jpg",
    WELLNESS: "/categories/wellness.jpg",
    COSMETICS: "/categories/cosmetics.jpg",
    HOMEWARE: "/categories/homeware.jpg",
    DEFAULT: "/categories/women.jpg",
  },
} as const;
