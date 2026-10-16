"use client";

import { useEffect, useState } from "react";
import { useDashboardStore } from "@/core/store/dashboardStore";

/**
 * Custom Hook kết nối với Zustand Store (useDashboardStore)
 * Tối ưu hóa render phía client (SSR hydration safety) và cung cấp hàm refresh()
 */
export function useAdminDashboard() {
  const [mounted, setMounted] = useState<boolean>(false);
  const { loading, data, error, fetchDashboardData } = useDashboardStore();

  useEffect(() => {
    setMounted(true);
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    loading,
    mounted,
    data,
    error,
    refresh: () => fetchDashboardData(true),
  };
}

export default useAdminDashboard;
