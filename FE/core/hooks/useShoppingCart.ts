"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  getShoppingCart,
  putShoppingCart,
  deleteShoppingCart,
} from "@/core/apis/shopping-cart";
import { useCartStore } from "@/core/store/cartStore";
import { getAuthStatus } from "@/core/lib/authUtils";
import type { CartItem } from "@/core/lib/type";
import { SHIPPING_CONFIG } from "@/core/constants";
import { toast } from "sonner";

export const useShoppingCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selected, setSelected] = useState<number[]>([]);
  const [discount] = useState<number>(0);

  const fetchShoppingCart = useCallback(async () => {
    try {
      setLoading(true);
      const { isAuthenticated } = getAuthStatus();

      let items: CartItem[] = [];

      if (isAuthenticated) {
        const res = await getShoppingCart();
        items = res?.data?.items ?? res?.items ?? [];
      } else {
        // Khách chưa đăng nhập: Lấy giỏ hàng từ LocalStorage
        items = useCartStore.getState().loadGuestCart();
      }

      setCartItems(items);

      // Tự động tích chọn tất cả sản phẩm còn hàng
      const inStockItemIds = items
        .filter((item) => (item.product?.quantity ?? 0) > 0)
        .map((item) => item.cartDetailId);
      setSelected(inStockItemIds);
    } catch (error) {
      console.error("Lỗi khi tải giỏ hàng:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchShoppingCart();
  }, [fetchShoppingCart]);

  const updateQuantity = async (id: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      await removeItem(id);
      return;
    }

    const { isAuthenticated } = getAuthStatus();

    try {
      if (isAuthenticated) {
        await putShoppingCart({
          cartDetailId: id,
          quantity: newQuantity,
        });
      } else {
        useCartStore.getState().updateGuestCartQuantity(id, newQuantity);
      }

      setCartItems((items) =>
        items.map((item) =>
          item.cartDetailId === id ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      console.error("Lỗi khi cập nhật số lượng:", error);
      toast.error("Không thể cập nhật số lượng sản phẩm");
    }
  };

  const removeItem = async (id: number) => {
    const { isAuthenticated } = getAuthStatus();

    try {
      if (isAuthenticated) {
        await deleteShoppingCart(id);
      } else {
        useCartStore.getState().removeGuestCartItem(id);
      }

      setCartItems((items) => items.filter((item) => item.cartDetailId !== id));
      setSelected((prev) => prev.filter((itemId) => itemId !== id));
      await useCartStore.getState().fetchCartQuantity();
      toast.success("Đã xóa sản phẩm khỏi giỏ hàng");
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      toast.error("Không thể xóa sản phẩm khỏi giỏ hàng");
    }
  };

  const toggleSelectItem = (id: number) => {
    const targetItem = cartItems.find((item) => item.cartDetailId === id);
    // Không cho chọn sản phẩm hết hàng
    if (targetItem && (targetItem.product?.quantity ?? 0) <= 0) {
      toast.error("Sản phẩm đã hết hàng, không thể chọn để thanh toán");
      return;
    }

    setSelected((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  // Chỉ tính các mặt hàng còn hàng
  const inStockItems = useMemo(
    () => cartItems.filter((item) => (item.product?.quantity ?? 0) > 0),
    [cartItems]
  );

  const isAllSelected =
    inStockItems.length > 0 && selected.length === inStockItems.length;

  const handleCheckAll = () => {
    if (isAllSelected) {
      setSelected([]);
    } else {
      setSelected(inStockItems.map((item) => item.cartDetailId));
    }
  };

  const subtotal = useMemo(() => {
    return cartItems
      .filter(
        (item) =>
          selected.includes(item.cartDetailId) &&
          (item.product?.quantity ?? 0) > 0
      )
      .reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cartItems, selected]);

  const discountAmount = useMemo(() => subtotal * discount, [subtotal, discount]);
  const shipping = useMemo(
    () =>
      subtotal > SHIPPING_CONFIG.FREE_SHIPPING_THRESHOLD || subtotal === 0
        ? 0
        : SHIPPING_CONFIG.DEFAULT_SHIPPING_FEE,
    [subtotal]
  );
  const total = useMemo(
    () => subtotal - discountAmount + shipping,
    [subtotal, discountAmount, shipping]
  );

  const removeOrderedItems = (orderedIds: number[]) => {
    setCartItems((prev) =>
      prev.filter((item) => !orderedIds.includes(item.cartDetailId))
    );
    setSelected([]);
    useCartStore.getState().fetchCartQuantity();
  };

  return {
    cartItems,
    loading,
    selected,
    discount,
    subtotal,
    discountAmount,
    shipping,
    total,
    isAllSelected,
    fetchShoppingCart,
    updateQuantity,
    removeItem,
    toggleSelectItem,
    handleCheckAll,
    removeOrderedItems,
  };
};

export default useShoppingCart;
