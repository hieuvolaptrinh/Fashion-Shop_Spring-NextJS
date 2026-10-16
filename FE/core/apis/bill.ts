import apiClient from "@/core/lib/apiClient";
import { API_ENDPOINTS } from "@/core/constants";

/**
 * Xuất file PDF hóa đơn hàng loạt cho danh sách các mã đơn hàng
 */
export async function exportMultipleBills(orderIds: number[]): Promise<Blob> {
  const response = await apiClient.post(
    API_ENDPOINTS.BILLS.EXPORT_MULTIPLE,
    orderIds,
    {
      responseType: "blob",
      headers: {
        Accept: "application/pdf",
        "Content-Type": "application/json",
      },
    }
  );
  return new Blob([response.data], { type: "application/pdf" });
}

/**
 * Xuất tất cả hóa đơn (lọc theo trạng thái đã in hoặc chưa in)
 */
export async function exportAllBills(printed: boolean = false): Promise<Blob> {
  const response = await apiClient.get(API_ENDPOINTS.BILLS.EXPORT_ALL, {
    params: { printed },
    responseType: "blob",
    headers: {
      Accept: "application/pdf",
    },
  });
  return new Blob([response.data], { type: "application/pdf" });
}

/**
 * Xuất một hóa đơn đơn lẻ theo ID đơn hàng
 */
export async function exportSingleBill(orderId: number): Promise<Blob> {
  const response = await apiClient.get(
    API_ENDPOINTS.BILLS.EXPORT_SINGLE(orderId),
    {
      responseType: "blob",
      headers: {
        Accept: "application/pdf",
      },
    }
  );
  return new Blob([response.data], { type: "application/pdf" });
}
