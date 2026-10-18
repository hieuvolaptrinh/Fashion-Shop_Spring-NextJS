"use client";

import React from "react";
import { Controller, type Control, type FieldErrors, type UseFormRegister } from "react-hook-form";
import { CreditCard, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { Button } from "@/core/components/ui/button";
import { Input } from "@/core/components/ui/input";
import { Label } from "@/core/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/components/ui/select";
import { REGEX_PATTERNS } from "@/core/constants";
import type { CheckoutFormValues } from "@/core/hooks/useCheckoutForm";
import type { AdministrativeUnit } from "@/core/apis/location";

interface ShippingAddressFormProps {
  control: Control<CheckoutFormValues>;
  register: UseFormRegister<CheckoutFormValues>;
  errors: FieldErrors<CheckoutFormValues>;
  provinces: AdministrativeUnit[];
  wards: AdministrativeUnit[];
  isLoadingLocation?: boolean;
  selectedCount: number;
  isSubmitting: boolean;
  onProvinceChange: (code: string) => void;
  onWardChange: (code: string) => void;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
}

export const ShippingAddressForm: React.FC<ShippingAddressFormProps> = ({
  control,
  register,
  errors,
  provinces,
  wards,
  isLoadingLocation = false,
  selectedCount,
  isSubmitting,
  onProvinceChange,
  onWardChange,
  onSubmit,
}) => {
  return (
    <Card className="border border-border/60 bg-card shadow-xs">
      <CardHeader className="border-b border-border/60 px-5 py-4">
        <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
          <span>Thông tin giao hàng</span>
        </CardTitle>
      </CardHeader>

      <form onSubmit={onSubmit}>
        <CardContent className="p-4 sm:p-5 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="phoneNumber" className="text-xs font-medium text-foreground">
                Số điện thoại liên hệ <span className="text-destructive">*</span>
              </Label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="Ví dụ: 0988888888"
                className="h-9 rounded-lg border-border"
                {...register("phoneNumber", {
                  required: "Vui lòng nhập số điện thoại",
                  pattern: {
                    value: REGEX_PATTERNS.PHONE_VN,
                    message: "Số điện thoại không hợp lệ (Ví dụ: 0988888888)",
                  },
                })}
              />
              {errors.phoneNumber && (
                <p className="text-xs text-destructive">
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="streetHouse" className="text-xs font-medium text-foreground">
                Địa chỉ chi tiết (Số nhà, tên đường) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="streetHouse"
                type="text"
                placeholder="Ví dụ: 123 Đường Nguyễn Trãi"
                className="h-9 rounded-lg border-border"
                {...register("streetHouse", {
                  required: "Vui lòng nhập địa chỉ cụ thể",
                })}
              />
              {errors.streetHouse && (
                <p className="text-xs text-destructive">
                  {errors.streetHouse.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-foreground">
                Tỉnh / Thành phố <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="province"
                control={control}
                rules={{ required: "Vui lòng chọn tỉnh/thành phố" }}
                render={({ field }) => (
                  <Select
                    value={field.value || undefined}
                    onValueChange={(val) => {
                      field.onChange(val);
                      onProvinceChange(val);
                    }}
                    disabled={isLoadingLocation && provinces.length === 0}
                  >
                    <SelectTrigger className="h-9 w-full rounded-lg border-border">
                      <SelectValue placeholder="Chọn Tỉnh / Thành" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {provinces.map((p) => (
                        <SelectItem key={p.code} value={p.code}>
                          {p.name_with_type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.province && (
                <p className="text-xs text-destructive">
                  {errors.province.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-foreground">
                Phường / Xã <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="ward"
                control={control}
                rules={{ required: "Vui lòng chọn phường/xã" }}
                render={({ field }) => (
                  <Select
                    value={field.value || undefined}
                    onValueChange={(val) => {
                      field.onChange(val);
                      onWardChange(val);
                    }}
                    disabled={isLoadingLocation || (wards.length === 0 && !field.value)}
                  >
                    <SelectTrigger className="h-9 w-full rounded-lg border-border">
                      <SelectValue
                        placeholder={
                          isLoadingLocation
                            ? "Đang tải phường/xã..."
                            : wards.length === 0
                            ? "Chọn Tỉnh trước"
                            : "Chọn Phường / Xã"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {wards.map((w, idx) => (
                        <SelectItem key={`${w.code}-${idx}`} value={w.code}>
                          {w.name_with_type}
                          {w.district_name ? ` (${w.district_name})` : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.ward && (
                <p className="text-xs text-destructive">
                  {errors.ward.message}
                </p>
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter className="border-t border-border/60 p-4 sm:p-5">
          <Button
            type="submit"
            className="w-full h-11 rounded-xl text-sm font-medium shadow-sm gap-2"
            disabled={selectedCount === 0 || isSubmitting || isLoadingLocation}
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CreditCard className="h-4 w-4" />
            )}
            <span>
              {isSubmitting
                ? "Đang xử lý đơn hàng..."
                : isLoadingLocation
                ? "Đang tải thông tin địa chỉ..."
                : `Đặt hàng ngay (${selectedCount} sản phẩm)`}
            </span>
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ShippingAddressForm;
