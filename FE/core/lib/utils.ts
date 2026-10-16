import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format số tiền sang định dạng tiền tệ VNĐ (ví dụ: 450.000 ₫)
 */
export function formatCurrency(val: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(val || 0);
}

/**
 * Format chuỗi thời gian sang định dạng ngày tháng Việt Nam (DD/MM/YYYY)
 */
export function formatDate(dateStr?: string | Date): string {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return String(dateStr);
  }
}
