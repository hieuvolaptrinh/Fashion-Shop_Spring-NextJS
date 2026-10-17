import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { clearAuth, getAuthStatus, saveAuth } from "@/core/lib/authUtils";
import { getUser } from "@/core/apis/user";
import type { UserResponse, AddressResponse } from "@/core/lib/type";
import { useCartStore } from "./cartStore";

export interface AuthState {
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: string | null;
  token: string | null;
  profile: UserResponse | null;
  isLoadingProfile: boolean;
  isInitialized: boolean;

  login: (token: string, userName: string, roles?: string[]) => void;
  logout: () => void;
  syncAuth: () => void;
  fetchProfile: () => Promise<UserResponse | null>;
  setProfile: (profile: UserResponse | null) => void;
  updateProfileAddress: (address: AddressResponse) => void;
}

/**
 * Zustand Store quản lý trạng thái xác thực và hồ sơ người dùng toàn cục (Store Self-Lifecycle):
 * - Tự động đồng bộ phản ứng tức thì giữa Header, Cart và Route Guard
 * - Quản lý trọn vẹn User Profile (UserResponse: số điện thoại, danh sách địa chỉ)
 * - Tự động lưu cache bền vững vào localStorage (persist) giúp tải 0ms khi F5/mở trang
 * - Tự động revalidate ngầm khi khởi tạo/đăng nhập
 * - Đồng bộ đa tab (Cross-tab sync qua window event "storage")
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      isAdmin: false,
      user: null,
      token: null,
      profile: null,
      isLoadingProfile: false,
      isInitialized: false,

      login: (token: string, userName: string, roles: string[] = []) => {
        saveAuth(token, userName);
        const isAdmin = roles.includes("ADMIN");
        set({
          isAuthenticated: true,
          isAdmin,
          user: userName,
          token,
          isInitialized: true,
        });

        // Tự động tải số lượng giỏ hàng sau khi đăng nhập thành công
        useCartStore.getState().fetchCartQuantity();

        // Tự động tải trọn vẹn Profile (số điện thoại, địa chỉ)
        get().fetchProfile();
      },

      logout: () => {
        clearAuth();
        set({
          isAuthenticated: false,
          isAdmin: false,
          user: null,
          token: null,
          profile: null,
          isInitialized: true,
        });

        // Tự động reset giỏ hàng về 0 khi đăng xuất
        useCartStore.getState().setQuantity(0);
      },

      fetchProfile: async () => {
        const { isAuthenticated, token } = get();
        if (!isAuthenticated && !token) return null;

        set({ isLoadingProfile: true });
        try {
          const userData = await getUser();
          if (userData) {
            set({ profile: userData, isLoadingProfile: false });
            return userData;
          }
        } catch (error) {
          console.warn("Không thể tải thông tin profile người dùng:", error);
        } finally {
          set({ isLoadingProfile: false });
        }
        return null;
      },

      setProfile: (profile: UserResponse | null) => {
        set({ profile });
      },

      updateProfileAddress: (address: AddressResponse) => {
        const currentProfile = get().profile;
        if (!currentProfile) return;

        const currentAddresses = currentProfile.listAddress || [];
        const index = currentAddresses.findIndex(
          (a) => a.addressId === address.addressId
        );
        let updatedList: AddressResponse[];

        if (index >= 0) {
          updatedList = [...currentAddresses];
          updatedList[index] = address;
        } else {
          // Thêm mới vào đầu danh sách làm địa chỉ mặc định
          updatedList = [address, ...currentAddresses];
        }

        set({
          profile: {
            ...currentProfile,
            listAddress: updatedList,
          },
        });
      },

      syncAuth: () => {
        const status = getAuthStatus();
        const token =
          typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

        set({
          isAuthenticated: status.isAuthenticated,
          isAdmin: status.isAdmin,
          user: status.user,
          token,
          isInitialized: true,
        });

        // Tự động đồng bộ giỏ hàng theo trạng thái xác thực
        if (status.isAuthenticated) {
          useCartStore.getState().fetchCartQuantity();
          // Revalidate ngầm thông tin Profile mới nhất từ server
          get().fetchProfile();
        } else {
          useCartStore.getState().setQuantity(0);
          set({ profile: null });
        }
      },
    }),
    {
      name: "fashion_shop_auth_store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        isAdmin: state.isAdmin,
        user: state.user,
        token: state.token,
        profile: state.profile,
      }),
    }
  )
);

// Tự động khởi tạo và lắng nghe đồng bộ giữa các tab trình duyệt
if (typeof window !== "undefined") {
  // Đồng bộ phiên ngay khi client nạp module
  setTimeout(() => {
    useAuthStore.getState().syncAuth();
  }, 0);

  // Lắng nghe sự kiện storage: Khi đăng nhập/đăng xuất ở tab A, tab B tự động cập nhật
  window.addEventListener("storage", (event) => {
    if (event.key === "accessToken" || event.key === "user") {
      useAuthStore.getState().syncAuth();
    }
  });
}
