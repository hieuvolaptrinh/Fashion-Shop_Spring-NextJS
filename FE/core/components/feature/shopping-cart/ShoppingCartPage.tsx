"use client";

import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { useShoppingCart } from "@/core/hooks/useShoppingCart";
import { useCheckoutForm } from "@/core/hooks/useCheckoutForm";
import RequireLoginDialog from "@/core/components/ui/dialog-require-login";
import { ROUTES } from "@/core/constants";
import CartItemList from "./CartItemList";
import ShippingAddressForm from "./ShippingAddressForm";
import OrderSummaryCard from "./OrderSummaryCard";
import ShippingInfo from "./ShippingInfo";
import EmptyCartView from "./EmptyCartView";

export const ShoppingCartPage: React.FC = () => {
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  const {
    cartItems,
    loading,
    selected,
    discount,
    subtotal,
    discountAmount,
    shipping,
    total,
    isAllSelected,
    updateQuantity,
    removeItem,
    toggleSelectItem,
    handleCheckAll,
    removeOrderedItems,
  } = useShoppingCart();

  const {
    control,
    register,
    handleSubmit,
    errors,
    isSubmitting,
    isLoadingLocation,
    provinces,
    wards,
    handleProvinceChange,
    handleWardChange,
  } = useCheckoutForm({
    selectedIds: selected,
    cartItems,
    onOrderSuccess: removeOrderedItems,
    onRequireLogin: () => setShowLoginDialog(true),
  });

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Đang tải giỏ hàng của bạn...</p>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return <EmptyCartView />;
  }

  return (
    <div className="min-h-screen py-8 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Giỏ hàng của bạn
          </h1>
          <p className="text-sm text-muted-foreground">
            Bạn đang có <span className="font-semibold text-primary">{cartItems.length} sản phẩm</span> trong giỏ hàng.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8 items-start">
          <div className="space-y-6 lg:col-span-2">
            <CartItemList
              cartItems={cartItems}
              selected={selected}
              isAllSelected={isAllSelected}
              onToggleSelect={toggleSelectItem}
              onCheckAll={handleCheckAll}
              onUpdateQuantity={updateQuantity}
              onRemove={removeItem}
            />

            <ShippingAddressForm
              control={control}
              register={register}
              errors={errors}
              provinces={provinces}
              wards={wards}
              isLoadingLocation={isLoadingLocation}
              selectedCount={selected.length}
              isSubmitting={isSubmitting}
              onProvinceChange={handleProvinceChange}
              onWardChange={handleWardChange}
              onSubmit={handleSubmit}
            />
          </div>

          <div className="lg:col-span-1 space-y-4 lg:sticky lg:top-6">
            <OrderSummaryCard
              subtotal={subtotal}
              discount={discount}
              discountAmount={discountAmount}
              shipping={shipping}
              total={total}
              selectedCount={selected.length}
            />
            <ShippingInfo />
          </div>
        </div>
      </div>

      <RequireLoginDialog
        open={showLoginDialog}
        onClose={() => setShowLoginDialog(false)}
        redirectUrl={ROUTES.USER.CART}
      />
    </div>
  );
};

export default ShoppingCartPage;
