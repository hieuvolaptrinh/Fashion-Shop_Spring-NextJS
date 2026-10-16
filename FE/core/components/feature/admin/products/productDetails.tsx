"use client";

import React from "react";
import type { Product } from "@/core/lib/type";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/core/components/ui/dialog";
import { Button } from "@/core/components/ui/button";
import { Input } from "@/core/components/ui/input";
import { Label } from "@/core/components/ui/label";
import { Textarea } from "@/core/components/ui/textarea";
import ComboSection from "./combo.section";
import ProductImagesSection from "./productImagesSection";
import { useProductForm } from "@/core/hooks/useProductForm";

export interface ProductDetailsProps {
  open: boolean;
  onClose: () => void;
  onSave: (product: Product, files: File[], deletedImageIds: string[]) => void;
  product?: Product | null;
  isEditing?: boolean;
  isViewing?: boolean;
  loading?: boolean;
}

export const ProductDetails = ({
  open,
  onClose,
  onSave,
  product,
  isEditing = false,
  isViewing = false,
  loading = false,
}: ProductDetailsProps) => {
  const {
    formData,
    setFormData,
    errors,
    productTypes,
    isLoadingTypes,
    isSubmitting,
    combos,
    addCombo,
    removeCombo,
    updateCombo,
    handleImageUpload,
    handleRemoveImage,
    toggleType,
    handleSave,
  } = useProductForm({
    product,
    isEditing,
    isViewing,
    open,
    onSave,
  });

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl p-6">
        <DialogHeader className="pb-3 border-b">
          <DialogTitle className="text-lg font-bold text-foreground">
            {isViewing
              ? "Chi tiết sản phẩm"
              : isEditing
              ? "Chỉnh sửa sản phẩm"
              : "Thêm sản phẩm mới"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-3">
          {/* Tên sản phẩm */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">
              Tên sản phẩm <span className="text-destructive">*</span>
            </Label>
            <Input
              disabled={isViewing}
              value={formData.productName}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, productName: e.target.value }))
              }
              placeholder="Nhập tên sản phẩm thời trang..."
              className={`rounded-xl text-xs h-9 ${
                errors.productName ? "border-destructive focus-visible:ring-destructive/20" : ""
              }`}
            />
            {errors.productName && (
              <p className="text-[11px] text-destructive font-medium">
                {errors.productName}
              </p>
            )}
          </div>

          {/* Giá gốc & Giá bán */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">
                Giá gốc niêm yết (VNĐ) <span className="text-destructive">*</span>
              </Label>
              <Input
                type="number"
                min={0}
                step={1000}
                disabled={isViewing}
                value={formData.originalPrice}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    originalPrice: Number(e.target.value),
                  }))
                }
                className={`rounded-xl text-xs h-9 ${
                  errors.originalPrice ? "border-destructive focus-visible:ring-destructive/20" : ""
                }`}
              />
              {errors.originalPrice && (
                <p className="text-[11px] text-destructive font-medium">
                  {errors.originalPrice}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">
                Giá bán thực tế (VNĐ) <span className="text-destructive">*</span>
              </Label>
              <Input
                type="number"
                min={0}
                step={1000}
                disabled={isViewing}
                value={formData.salePrice}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    salePrice: Number(e.target.value),
                  }))
                }
                className={`rounded-xl text-xs h-9 font-semibold text-primary ${
                  errors.salePrice ? "border-destructive focus-visible:ring-destructive/20" : ""
                }`}
              />
              {errors.salePrice && (
                <p className="text-[11px] text-destructive font-medium">
                  {errors.salePrice}
                </p>
              )}
            </div>
          </div>

          {/* Tồn kho & Hạn sử dụng */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">
                Số lượng trong kho <span className="text-destructive">*</span>
              </Label>
              <Input
                type="number"
                min={0}
                disabled={isViewing}
                value={formData.quantity}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    quantity: Number(e.target.value),
                  }))
                }
                className={`rounded-xl text-xs h-9 ${
                  errors.quantity ? "border-destructive focus-visible:ring-destructive/20" : ""
                }`}
              />
              {errors.quantity && (
                <p className="text-[11px] text-destructive font-medium">
                  {errors.quantity}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">
                Hạn sử dụng <span className="text-destructive">*</span>
              </Label>
              <Input
                type="date"
                disabled={isViewing}
                value={
                  formData.manufactureDate instanceof Date
                    ? formData.manufactureDate.toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    manufactureDate: new Date(e.target.value),
                  }))
                }
                className={`rounded-xl text-xs h-9 ${
                  errors.manufactureDate ? "border-destructive focus-visible:ring-destructive/20" : ""
                }`}
              />
              {errors.manufactureDate && (
                <p className="text-[11px] text-destructive font-medium">
                  {errors.manufactureDate}
                </p>
              )}
            </div>
          </div>

          {/* Danh mục sản phẩm (Tags) */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold">
              Danh mục loại sản phẩm (Chọn các loại phù hợp)
            </Label>
            <div className="flex flex-wrap gap-2 pt-1">
              {isLoadingTypes ? (
                <span className="text-xs text-muted-foreground">
                  Đang tải danh mục...
                </span>
              ) : productTypes.length === 0 ? (
                <span className="text-xs text-muted-foreground">
                  Chưa có loại sản phẩm nào
                </span>
              ) : (
                productTypes.map((typeItem) => {
                  const isSelected = formData.listTypes.some(
                    (t) => t.typeId === typeItem.typeId
                  );
                  return (
                    <button
                      key={typeItem.typeId}
                      type="button"
                      disabled={isViewing}
                      onClick={() => toggleType(typeItem)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                        isSelected
                          ? "bg-primary text-primary-foreground border-primary shadow-xs"
                          : "bg-background text-muted-foreground border-border hover:bg-muted/50"
                      } ${isViewing ? "cursor-default opacity-80" : "cursor-pointer"}`}
                    >
                      {typeItem.typeName}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Combo Section */}
          <ComboSection
            combos={combos}
            onAddCombo={addCombo}
            onRemoveCombo={removeCombo}
            onUpdateCombo={updateCombo}
            salePrice={formData.salePrice}
            errors={errors}
            isViewing={isViewing}
          />

          {/* Mô tả sản phẩm */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">
              Mô tả sản phẩm <span className="text-destructive">*</span>
            </Label>
            <Textarea
              rows={3}
              disabled={isViewing}
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="Mô tả kiểu dáng, chất liệu, xuất xứ..."
              className={`rounded-xl text-xs ${
                errors.description ? "border-destructive focus-visible:ring-destructive/20" : ""
              }`}
            />
            {errors.description && (
              <p className="text-[11px] text-destructive font-medium">
                {errors.description}
              </p>
            )}
          </div>

          {/* Hướng dẫn sử dụng & Thành phần */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">
                Hướng dẫn sử dụng <span className="text-destructive">*</span>
              </Label>
              <Textarea
                rows={2}
                disabled={isViewing}
                value={formData.usageInstructions}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    usageInstructions: e.target.value,
                  }))
                }
                placeholder="Cách giặt, bảo quản, ủi..."
                className={`rounded-xl text-xs ${
                  errors.usageInstructions ? "border-destructive focus-visible:ring-destructive/20" : ""
                }`}
              />
              {errors.usageInstructions && (
                <p className="text-[11px] text-destructive font-medium">
                  {errors.usageInstructions}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">
                Chất liệu / Thành phần <span className="text-destructive">*</span>
              </Label>
              <Textarea
                rows={2}
                disabled={isViewing}
                value={formData.ingredients}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    ingredients: e.target.value,
                  }))
                }
                placeholder="100% Cotton, lụa tự nhiên, vải đũi..."
                className={`rounded-xl text-xs ${
                  errors.ingredients ? "border-destructive focus-visible:ring-destructive/20" : ""
                }`}
              />
              {errors.ingredients && (
                <p className="text-[11px] text-destructive font-medium">
                  {errors.ingredients}
                </p>
              )}
            </div>
          </div>

          {/* Quản lý hình ảnh (Tách thành sub-component) */}
          <ProductImagesSection
            images={formData.listImages}
            isViewing={isViewing}
            onUpload={handleImageUpload}
            onRemove={handleRemoveImage}
          />
        </div>

        <DialogFooter className="pt-3 border-t flex sm:justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-xl"
          >
            {isViewing ? "Đóng" : "Hủy"}
          </Button>
          {!isViewing && (
            <Button
              type="button"
              onClick={handleSave}
              disabled={loading || isSubmitting}
              className="rounded-xl gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Đang lưu...</span>
                </>
              ) : isEditing ? (
                "Cập nhật"
              ) : (
                "Thêm mới"
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetails;
