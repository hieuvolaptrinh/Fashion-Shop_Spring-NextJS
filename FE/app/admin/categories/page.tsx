import type { Metadata } from "next";
import CategoryManager from "@/core/components/feature/admin/categories/CategoryManager";

export const metadata: Metadata = {
  title: "Quản lý danh mục | Admin Fashion Shop",
  description: "Trang quản lý danh mục và phân loại sản phẩm trong hệ thống",
};

export default function CategoriesPage() {
  return <CategoryManager />;
}
