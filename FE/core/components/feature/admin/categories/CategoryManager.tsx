"use client";

import React from "react";
import { RotateCcw, Plus, Search, X } from "lucide-react";
import { Button } from "@/core/components/ui/button";
import { Input } from "@/core/components/ui/input";
import { Card, CardContent } from "@/core/components/ui/card";
import { CategoryStatsCards } from "./CategoryStatsCards";
import { CategoriesDataGrid } from "./CategoriesDataGrid";
import { CategoryDialog } from "./CategoryDialog";
import { ConfirmDeleteCategoryDialog } from "./ConfirmDeleteCategoryDialog";
import { useCategoryManager } from "@/core/hooks/useCategoryManager";

export default function CategoryManager() {
  const {
    categories,
    totalRows,
    loading,
    searchQuery,
    setSearchQuery,
    paginationModel,
    setPaginationModel,
    stats,
    // Add/Edit Dialog
    isDialogOpen,
    editingCategory,
    isSubmitting,
    handleAdd,
    handleEdit,
    handleCloseDialog,
    handleSave,
    // Delete Dialog
    isDeleteDialogOpen,
    categoryToDelete,
    handleDelete,
    handleCancelDelete,
    handleConfirmDelete,
    // Refresh
    refreshCategories,
  } = useCategoryManager();

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Quản Lý Danh Mục
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Quản lý danh sách phân loại sản phẩm, cập nhật tên và theo dõi số lượng mặt hàng liên kết.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={refreshCategories}
            disabled={loading}
            className="h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground"
            title="Tải lại dữ liệu"
          >
            <RotateCcw
              className={`h-4 w-4 ${loading ? "animate-spin text-primary" : ""}`}
            />
            <span className="sr-only">Tải lại</span>
          </Button>
          <Button
            onClick={handleAdd}
            size="sm"
            className="rounded-xl gap-1.5 font-medium shadow-xs"
          >
            <Plus className="h-4 w-4" />
            <span>Thêm danh mục</span>
          </Button>
        </div>
      </div>

      <CategoryStatsCards stats={stats} loading={loading} />

      <Card className="rounded-2xl border border-border/70 shadow-xs bg-card">
        <CardContent className="p-3.5">
          <div className="flex items-center gap-2 max-w-md relative">
            <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm danh mục theo tên hoặc mã loại..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-9 rounded-xl text-sm h-9 bg-muted/20"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchQuery("")}
                className="absolute right-1 h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground"
                title="Xóa tìm kiếm"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <CategoriesDataGrid
        categories={categories}
        loading={loading}
        paginationModel={paginationModel}
        totalRows={totalRows}
        onPaginationModelChange={setPaginationModel}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <CategoryDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        category={editingCategory}
        onSave={handleSave}
        isSubmitting={isSubmitting}
      />

      <ConfirmDeleteCategoryDialog
        isOpen={isDeleteDialogOpen}
        onClose={handleCancelDelete}
        category={categoryToDelete}
        onConfirm={handleConfirmDelete}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
