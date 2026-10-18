"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/core/apis/categories";
import type { CategoryItem } from "@/core/lib/type";
import type { PaginationModel } from "@/core/components/feature/admin/common/AdminDataTable";

export function useCategoryManager() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [paginationModel, setPaginationModel] = useState<PaginationModel>({
    page: 0,
    pageSize: 10,
  });

  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);

  // Delete State
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryItem | null>(null);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Fetch Categories
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getCategories();
      setCategories(data || []);
    } catch (error) {
      console.error("Lỗi khi tải danh sách danh mục:", error);
      toast.error("Không thể tải danh sách danh mục");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Lọc theo từ khóa tìm kiếm
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    const query = searchQuery.trim().toLowerCase();
    return categories.filter(
      (cat) =>
        cat.typeName.toLowerCase().includes(query) ||
        String(cat.typeId).includes(query)
    );
  }, [categories, searchQuery]);

  // Phân trang dữ liệu
  const paginatedCategories = useMemo(() => {
    const start = paginationModel.page * paginationModel.pageSize;
    return filteredCategories.slice(start, start + paginationModel.pageSize);
  }, [filteredCategories, paginationModel]);

  // Thống kê nhanh
  const stats = useMemo(() => {
    const total = categories.length;
    const withProducts = categories.filter((c) => (c.productCount ?? 0) > 0).length;
    const empty = total - withProducts;
    const totalProductsCount = categories.reduce(
      (acc, c) => acc + (c.productCount ?? 0),
      0
    );

    return {
      total,
      withProducts,
      empty,
      totalProductsCount,
    };
  }, [categories]);

  // Mở Dialog thêm mới
  const handleAdd = () => {
    setEditingCategory(null);
    setIsDialogOpen(true);
  };

  // Mở Dialog chỉnh sửa
  const handleEdit = (category: CategoryItem) => {
    setEditingCategory(category);
    setIsDialogOpen(true);
  };

  // Đóng Dialog thêm/sửa
  const handleCloseDialog = () => {
    if (isSubmitting) return;
    setIsDialogOpen(false);
    setEditingCategory(null);
  };

  // Lưu danh mục (Tạo mới hoặc Cập nhật)
  const handleSave = async (typeName: string, imageUrl?: string) => {
    const trimmed = typeName.trim();
    if (!trimmed) {
      toast.error("Tên danh mục không được để trống");
      return;
    }

    setIsSubmitting(true);
    try {
      const cleanImageUrl = imageUrl?.trim() || undefined;
      if (editingCategory) {
        await updateCategory(editingCategory.typeId, {
          typeName: trimmed,
          imageUrl: cleanImageUrl,
        });
        toast.success(`Đã cập nhật danh mục "${trimmed}" thành công!`);
      } else {
        await createCategory({
          typeName: trimmed,
          imageUrl: cleanImageUrl,
        });
        toast.success(`Đã thêm danh mục "${trimmed}" thành công!`);
      }
      setIsDialogOpen(false);
      setEditingCategory(null);
      await fetchCategories();
    } catch (error: any) {
      console.error("Lỗi khi lưu danh mục:", error);
      const msg = error?.response?.data?.message || "Không thể lưu danh mục";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mở dialog xác nhận xóa
  const handleDelete = (category: CategoryItem) => {
    setCategoryToDelete(category);
    setIsDeleteDialogOpen(true);
  };

  // Đóng dialog xóa
  const handleCancelDelete = () => {
    if (isSubmitting) return;
    setIsDeleteDialogOpen(false);
    setCategoryToDelete(null);
  };

  // Thực hiện xóa danh mục
  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;

    setIsSubmitting(true);
    try {
      await deleteCategory(categoryToDelete.typeId);
      toast.success(
        `Đã xóa danh mục "${categoryToDelete.typeName}". Các sản phẩm liên quan đã được tự động gỡ phân loại.`
      );
      setIsDeleteDialogOpen(false);
      setCategoryToDelete(null);
      await fetchCategories();
    } catch (error: any) {
      console.error("Lỗi khi xóa danh mục:", error);
      const msg = error?.response?.data?.message || "Không thể xóa danh mục này";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    categories: paginatedCategories,
    totalRows: filteredCategories.length,
    loading,
    searchQuery,
    setSearchQuery,
    paginationModel,
    setPaginationModel,
    stats,
    // Dialog Add/Edit
    isDialogOpen,
    editingCategory,
    isSubmitting,
    handleAdd,
    handleEdit,
    handleCloseDialog,
    handleSave,
    // Dialog Delete
    isDeleteDialogOpen,
    categoryToDelete,
    handleDelete,
    handleCancelDelete,
    handleConfirmDelete,
    // Refresh
    refreshCategories: fetchCategories,
  };
}
