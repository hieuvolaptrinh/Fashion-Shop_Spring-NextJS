"use client";

import { registerUser } from "@/core/apis/user";
import { dataProvince } from "@/core/lib/dataProvince";
import Facebook from "@mui/icons-material/Facebook";
import Google from "@mui/icons-material/Google";
import { useTheme } from "@mui/material";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button as ButtonShadcn } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { regexPhoneNumber } from "../shopping-cart/shoppingCartPage";

type ProvinceProps = {
  _id: string;
  name: string;
  slug: string;
  type: string; // hoặc: 'tinh' | 'thanhpho' nếu bạn biết rõ các giá trị có thể
  name_with_type: string;
  code: string; // Nếu là số bạn có thể dùng `number` tùy dữ liệu
  isDeleted: boolean;
};

interface Province {
  code: string;
  name_with_type: string;
}

interface RegisterProps {
  phoneNumber: string;
  fullName: string;
  addressRequest: {
    addressName: string;
    provinceName: string;
    districtName: string;
    wardName: string;
  };
}

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: <explanation>
export default function RegisterPage() {
  const route = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [step] = useState<"input" | "verify" | "success">("input");
  const [contactMethod] = useState<"phone" | "email">("phone");
  const [error] = useState("");

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<Province[]>([]);
  const [wards, setWards] = useState<Province[]>([]); // phường xã

  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterProps>();

  const getProvinces = async () => {
    const response = await fetch(
      "https://vn-public-apis.fpo.vn/provinces/getAll?limit=-1",
      {
        cache: "no-store",
      },
    );
    const rawData = await response.json();

    const handleData = rawData.data.data;
    // ✅ Chỉ lấy các trường cần thiết
    const filteredData: Province[] =
      handleData.map((item: ProvinceProps) => ({
        code: item.code,
        name_with_type: item.name_with_type,
      })) ||
      dataProvince.map((item: Province) => ({
        code: item.code,
        name_with_type: item.name_with_type,
      }));
    setProvinces(filteredData);
  };

  const getDistricts = async (provinceCode: string) => {
    const response = await fetch(
      `https://vn-public-apis.fpo.vn/districts/getByProvince?provinceCode=${provinceCode}&limit=-1`,
      {
        cache: "no-store",
      },
    );
    const rawData = await response.json();
    const handleData = rawData.data.data;
    const filteredData: Province[] = handleData.map((item: ProvinceProps) => ({
      code: item.code,
      name_with_type: item.name_with_type,
    }));
    setDistricts(filteredData);
  };

  const getWards = async (districtCode: string) => {
    const response = await fetch(
      `https://vn-public-apis.fpo.vn/wards/getByDistrict?districtCode=${districtCode}&limit=-1`,
      {
        cache: "no-store",
      },
    );
    const rawData = await response.json();
    const handleData = rawData.data.data;
    const filteredData: Province[] = handleData.map((item: ProvinceProps) => ({
      code: item.code,
      name_with_type: item.name_with_type,
    }));
    setWards(filteredData);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    getProvinces();
  }, []);

  const handleGoogleSignIn = async () => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const googleLoginUrl = `${API_URL}/api/v1/oauth2/google`;
    route.push(googleLoginUrl);
  };
  const handleLoginFacebook = async () => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const facebookLoginUrl = `${API_URL}/api/v1/oauth2/facebook`;
    route.push(facebookLoginUrl);
  };

  const onHandleSubmit = async (data: RegisterProps) => {
    const dataRequest = {
      phoneNumber: data.phoneNumber,
      fullName: data.fullName,
      addressRequest: {
        addressName: data.addressRequest.addressName,
        provinceName: province,
        districtName: district,
        wardName: ward,
      },
    };
    try {
      const message = await registerUser(dataRequest);
      toast.success(message); // Hiển thị thông báo thành công

      // Chuyển hướng về trang đăng nhập sau khi đăng ký thành công
      setTimeout(() => {
        route.push("/login");
      }, 1500); // Delay 1.5 giây để người dùng có thể thấy toast message
    } catch (error: any) {
      console.error("Error during registration:", error);
      toast.error("Số điện thoại không hợp lệ hoặc đã được sử dụng"); // Hiển thị lỗi từ API hoặc hệ thống
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-6xl items-center gap-8 lg:gap-16">
          {/* Left Column - Form */}
          <div className="mx-auto w-full max-w-md">
            <div className="rounded-2xl bg-white p-8 shadow-xl lg:p-10">
              {/* Header */}
              <div className="mb-8 text-center">
                <Typography
                  variant="h3"
                  className="mb-4 text-3xl font-bold text-gray-800 lg:text-4xl"
                  style={{ fontSize: isMobile ? "2rem" : "2.5rem" }}
                >
                  Chào mừng
                </Typography>
                <Typography
                  variant="h6"
                  className="text-lg leading-relaxed text-gray-600 lg:text-xl"
                  style={{ fontSize: isMobile ? "1.1rem" : "1.25rem" }}
                >
                  {step === "input" && "Tạo tài khoản mới"}
                  {step === "verify" && "Nhập mã xác minh"}
                  {step === "success" && "Tài khoản đã được tạo thành công!"}
                </Typography>
              </div>

              {error && (
                <Alert
                  severity="error"
                  className="mb-6 text-base"
                  sx={{ fontSize: "1rem", padding: "12px 16px" }}
                >
                  {error}
                </Alert>
              )}

              {step === "input" && (
                <form
                  onSubmit={handleSubmit(onHandleSubmit)}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <Label>Số điện thoại *</Label>
                    <Input
                      type={contactMethod === "phone" ? "tel" : "email"}
                      {...register("phoneNumber", {
                        required: "Vui lòng nhập số điện thoại",
                        pattern: {
                          value: regexPhoneNumber,
                          message: "Số điện thoại không hợp lệ",
                        },
                      })}
                      placeholder={
                        contactMethod === "phone" ? "Nhập số điện thoại" : ""
                      }
                    />
                    {errors.phoneNumber && (
                      <p className="text-sm text-red-500">
                        {errors.phoneNumber.message as string}
                      </p>
                    )}
                  </div>

                  <div className="space-y-4">
                    <Label>Họ tên *</Label>
                    <Input
                      type="text"
                      {...register("fullName", {
                        required: "Vui lòng nhập họ tên",
                      })}
                      placeholder="Nhập họ tên"
                    />
                    {errors.fullName && (
                      <p className="text-sm text-red-500">
                        {errors.fullName.message as string}
                      </p>
                    )}
                  </div>
                  <div className="space-y-4">
                    <Label>Địa chỉ: Số nhà, tên đường *</Label>
                    <Input
                      type="text"
                      {...register("addressRequest.addressName", {
                        required: "Vui lòng nhập địa chỉ",
                      })}
                      placeholder="Nhập địa chỉ"
                    />
                    {errors.addressRequest && (
                      <p className="text-sm text-red-500">
                        {errors.addressRequest.message as string}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <div className="space-y-4">
                      <Label>Tỉnh/Thành phố *</Label>
                      <Controller
                        name="addressRequest.provinceName"
                        control={control}
                        rules={{ required: "Vui lòng chọn tỉnh/thành" }}
                        render={({ field }) => (
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                              const selectedProvince = provinces.find(
                                (p) => p.code === value,
                              );
                              if (selectedProvince) {
                                setProvince(selectedProvince.name_with_type);
                              }
                              getDistricts(value);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn tỉnh/thành" />
                            </SelectTrigger>
                            <SelectContent>
                              {provinces.map((province) => (
                                <SelectItem
                                  key={province.code}
                                  value={province.code}
                                >
                                  {province.name_with_type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />

                      {errors.addressRequest?.provinceName && (
                        <p className="text-sm text-red-500">
                          {errors.addressRequest.provinceName.message as string}
                        </p>
                      )}
                    </div>

                    <div className="space-y-4">
                      <Label>Quận/Huyện *</Label>
                      <Controller
                        name="addressRequest.districtName"
                        control={control}
                        rules={{ required: "Vui lòng chọn quận/huyện" }}
                        render={({ field }) => (
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                              const selectedDistrict = districts.find(
                                (d) => d.code === value,
                              );
                              if (selectedDistrict) {
                                setDistrict(selectedDistrict.name_with_type);
                              }
                              getWards(value);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn quận/huyện" />
                            </SelectTrigger>
                            <SelectContent>
                              {districts.map((district) => (
                                <SelectItem
                                  key={district.code}
                                  value={district.code}
                                >
                                  {district.name_with_type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />

                      {errors.addressRequest?.districtName && (
                        <p className="text-sm text-red-500">
                          {errors.addressRequest.districtName.message as string}
                        </p>
                      )}
                    </div>
                    <div className="space-y-4">
                      <Label>Phường/Xã *</Label>
                      <Controller
                        name="addressRequest.wardName"
                        control={control}
                        rules={{ required: "Vui lòng chọn phường/xã" }}
                        render={({ field }) => (
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                              const selectedWard = wards.find(
                                (w) => w.code === value,
                              );
                              if (selectedWard) {
                                setWard(selectedWard.name_with_type);
                              }
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn phường/xã" />
                            </SelectTrigger>
                            <SelectContent>
                              {wards.map((ward) => (
                                <SelectItem key={ward.code} value={ward.code}>
                                  {ward.name_with_type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.addressRequest?.wardName && (
                        <p className="text-sm text-red-500">
                          {errors.addressRequest.wardName.message as string}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <ButtonShadcn className="w-full">Đăng ký</ButtonShadcn>
                </form>
              )}

              {/* Google Sign In - Only show on input step */}
              {step === "input" && (
                <>
                  <Divider className="my-8">
                    <Typography
                      variant="body2"
                      className="py-2 text-gray-500"
                      style={{ fontSize: "1rem" }}
                    >
                      Hoặc tiếp tục với
                    </Typography>
                  </Divider>

                  <Button
                    variant="outlined"
                    size="large"
                    fullWidth
                    onClick={handleGoogleSignIn}
                    sx={{
                      borderRadius: "20px",
                      textTransform: "none",
                      borderWidth: "2px",
                      borderColor: "#dc2626",
                      color: "#dc2626",
                      backgroundColor: "#fef2f2",

                      fontWeight: 700,
                      "&:hover": {
                        borderWidth: "2px",
                        borderColor: "#b91c1c",
                        backgroundColor: "#fef2f2",
                        transform: "translateY(-2px)",
                        boxShadow: "0 12px 30px rgba(220, 38, 38, 0.25)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    <Google className="mr-3" />
                    Sign in with Google
                  </Button>

                  <Typography
                    variant="body2"
                    className="py-2 text-gray-500"
                    style={{ fontSize: "1rem", textAlign: "center" }}
                  >
                    Or
                  </Typography>

                  <Button
                    variant="outlined"
                    size="large"
                    fullWidth
                    onClick={handleLoginFacebook}
                    sx={{
                      borderRadius: "20px",
                      textTransform: "none",
                      borderWidth: "2px",
                      borderColor: "#dc2626",
                      color: "#dc2626",
                      backgroundColor: "#fef2f2",

                      fontWeight: 700,
                      "&:hover": {
                        borderWidth: "2px",
                        borderColor: "#b91c1c",
                        backgroundColor: "#fef2f2",
                        transform: "translateY(-2px)",
                        boxShadow: "0 12px 30px rgba(220, 38, 38, 0.25)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    <Facebook className="mr-3" />
                    Sign in with Facebook
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
