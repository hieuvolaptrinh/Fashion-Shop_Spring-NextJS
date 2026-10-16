import { create } from "zustand";
import {
  getDashboardSummary,
  DashboardSummary,
} from "@/core/apis/dashboard";

interface DashboardState {
  loading: boolean;
  error: string | null;
  data: DashboardSummary;
  lastFetched: number | null;
  fetchDashboardData: (force?: boolean) => Promise<void>;
  reset: () => void;
}

const INITIAL_SUMMARY: DashboardSummary = {
  totalOrders: 0,
  totalProducts: 0,
  totalRevenue: 0,
  recentOrders: [],
  orderStatusData: [],
  revenueData: [],
};

// Cache dữ liệu trong 60 giây (trừ khi người dùng bấm nút Làm mới force=true)
const CACHE_DURATION_MS = 60 * 1000;

export const useDashboardStore = create<DashboardState>((set, get) => ({
  loading: true,
  error: null,
  data: INITIAL_SUMMARY,
  lastFetched: null,

  fetchDashboardData: async (force = false) => {
    const { lastFetched, data } = get();
    const now = Date.now();

    // Nếu đã có dữ liệu và chưa hết hạn cache (và không phải ép làm mới force), dùng lại cache
    if (!force && lastFetched && now - lastFetched < CACHE_DURATION_MS && data.totalOrders > 0) {
      set({ loading: false });
      return;
    }

    try {
      set({ loading: true, error: null });
      const summary = await getDashboardSummary();
      set({
        data: summary,
        lastFetched: Date.now(),
        loading: false,
      });
    } catch (err: any) {
      console.error("useDashboardStore: Lỗi tải dữ liệu Dashboard:", err);
      set({
        error: err?.message || "Không thể tải dữ liệu bảng điều khiển.",
        loading: false,
      });
    }
  },

  reset: () => set({ data: INITIAL_SUMMARY, lastFetched: null, loading: false }),
}));

export default useDashboardStore;
