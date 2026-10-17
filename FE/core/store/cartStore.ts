import { create } from "zustand";
import { getShoppingCart, postShoppingCart } from "@/core/apis/shopping-cart";
import { getAccessToken } from "@/core/lib/authUtils";
import type { CartItem, Product, Combo } from "@/core/lib/type";

const GUEST_CART_STORAGE_KEY = "fashion_shop_guest_cart";

/**
 * Đọc danh sách sản phẩm giỏ hàng khách từ LocalStorage an toàn (SSR-safe)
 */
export const getLocalGuestCart = (): CartItem[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(GUEST_CART_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch (error) {
    console.error("Lỗi khi đọc giỏ hàng khách từ localStorage:", error);
    return [];
  }
};

/**
 * Lưu danh sách sản phẩm giỏ hàng khách vào LocalStorage
 */
export const saveLocalGuestCart = (items: CartItem[]): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(GUEST_CART_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error("Lỗi khi lưu giỏ hàng khách vào localStorage:", error);
  }
};

/**
 * Xóa sạch giỏ hàng khách khỏi LocalStorage
 */
export const clearLocalGuestCart = (): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(GUEST_CART_STORAGE_KEY);
  } catch (error) {
    console.error("Lỗi khi xóa giỏ hàng khách từ localStorage:", error);
  }
};

interface CartStore {
  quantity: number;
  guestItems: CartItem[];
  setQuantity: (q: number) => void;
  fetchCartQuantity: () => Promise<void>;

  // Thao tác giỏ hàng khách (Guest Cart)
  loadGuestCart: () => CartItem[];
  addToGuestCart: (product: Product, quantity?: number, combo?: Combo) => void;
  updateGuestCartQuantity: (cartDetailId: number, quantity: number) => void;
  removeGuestCartItem: (cartDetailId: number) => void;
  clearGuestCart: () => void;

  // Thao tác thêm vào giỏ hàng thống nhất (tự động xử lý khách / đăng nhập)
  addToCart: (
    product: Product,
    quantity?: number,
    combo?: Combo
  ) => Promise<{ success: boolean; message?: string }>;

  // Đồng bộ giỏ hàng khách lên server sau khi đăng nhập
  syncGuestCartToServer: () => Promise<void>;
}

