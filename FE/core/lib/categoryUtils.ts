import { IMAGES } from "@/core/constants";
import type { CategoryItem } from "@/core/lib/type";

export const CATEGORY_FALLBACK_IMAGES = [
  IMAGES.CATEGORIES.MEN,
  IMAGES.CATEGORIES.WOMEN,
  IMAGES.CATEGORIES.ACCESSORIES,
  IMAGES.CATEGORIES.WELLNESS,
  IMAGES.CATEGORIES.COSMETICS,
  IMAGES.CATEGORIES.HOMEWARE,
];

/**
 * Nhận diện ảnh danh mục mẫu theo từ khóa trong tên danh mục
 */
export function getCategoryFallbackImage(
  typeName?: string | null,
  fallbackIndex = 0
): string {
  const name = (typeName || "").toLowerCase().trim();

  if (name.includes("nam")) return IMAGES.CATEGORIES.MEN;
  if (name.includes("nữ") || name.includes("váy") || name.includes("đầm")) {
    return IMAGES.CATEGORIES.WOMEN;
  }
  if (
    name.includes("phụ kiện") ||
    name.includes("giày") ||
    name.includes("túi") ||
    name.includes("dép") ||
    name.includes("sneaker") ||
    name.includes("nón") ||
    name.includes("thắt lưng")
  ) {
    return IMAGES.CATEGORIES.ACCESSORIES;
  }
  if (
    name.includes("sức khỏe") ||
    name.includes("trà") ||
    name.includes("dưỡng nhan") ||
    name.includes("thảo mộc")
  ) {
    return IMAGES.CATEGORIES.WELLNESS;
  }
  if (
    name.includes("mỹ phẩm") ||
    name.includes("làm đẹp") ||
    name.includes("skincare") ||
    name.includes("son") ||
    name.includes("kem")
  ) {
    return IMAGES.CATEGORIES.COSMETICS;
  }
  if (
    name.includes("gia dụng") ||
    name.includes("bình") ||
    name.includes("nhà cửa") ||
    name.includes("tiện ích")
  ) {
    return IMAGES.CATEGORIES.HOMEWARE;
  }

  // Fallback luân phiên theo danh sách ảnh thời trang cao cấp
  return (
    CATEGORY_FALLBACK_IMAGES[fallbackIndex % CATEGORY_FALLBACK_IMAGES.length] ||
    IMAGES.CATEGORIES.DEFAULT
  );
}

/**
 * Lấy ảnh danh mục: ưu tiên ảnh từ Database / Admin upload, nếu chưa có thì fallback ảnh mẫu local
 */
export function getCategoryImage(
  category?: Partial<CategoryItem> | null,
  fallbackIndex = 0
): string {
  if (category?.imageUrl && category.imageUrl.trim().length > 0) {
    return category.imageUrl.trim();
  }
  return getCategoryFallbackImage(category?.typeName, fallbackIndex);
}
