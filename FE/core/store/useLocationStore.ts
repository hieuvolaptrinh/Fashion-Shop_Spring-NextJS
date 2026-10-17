import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  type AdministrativeUnit,
  fetchProvinces as apiFetchProvinces,
  fetchWardsByProvince as apiFetchWardsByProvince,
} from "@/core/apis/location";

export interface LocationState {
  provinces: AdministrativeUnit[];
  wardsByProvince: Record<string, AdministrativeUnit[]>;
  isLoadingProvinces: boolean;
  loadingWardsByProvince: Record<string, boolean>;

  // Actions
  fetchProvinces: () => Promise<AdministrativeUnit[]>;
  fetchWards: (provinceCode: string) => Promise<AdministrativeUnit[]>;
  getProvinceName: (provinceCode?: string) => string;
  getWardName: (provinceCode?: string, wardCode?: string) => string;
  getDistrictName: (provinceCode?: string, wardCode?: string) => string;
}

/**
 * Zustand Store quản lý địa giới hành chính toàn cục (Tỉnh / Thành phố & Phường / Xã):
 * - Tự động lưu cache vĩnh viễn vào localStorage (persist) tránh fetch lặp lại.
 * - Khi mở trang: Dữ liệu có sẵn tức thì (0ms) từ cache.
 * - Danh sách Phường / Xã nạp theo từng Tỉnh và được gom nhóm theo mã tỉnh.
 */
export const useLocationStore = create<LocationState>()(
  persist(
    (set, get) => ({
      provinces: [],
      wardsByProvince: {},
      isLoadingProvinces: false,
      loadingWardsByProvince: {},

      fetchProvinces: async () => {
        const currentProvinces = get().provinces;
        if (currentProvinces && currentProvinces.length > 0) {
          return currentProvinces;
        }

        set({ isLoadingProvinces: true });
        try {
          const list = await apiFetchProvinces();
          set({ provinces: list || [], isLoadingProvinces: false });
          return list || [];
        } catch (error) {
          console.error("Lỗi khi tải danh sách Tỉnh/Thành trong LocationStore:", error);
          set({ isLoadingProvinces: false });
          return currentProvinces;
        }
      },

      fetchWards: async (provinceCode: string) => {
        if (!provinceCode) return [];
        const cleanCode = String(provinceCode).trim();

        const cachedWards = get().wardsByProvince[cleanCode];
        if (cachedWards && cachedWards.length > 0) {
          return cachedWards;
        }

        set((state) => ({
          loadingWardsByProvince: {
            ...state.loadingWardsByProvince,
            [cleanCode]: true,
          },
        }));

        try {
          const wards = await apiFetchWardsByProvince(cleanCode);
          set((state) => ({
            wardsByProvince: {
              ...state.wardsByProvince,
              [cleanCode]: wards || [],
            },
            loadingWardsByProvince: {
              ...state.loadingWardsByProvince,
              [cleanCode]: false,
            },
          }));
          return wards || [];
        } catch (error) {
          console.error(
            `Lỗi khi tải danh sách Phường/Xã cho tỉnh ${cleanCode} trong LocationStore:`,
            error
          );
          set((state) => ({
            loadingWardsByProvince: {
              ...state.loadingWardsByProvince,
              [cleanCode]: false,
            },
          }));
          return [];
        }
      },

      getProvinceName: (provinceCode?: string) => {
        if (!provinceCode) return "";
        const clean = String(provinceCode).trim();
        const found = get().provinces.find((p) => p.code === clean);
        return found ? found.name_with_type : "";
      },

      getWardName: (provinceCode?: string, wardCode?: string) => {
        if (!provinceCode || !wardCode) return "";
        const cleanProv = String(provinceCode).trim();
        const cleanWard = String(wardCode).trim();
        const wards = get().wardsByProvince[cleanProv] || [];
        const found = wards.find((w) => w.code === cleanWard);
        return found ? found.name_with_type : "";
      },

      getDistrictName: (provinceCode?: string, wardCode?: string) => {
        if (!provinceCode || !wardCode) return "";
        const cleanProv = String(provinceCode).trim();
        const cleanWard = String(wardCode).trim();
        const wards = get().wardsByProvince[cleanProv] || [];
        const found = wards.find((w) => w.code === cleanWard);
        return found?.district_name || "";
      },
    }),
    {
      name: "fashion_shop_location_store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        provinces: state.provinces,
        wardsByProvince: state.wardsByProvince,
      }),
    }
  )
);
