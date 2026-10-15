import { create } from "zustand";
import { getShoppingCart } from "../apis/shopping-cart";

interface CartStore {
  quantity: number;
  fetchCartQuantity: () => Promise<void>;
  setQuantity: (q: number) => void;
}

export const useCartStore = create<CartStore>((set) => ({
  quantity: 0,
  setQuantity: (q) => set({ quantity: q }),
  fetchCartQuantity: async () => {
    try {
      const res = await getShoppingCart();

      const total = res.data.items.length;
      set({ quantity: total });
    } catch (error) {
      console.error("Lỗi khi lấy số lượng giỏ hàng:", error);
    }
  },
}));