export const useCartStore = create<CartStore>((set, get) => ({
  quantity: 0,
  guestItems: [],

  setQuantity: (q) => set({ quantity: q }),

  /**
   * Tải số lượng mặt hàng (unique items) trong giỏ:
   * - Nếu đã đăng nhập: lấy từ API server
   * - Nếu chưa đăng nhập: đếm số mặt hàng trong LocalStorage
   */
  fetchCartQuantity: async () => {
    if (typeof window === "undefined") return;
    const token = getAccessToken();

    if (token) {
      try {
        const res = await getShoppingCart();
        const items: CartItem[] = res?.data?.items ?? res?.items ?? [];
        set({ quantity: items.length });
      } catch (error) {
        console.error("Lỗi khi lấy số lượng giỏ hàng từ máy chủ:", error);
      }
    } else {
      const guestItems = getLocalGuestCart();
      set({ guestItems, quantity: guestItems.length });
    }
  },

  /**
   * Đọc giỏ hàng khách hiện tại
   */
  loadGuestCart: () => {
    const items = getLocalGuestCart();
    set({ guestItems: items, quantity: items.length });
    return items;
  },

  /**
   * Thêm sản phẩm vào giỏ hàng khách
   */
  addToGuestCart: (product: Product, quantity = 1, combo?: Combo) => {
    const currentItems = getLocalGuestCart();
    const prodIdStr = String(product.productId);
    const comboId = combo?.comboId || 0;

    const existingIndex = currentItems.findIndex(
      (item) =>
        String(item.product.productId) === prodIdStr &&
        (item.combo?.comboId || 0) === comboId
    );

    let updatedItems: CartItem[];
    const itemPrice = combo ? combo.comboPrice : product.salePrice;

    if (existingIndex > -1) {
      updatedItems = currentItems.map((item, index) => {
        if (index === existingIndex) {
          const newQty = item.quantity + quantity;
          const maxStock = combo
            ? Math.floor(product.quantity / combo.quantityInCombo)
            : product.quantity;
          return {
            ...item,
            quantity: maxStock > 0 ? Math.min(newQty, maxStock) : newQty,
          };
        }
        return item;
      });
    } else {
      const newCartDetailId = -Math.floor(Date.now() + Math.random() * 1000);
      const newItem: CartItem = {
        cartDetailId: newCartDetailId,
        quantity,
        price: itemPrice,
        product,
        combo,
      };
      updatedItems = [...currentItems, newItem];
    }

    saveLocalGuestCart(updatedItems);
    set({ guestItems: updatedItems, quantity: updatedItems.length });
  },

  /**
   * Cập nhật số lượng sản phẩm trong giỏ hàng khách
   */
  updateGuestCartQuantity: (cartDetailId: number, quantity: number) => {
    if (quantity <= 0) {
      get().removeGuestCartItem(cartDetailId);
      return;
    }

    const currentItems = getLocalGuestCart();
    const updatedItems = currentItems.map((item) =>
      item.cartDetailId === cartDetailId ? { ...item, quantity } : item
    );

    saveLocalGuestCart(updatedItems);
    set({ guestItems: updatedItems, quantity: updatedItems.length });
  },

  /**
   * Xóa sản phẩm khỏi giỏ hàng khách
   */
  removeGuestCartItem: (cartDetailId: number) => {
    const currentItems = getLocalGuestCart();
    const updatedItems = currentItems.filter(
      (item) => item.cartDetailId !== cartDetailId
    );

    saveLocalGuestCart(updatedItems);
    set({ guestItems: updatedItems, quantity: updatedItems.length });
  },

  /**
   * Xóa trắng giỏ hàng khách
   */
  clearGuestCart: () => {
    clearLocalGuestCart();
    set({ guestItems: [], quantity: 0 });
  },

  /**
   * Thêm sản phẩm vào giỏ hàng thống nhất:
   * - Nếu chưa đăng nhập: lưu vào giỏ hàng khách LocalStorage
   * - Nếu đã đăng nhập: gọi API máy chủ và cập nhật badge số lượng
   */
  addToCart: async (product: Product, quantity = 1, combo?: Combo) => {
    const token = getAccessToken();
    if (!token) {
      get().addToGuestCart(product, quantity, combo);
      return { success: true };
    }

    try {
      const response = await postShoppingCart({
        productId: Number(product.productId),
        quantity,
        comboId: combo?.comboId || 0,
      });

      if (response?.status === 201 || response?.data || response?.cartDetailId) {
        await get().fetchCartQuantity();
        return { success: true };
      }
      return {
        success: false,
        message: response?.message || "Không thể thêm vào giỏ hàng",
      };
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : "Thêm vào giỏ hàng thất bại";
      return { success: false, message: msg };
    }
  },

  /**
   * Đồng bộ giỏ hàng khách lên server sau khi đăng nhập thành công.
   * Xóa sạch LocalStorage sau khi đồng bộ và cập nhật lại số lượng từ server.
   */
  syncGuestCartToServer: async () => {
    if (typeof window === "undefined") return;
    const token = getAccessToken();
    if (!token) return;

    const guestItems = getLocalGuestCart();
    if (!guestItems || guestItems.length === 0) {
      await get().fetchCartQuantity();
      return;
    }

    try {
      for (const item of guestItems) {
        const pId = Number(item.product?.productId);
        if (!pId) continue;

        try {
          await postShoppingCart({
            productId: pId,
            quantity: item.quantity,
            comboId: item.combo?.comboId || 0,
          });
        } catch (itemErr) {
          console.warn(`Không thể đồng bộ sản phẩm #${pId} lên server:`, itemErr);
        }
      }

      // Xóa giỏ hàng khách sau khi đã đồng bộ
      clearLocalGuestCart();
      set({ guestItems: [] });

      // Cập nhật lại số lượng giỏ hàng từ server
      await get().fetchCartQuantity();
    } catch (error) {
      console.error("Lỗi trong quá trình đồng bộ giỏ hàng lên server:", error);
    }
  },
}));
