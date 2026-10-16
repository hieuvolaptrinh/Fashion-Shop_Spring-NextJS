import type { Combo, Product } from "@/core/lib/type";
import { formatCurrency } from "@/core/lib/utils";

export interface ProductValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Pure Validator kiểm tra tính hợp lệ của dữ liệu biểu mẫu sản phẩm và các gói combo.
 * Không phụ thuộc vào React hooks hoặc UI components, thuận tiện cho việc viết Unit Tests.
 */
export function validateProductForm(
  formData: Product,
  combos: Combo[] = []
): ProductValidationResult {
  const errors: Record<string, string> = {};

  if (!formData.productName || !formData.productName.trim()) {
    errors.productName = "Tên sản phẩm không được để trống";
  }

  if (!formData.description || !formData.description.trim()) {
    errors.description = "Mô tả sản phẩm không được để trống";
  }

  if (typeof formData.originalPrice !== "number" || formData.originalPrice <= 0) {
    errors.originalPrice = "Giá gốc phải lớn hơn 0";
  }

  if (typeof formData.salePrice !== "number" || formData.salePrice <= 0) {
    errors.salePrice = "Giá bán phải lớn hơn 0";
  }

  if (typeof formData.quantity !== "number" || formData.quantity < 0) {
    errors.quantity = "Số lượng không được âm";
  }

  if (!formData.usageInstructions || !formData.usageInstructions.trim()) {
    errors.usageInstructions = "Hướng dẫn sử dụng không được để trống";
  }

  if (!formData.ingredients || !formData.ingredients.trim()) {
    errors.ingredients = "Thành phần không được để trống";
  }

  if (
    !(formData.manufactureDate instanceof Date) ||
    isNaN(formData.manufactureDate.getTime())
  ) {
    errors.manufactureDate = "Hạn sử dụng không hợp lệ";
  }

  combos.forEach((combo, index) => {
    if (typeof combo.quantityInCombo !== "number" || combo.quantityInCombo <= 0) {
      errors[`combo_${index}_quantity`] = `Số lượng combo ${index + 1} phải lớn hơn 0`;
    }

    if (typeof combo.comboPrice !== "number" || combo.comboPrice <= 0) {
      errors[`combo_${index}_price`] = `Giá combo ${index + 1} phải lớn hơn 0`;
    }

    if (
      combo.quantityInCombo > 0 &&
      typeof formData.salePrice === "number" &&
      formData.salePrice > 0 &&
      combo.comboPrice >= formData.salePrice * combo.quantityInCombo
    ) {
      const retailTotal = formatCurrency(formData.salePrice * combo.quantityInCombo);
      errors[`combo_${index}_price`] = `Giá combo ${index + 1} phải nhỏ hơn giá mua lẻ (${retailTotal})`;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export default validateProductForm;
