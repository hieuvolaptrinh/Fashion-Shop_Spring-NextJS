"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { registerApi } from "@/core/apis/auth";
import { ROUTES } from "@/core/constants";
import {
  type RegisterFormValues,
  registerSchema,
} from "@/core/validations/auth.schema";
import { useGuestGuard } from "./useGuestGuard";
import { useLocationStore } from "@/core/store/useLocationStore";

export const useRegisterForm = () => {
  const router = useRouter();

  // Ngăn chặn người dùng đã đăng nhập vào lại màn hình đăng ký
  const { isCheckingAuth } = useGuestGuard();

  const [districtName, setDistrictName] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      phoneNumber: "",
      fullName: "",
      password: "",
      confirmPassword: "",
      addressName: "",
      provinceCode: "",
      provinceName: "",
      wardCode: "",
      wardName: "",
    },
  });

  const selectedProvince = watch("provinceCode");

  // Danh sách xã tương ứng với tỉnh đang chọn lấy từ store cache
  const wards = useMemo(() => {
    if (!selectedProvince) return [];
    return wardsByProvince[selectedProvince] || [];
  }, [selectedProvince, wardsByProvince]);

  const isLoadingWards = Boolean(
    selectedProvince && loadingWardsByProvince[selectedProvince]
  );
  const isLoadingLocation = isLoadingProvinces || isLoadingWards;

  // Tải danh sách tỉnh thành khi khởi tạo (0ms nếu đã có trong localStorage cache)
  useEffect(() => {
    fetchProvinces();
  }, [fetchProvinces]);

  // Xử lý khi người dùng chọn Tỉnh / Thành phố
  const handleProvinceChange = (provinceCode: string) => {
    const selectedName = getProvinceName(provinceCode);
    setValue("provinceCode", provinceCode, { shouldValidate: true });
    setValue("provinceName", selectedName);

    // Reset Xã / Phường phụ thuộc
    setDistrictName("");
    setValue("wardCode", "", { shouldValidate: false });
    setValue("wardName", "");

    if (provinceCode) {
      fetchWards(provinceCode).catch((err) => {
        console.error("Lỗi khi tải danh sách phường/xã:", err);
      });
    }
  };

  // Xử lý khi người dùng chọn Xã / Phường
  const handleWardChange = (wardCode: string) => {
    const selectedWardName = getWardName(selectedProvince, wardCode);
    const selectedDistName = getDistrictName(selectedProvince, wardCode);
    setValue("wardCode", wardCode, { shouldValidate: true });
    setValue("wardName", selectedWardName);
    if (selectedDistName) {
      setDistrictName(selectedDistName);
    }
  };

  // Xử lý submit form
  const onSubmit = async (values: RegisterFormValues) => {
    try {
      setIsSubmitting(true);
      const message = await registerApi({
        phoneNumber: values.phoneNumber,
        fullName: values.fullName,
        password: values.password,
        addressRequest: {
          addressName: values.addressName,
          provinceName: values.provinceName,
          districtName: districtName || "",
          wardName: values.wardName,
          provinceCode: values.provinceCode,
          wardCode: values.wardCode,
        },
      });

      toast.success(message || "Đăng ký tài khoản thành công!");

      setTimeout(() => {
        router.push(ROUTES.AUTH.LOGIN);
      }, 1200);
    } catch (error: any) {
      console.error("Lỗi khi đăng ký tài khoản:", error);
      const errorMsg =
        error?.response?.data?.message ||
        error?.message ||
        "Số điện thoại đã tồn tại hoặc dữ liệu không hợp lệ.";
      toast.error(errorMsg);
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
    isCheckingAuth,
    provinces,
    wards,
    isLoadingLocation,
    handleProvinceChange,
    handleWardChange,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
  };
};

export default useRegisterForm;
