"use client";

import { RotateCcw, Plus } from "lucide-react";
import { Button } from "@/core/components/ui/button";
import ConfirmDelete from "./ConfirmDelete";
import ProductDetails from "./ProductDetails";
import ProductsDataGrid from "./ProductsDataGrid";
import ProductFilterCard from "./ProductFilterCard";
import { useProductManager } from "@/core/hooks/useProductManager";

const ProductManager = () => {
  const {
    products,
    totalRows,
    loading,
    isLoadingProducts,
    paginationModel,
    filters,
    isFilterApplied,
    productTypes,
    selectedProduct,
    isDialogOpen,
    isEditing,
    isViewing,
    isDeleteDialogOpen,
    productToDelete,
    refreshProducts,
    handlePaginationModelChange,
    handleFilterChange,
    toggleFilterType,
    handleApplyFilters,
    handleResetFilters,
    handleAdd,
    handleView,
    handleEdit,
    handleDelete,
    handleConfirmDelete,
    handleCancelDelete,
    handleSave,
    handleCloseDialog,
  } = useProductManager();

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Quản Lý Sản Phẩm
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Quản lý danh mục, giá niêm yết, tồn kho và các gói combo ưu đãi trong hệ thống.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={refreshProducts}
            disabled={isLoadingProducts}
            className="h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground"
            title="Tải lại dữ liệu"
          >
            <RotateCcw
              className={`h-4 w-4 ${isLoadingProducts ? "animate-spin text-primary" : ""}`}
            />
            <span className="sr-only">Tải lại</span>
          </Button>
          <Button
            onClick={handleAdd}
            size="sm"
            className="rounded-xl gap-1.5 font-medium"
          >
            <Plus className="h-4 w-4" />
            <span>Thêm sản phẩm</span>
          </Button>
        </div>
      </div>

      <ProductFilterCard
        filters={filters}
        productTypes={productTypes}
        isFilterApplied={isFilterApplied}
        onFilterChange={handleFilterChange}
        onToggleFilterType={toggleFilterType}
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleResetFilters}
      />

      <ProductsDataGrid
        products={products}
        loading={isLoadingProducts}
        paginationModel={paginationModel}
        totalRows={totalRows}
        onPaginationModelChange={handlePaginationModelChange}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <ProductDetails
        open={isDialogOpen}
        onClose={handleCloseDialog}
        onSave={handleSave}
        product={selectedProduct}
        isEditing={isEditing}
        isViewing={isViewing}
        loading={loading}
      />

      <ConfirmDelete
        open={isDeleteDialogOpen}
        product={productToDelete}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        loading={loading}
      />
    </div>
  );
};

export default ProductManager;
