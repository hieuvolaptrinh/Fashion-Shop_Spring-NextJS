import { IMAGES } from "@/core/constants";
import type { CategoryItem } from "@/core/lib/type";

export const CATEGORY_FALLBACK_IMAGES = [
  IMAGES.CATEGORIES.MEN,
  IMAGES.CATEGORIES.WOMEN,
  IMAGES.CATEGORIES.OUTERWEAR,
  IMAGES.CATEGORIES.JEANS,
  IMAGES.CATEGORIES.ACCESSORIES,
  IMAGES.CATEGORIES.SHOES,
];

/**
 * Nhận diện ảnh danh mục mẫu theo từ khóa trong tên danh mục
 */
export function getCategoryFallbackImage(
  typeName?: string | null,
  fallbackIndex = 0
): string {
  const name = (typeName || "").toLowerCase().trim();

  // 1. Áo khoác & Blazer
  if (
    name.includes("khoác") ||
    name.includes("blazer") ||
    name.includes("jacket") ||
    name.includes("vest") ||
    name.includes("bomber") ||
    name.includes("cardigan")
  ) {
    return IMAGES.CATEGORIES.OUTERWEAR;
  }

  // 2. Quần & Jeans
  if (
    name.includes("quần") ||
    name.includes("jean") ||
    name.includes("kaki") ||
    name.includes("trousers") ||
    name.includes("short")
  ) {
    return IMAGES.CATEGORIES.JEANS;
  }

  // 3. Giày dép & Sneaker
  if (
    name.includes("giày") ||
    name.includes("sneaker") ||
    name.includes("dép") ||
    name.includes("sandal") ||
    name.includes("boot") ||
    name.includes("guốc")
  ) {
    return IMAGES.CATEGORIES.SHOES;
  }

  // 4. Phụ kiện thời trang
  if (
    name.includes("phụ kiện") ||
    name.includes("túi") ||
    name.includes("ví") ||
    name.includes("nón") ||
    name.includes("mũ") ||
    name.includes("thắt lưng") ||
    name.includes("kính")
  ) {
    return IMAGES.CATEGORIES.ACCESSORIES;
  }

  // 5. Thời trang Nam
  if (name.includes("nam")) return IMAGES.CATEGORIES.MEN;

  // 6. Thời trang Nữ
  if (name.includes("nữ") || name.includes("váy") || name.includes("đầm")) {
    return IMAGES.CATEGORIES.WOMEN;
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
