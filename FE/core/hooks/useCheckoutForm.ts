"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { addAddressApi, updateAddressApi } from "@/core/apis/user";
import { postOrder } from "@/core/apis/order";
import { ROUTES } from "@/core/constants";
import { getAuthStatus } from "@/core/lib/authUtils";
import type { UserResponse, AddressResponse, AddressRequest, CartItem } from "@/core/lib/type";
import { useLocationStore } from "@/core/store/useLocationStore";
import { useAuthStore } from "@/core/store/authStore";
import { toast } from "sonner";

export interface CheckoutFormValues {
  phoneNumber: string;
  streetHouse: string;
  province: string;
  ward: string;
}

interface UseCheckoutFormProps {
  selectedIds: number[];
  cartItems?: CartItem[];
  onOrderSuccess: (selectedIds: number[]) => void;
  onRequireLogin?: () => void;
}

export const useCheckoutForm = ({
  selectedIds,
  cartItems = [],
  onOrderSuccess,
  onRequireLogin,
}: UseCheckoutFormProps) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedAddress, setSavedAddress] = useState<AddressResponse | null>(null);

  const { profile, fetchProfile, updateProfileAddress } = useAuthStore();

  const {
    provinces,
    wardsByProvince,
    isLoadingProvinces,
    loadingWardsByProvince,
    fetchProvinces,
    fetchWards,
    getProvinceName,
    getWardName,
    getDistrictName,
  } = useLocationStore();

  const {
    control,
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    defaultValues: {
      phoneNumber: "",
      streetHouse: "",
      province: "",
      ward: "",
    },
  });

  const selectedProvince = watch("province");
  const selectedWard = watch("ward");

  const wards = useMemo(() => {
    if (!selectedProvince) return [];
    return wardsByProvince[selectedProvince] || [];
  }, [selectedProvince, wardsByProvince]);

  const isLoadingWards = Boolean(
    selectedProvince && loadingWardsByProvince[selectedProvince]
  );
  const isLoadingLocation = isLoadingProvinces || isLoadingWards;

  const populateFromUser = useCallback(
    (userObj: UserResponse | null) => {
      if (!userObj) return;

      const defaultAddr =
        userObj.listAddress && userObj.listAddress.length > 0
          ? userObj.listAddress[0]
          : null;
      setSavedAddress(defaultAddr ?? null);

      let targetProvCode = "";
      let targetWardCode = "";

      if (defaultAddr?.provinceCode && defaultAddr?.wardCode) {
        targetProvCode = String(defaultAddr.provinceCode).trim();
        targetWardCode = String(defaultAddr.wardCode).trim();

        fetchWards(targetProvCode).catch((err) =>
          console.error("Lỗi khi tải phường/xã cho địa chỉ mặc định:", err)
        );
      }

      reset({
        phoneNumber: userObj.phoneNumber || "",
        streetHouse: defaultAddr?.addressName || "",
        province: targetProvCode,
        ward: targetWardCode,
      });
    },
    [fetchWards, reset]
  );

  useEffect(() => {
    let isMounted = true;

    if (profile) {
      populateFromUser(profile);
    }

    const initData = async () => {
      try {
        const [, freshProfile] = await Promise.all([
          fetchProvinces(),
          profile ? Promise.resolve(profile) : fetchProfile(),
        ]);

        if (!isMounted) return;

        if (!profile && freshProfile) {
          populateFromUser(freshProfile);
        }
      } catch (err) {
        console.error("Lỗi khởi tạo dữ liệu checkout:", err);
      }
    };

    initData();

    return () => {
      isMounted = false;
    };
  }, [profile, fetchProvinces, fetchProfile, populateFromUser]);

  const handleProvinceChange = useCallback(
    (code: string) => {
      setValue("province", code, { shouldValidate: true });
      setValue("ward", "", { shouldValidate: false });

      if (code) {
        fetchWards(code).catch((err) => {
          console.error("Lỗi khi tải danh sách phường/xã:", err);
          toast.error("Không thể tải danh sách phường/xã");
        });
      }
    },
    [fetchWards, setValue]
  );

  const handleWardChange = useCallback(
    (code: string) => {
      setValue("ward", code, { shouldValidate: true });
    },
    [setValue]
  );

  const fullAddress = useMemo(() => {
    const pName = getProvinceName(selectedProvince);
    const wName = getWardName(selectedProvince, selectedWard);
    const dName = getDistrictName(selectedProvince, selectedWard);
    return [wName, dName, pName].filter(Boolean).join(", ");
  }, [selectedProvince, selectedWard, getProvinceName, getWardName, getDistrictName]);

  const onSubmit = async (data: CheckoutFormValues) => {
    if (selectedIds.length === 0) {
      toast.error("Vui lòng chọn ít nhất một sản phẩm để thanh toán");
      return;
    }

    if (cartItems.length > 0) {
      const violatingItem = cartItems.find(
        (item) =>
          selectedIds.includes(item.cartDetailId) &&
          item.quantity > (item.product?.quantity ?? 0)
      );

      if (violatingItem) {
        const stock = violatingItem.product?.quantity ?? 0;
        toast.error(
          stock > 0
            ? `Sản phẩm "${violatingItem.product.productName}" chỉ còn ${stock} món trong kho (bạn đang chọn ${violatingItem.quantity}). Vui lòng giảm số lượng để thanh toán.`
            : `Sản phẩm "${violatingItem.product.productName}" hiện đã hết hàng. Vui lòng bỏ chọn để thanh toán.`
        );
        return;
      }
    }

    const { isAuthenticated } = getAuthStatus();
    if (!isAuthenticated) {
      if (onRequireLogin) {
        onRequireLogin();
      }
      return;
    }

    try {
      setIsSubmitting(true);

      const currentProvince = getProvinceName(data.province);
      const currentWard = getWardName(data.province, data.ward);
      const currentDistrict = getDistrictName(data.province, data.ward);

      const addressComponents = [
        data.streetHouse,
        currentWard,
        currentDistrict,
        currentProvince,
      ].filter(Boolean);
      const shippingAddress = addressComponents.join(", ");

      // Kiểm tra và cập nhật lại địa chỉ mới vào Database nếu người dùng có thay đổi
      const newAddressRequest: AddressRequest = {
        addressName: data.streetHouse.trim(),
        districtName: currentDistrict.trim(),
        provinceName: currentProvince.trim(),
        wardName: currentWard.trim(),
        provinceCode: data.province || undefined,
        wardCode: data.ward || undefined,
      };

      const isSameAddress =
        savedAddress !== null &&
        savedAddress.addressName?.trim().toLowerCase() ===
          newAddressRequest.addressName.toLowerCase() &&
        ((savedAddress.provinceCode &&
          savedAddress.provinceCode === newAddressRequest.provinceCode) ||
          savedAddress.provinceName?.trim().toLowerCase() ===
            newAddressRequest.provinceName.toLowerCase()) &&
        ((savedAddress.wardCode &&
          savedAddress.wardCode === newAddressRequest.wardCode) ||
          savedAddress.wardName?.trim().toLowerCase() ===
            newAddressRequest.wardName.toLowerCase());

      if (
        !isSameAddress &&
        newAddressRequest.addressName &&
        newAddressRequest.provinceName &&
        newAddressRequest.wardName
      ) {
        try {
          if (savedAddress?.addressId) {
            const updated = await updateAddressApi(
              savedAddress.addressId,
              newAddressRequest
            );
            if (updated) {
              setSavedAddress(updated);
              // Đồng bộ ngay lập tức vào useAuthStore profile toàn cục
              updateProfileAddress(updated);
            }
          } else {
            const created = await addAddressApi(newAddressRequest);
            if (created) {
              setSavedAddress(created);
              // Đồng bộ ngay lập tức vào useAuthStore profile toàn cục
              updateProfileAddress(created);
            }
          }
        } catch (addrErr) {
          console.warn(
            "Không thể lưu cập nhật địa chỉ vào tài khoản trong cơ sở dữ liệu:",
            addrErr
          );
        }
      }

      const res = await postOrder({
        shippingAddress,
        phoneNumber: data.phoneNumber,
        selectedIds,
      });

      if (res?.statusCode === 201 || res?.data?.orderId || (res as any)?.status === 201) {
        toast.success("Đặt hàng thành công!");
        onOrderSuccess(selectedIds);
        router.push(ROUTES.USER.HOME);
      } else {
        toast.error(`Đặt hàng không thành công: ${res?.message || "Lỗi máy chủ"}`);
      }
    } catch (error: any) {
      console.error("Lỗi khi gửi đơn hàng:", error);
      toast.error(error?.response?.data?.message || "Không thể hoàn tất đơn hàng");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    control,
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isSubmitting,
    isLoadingLocation,
    provinces,
    wards,
    fullAddress,
    handleProvinceChange,
    handleWardChange,
  };
};

export default useCheckoutForm;
