"use client";

import React from "react";
import { type Control, type FieldErrors, Controller } from "react-hook-form";
import { Label } from "@/core/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/components/ui/select";
import type { AdministrativeUnit } from "@/core/apis/location";
import type { RegisterFormValues } from "@/core/validations/auth.schema";

interface RegisterAddressFieldsProps {
  control: Control<RegisterFormValues>;
  errors: FieldErrors<RegisterFormValues>;
  provinces: AdministrativeUnit[];
  wards: AdministrativeUnit[];
  isLoadingLocation: boolean;
  onProvinceChange: (code: string) => void;
  onWardChange: (code: string) => void;
}

export const RegisterAddressFields: React.FC<RegisterAddressFieldsProps> = ({
  control,
  errors,
  provinces,
  wards,
  isLoadingLocation,
  onProvinceChange,
  onWardChange,
}) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Tỉnh / Thành phố */}
      <div className="space-y-1.5">
        <Label className="text-xs font-medium text-foreground">
          Tỉnh / Thành phố <span className="text-destructive">*</span>
        </Label>
        <Controller
          name="provinceCode"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value || ""}
              onValueChange={(val) => {
                field.onChange(val);
                onProvinceChange(val);
              }}
              disabled={isLoadingLocation}
            >
              <SelectTrigger className="w-full h-10 rounded-xl border-border text-xs">
                <SelectValue placeholder="Chọn Tỉnh / Thành" />
              </SelectTrigger>
              <SelectContent>
                {provinces.map((item) => (
                  <SelectItem key={item.code} value={item.code} className="text-xs">
                    {item.name_with_type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.provinceCode && (
          <p className="text-xs text-destructive">{errors.provinceCode.message}</p>
        )}
      </div>

      {/* Xã / Phường */}
      <div className="space-y-1.5">
        <Label className="text-xs font-medium text-foreground">
          Xã / Phường <span className="text-destructive">*</span>
        </Label>
        <Controller
          name="wardCode"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value || ""}
              onValueChange={(val) => {
                field.onChange(val);
                onWardChange(val);
              }}
              disabled={wards.length === 0 || isLoadingLocation}
            >
              <SelectTrigger className="w-full h-10 rounded-xl border-border text-xs">
                <SelectValue
                  placeholder={
                    isLoadingLocation
                      ? "Đang tải..."
                      : wards.length === 0
                      ? "Chọn Tỉnh trước"
                      : "Chọn Xã / Phường"
                  }
                />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {wards.map((item) => (
                  <SelectItem key={item.code} value={item.code} className="text-xs">
                    {item.name_with_type}
                    {item.district_name ? ` (${item.district_name})` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.wardCode && (
          <p className="text-xs text-destructive">{errors.wardCode.message}</p>
        )}
      </div>
    </div>
  );
};
