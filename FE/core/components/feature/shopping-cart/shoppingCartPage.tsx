"use client";

import { postOrder } from "@/core/apis/order";
import {
  deleteShoppingCart,
  getShoppingCart,
  putShoppingCart,
} from "@/core/apis/shopping-cart";
import { getUser } from "@/core/apis/user";
import { Button } from "@/core/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { Checkbox } from "@/core/components/ui/checkbox";
import { Input } from "@/core/components/ui/input";
import { Label } from "@/core/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/components/ui/select";
import { Separator } from "@/core/components/ui/separator";
import type { Product, UserResponse } from "@/core/lib/type";
import { useCartStore } from "@/core/store/cartStore";
import { CreditCard, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

type ProvinceProps = {
  _id: string;
  name: string;
  slug: string;
  type: string; // hoặc: 'tinh' | 'thanhpho' nếu bạn biết rõ các giá trị có thể
  name_with_type: string;
  code: string; // Nếu là số bạn có thể dùng `number` tùy dữ liệu
  isDeleted: boolean;
};
interface CartItem {
  cartDetailId: number;
  quantity: number;
  price: number;
  product: Product;
}

interface Province {
  code: string;
  name_with_type: string;
}

export const regexPhoneNumber = /^0\d{9}$/;

export default function Component() {
  const route = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [discount] = useState(0);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<Province[]>([]); // quận huyện
  const [wards, setWards] = useState<Province[]>([]); // phường xã

  const [province, setProvince] = useState(""); //province
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [selected, setSelected] = useState<number[]>([]);
  const [user, setUser] = useState<UserResponse | null>(null);
  const {
    control,
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();

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
    const filteredData: Province[] = handleData.map((item: ProvinceProps) => ({
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
  const fetchUser = async () => {
    const res = await getUser();
    setUser(res);

    // Tự động điền thông tin user vào form
    if (res) {
      setValue("phoneNumber", res.phoneNumber || "");

      if (res.listAddress && res.listAddress.length > 0) {
        const firstAddress = res.listAddress[0];
        setValue("streetHouse", firstAddress.addressName || "");
      }
    }
  };
  const fetchShoppingCart = async () => {
    const res = await getShoppingCart();

    const result = res.data.items;

    setCartItems(result);
  };

  const updateQuantity = async (id: number, newQuantity: number) => {
    if (newQuantity === 0) {
      removeItem(id);
      return;
    }

    await putShoppingCart({
      cartDetailId: id,
      quantity: newQuantity,
    });

    setCartItems((items) =>
      items.map((item) =>
        item.cartDetailId === id ? { ...item, quantity: newQuantity } : item,
      ),
    );
  };

  const removeItem = async (id: number) => {
    await deleteShoppingCart(id);
    setCartItems((items) => items.filter((item) => item.cartDetailId !== id));
    await useCartStore.getState().fetchCartQuantity();
  };

  const subtotal = cartItems
    .filter((item) => selected.includes(item.cartDetailId))
    .reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = subtotal * discount;
  const shipping = subtotal > 500000 || subtotal === 0 ? 0 : 30000;
  const total = subtotal - discountAmount + shipping;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Hàm tối ưu để tự động điền thông tin địa chỉ tuần tự
  const autoFillAddress = async (firstAddress: any) => {
    if (!firstAddress || provinces.length === 0) return;

    try {
      // 1. Tìm và set province
      if (firstAddress.provinceName) {
        const foundProvince = provinces.find(
          (p) =>
            p.name_with_type === firstAddress.provinceName ||
            p.name_with_type.includes(firstAddress.provinceName) ||
            firstAddress.provinceName.includes(p.name_with_type),
        );

        if (foundProvince) {
          setValue("province", foundProvince.code);
          setProvince(foundProvince.name_with_type);

          // 2. Load districts - useEffect sẽ handle việc set district
          const districtsResponse = await fetch(
            `https://vn-public-apis.fpo.vn/districts/getByProvince?provinceCode=${foundProvince.code}&limit=-1`,
            { cache: "no-store" },
          );
          const districtsData = await districtsResponse.json();
          const currentDistricts = districtsData.data.data.map((item: any) => ({
            code: item.code,
            name_with_type: item.name_with_type,
          }));

          setDistricts(currentDistricts);
        }
      }
    } catch (error) {
      console.error("Error auto-filling address:", error);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const initializeData = async () => {
      await getProvinces();
      await fetchShoppingCart();
      await fetchUser();
    };

    initializeData();
  }, []);

  // Effect để tự động điền địa chỉ khi có đủ dữ liệu
  useEffect(() => {
    if (
      user &&
      provinces.length > 0 &&
      user.listAddress &&
      user.listAddress.length > 0
    ) {
      autoFillAddress(user.listAddress[0]);
    }
  }, [user, provinces]);

  // Effect để thử gắn district khi districts state thay đổi
  useEffect(() => {
    if (
      user &&
      user.listAddress &&
      user.listAddress.length > 0 &&
      districts.length > 0 &&
      !district // chỉ chạy khi chưa có district
    ) {
      const firstAddress = user.listAddress[0];
      if (firstAddress?.districtName) {
        const foundDistrict = districts.find(
          (d) =>
            d.name_with_type === firstAddress.districtName ||
            d.name_with_type.includes(firstAddress.districtName) ||
            firstAddress.districtName.includes(d.name_with_type),
        );

        if (foundDistrict) {
          setValue("district", foundDistrict.code);
          setDistrict(foundDistrict.name_with_type);

          // Load wards ngay sau khi set district
          getWards(foundDistrict.code);
        }
      }
    }
  }, [districts, user, district, setValue]);

  // Effect để thử gắn ward khi wards state thay đổi
  useEffect(() => {
    if (
      user &&
      user.listAddress &&
      user.listAddress.length > 0 &&
      wards.length > 0 &&
      !ward // chỉ chạy khi chưa có ward
    ) {
      const firstAddress = user.listAddress[0];
      if (firstAddress?.wardName) {
        const foundWard = wards.find(
          (w) =>
            w.name_with_type === firstAddress.wardName ||
            w.name_with_type.includes(firstAddress.wardName) ||
            firstAddress.wardName.includes(w.name_with_type),
        );

        if (foundWard) {
          setValue("ward", foundWard.code);
          setWard(foundWard.name_with_type);
        }
      }
    }
  }, [wards, user, ward, setValue]);

  const toggleSelectItem = (id: number) => {
    setSelected((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((itemId) => itemId !== id)
        : [...prevSelected, id],
    );
  };

  useEffect(() => {
    setValue("selected", selected); // cập nhật vào react-hook-form
  }, [selected, setValue]);

  // Check nếu đã chọn hết
  const isAllSelected =
    cartItems.length > 0 && selected.length === cartItems.length;

  // Hàm chọn hoặc bỏ chọn tất cả
  const handleCheckAll = () => {
    if (isAllSelected) {
      setSelected([]);
    } else {
      const allIds = cartItems.map((item) => item.cartDetailId);
      setSelected(allIds);
    }
  };

  const fullAddress = useMemo(() => {
    return [ward, district, province].filter(Boolean).join(", ");
  }, [ward, district, province]);

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const handleSubmitOrder = async (data: any) => {
    const updatedCartItems = cartItems.filter(
      (item) => !selected.includes(item.cartDetailId),
    );
    const shippingAddress = `${data.streetHouse}, ${fullAddress}`;
    const response = await postOrder(
      {
        shippingAddress,
        phoneNumber: data.phoneNumber,
        selectedIds: selected,
      },
      localStorage.getItem("accessToken") || "",
    );

    if (response.status === 201) {
      toast.success("Đặt hàng thành công!");
    } else {
      toast.error(`Lỗi: ${response.message}`);
    }

    setCartItems(updatedCartItems);

    route.push("/");
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 py-6">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="py-16 text-center">
            <div className="mb-6 flex justify-center">
              <div className="animate-pulse rounded-full bg-gradient-to-r from-red-100 to-rose-100 p-6">
                <ShoppingBag className="h-16 w-16 text-red-600" />
              </div>
            </div>
            <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-800 sm:text-3xl">
              🛒 Giỏ hàng trống
            </h2>
            <p className="mx-auto mb-8 max-w-md text-base text-gray-600 sm:text-lg">
              Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm nhé! 🛍️
            </p>
            <Button
              onClick={() => route.push("/products")}
              className="bg-gradient-to-r from-red-600 to-rose-600 px-6 py-3 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:from-red-700 hover:to-rose-700 hover:shadow-xl sm:px-8 sm:text-lg"
            >
              🏪 Khám phá sản phẩm
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl">
            🛒 Giỏ hàng của bạn
          </h1>
          <p className="mt-3 text-base font-medium text-gray-600 sm:text-lg">
            Bạn có{" "}
            <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
              {cartItems.length} sản phẩm
            </span>{" "}
            trong giỏ hàng
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          {/* Cart Items */}
          <form
            onSubmit={handleSubmit(handleSubmitOrder)}
            className="space-y-6 lg:col-span-2"
          >
            <Card className="border-2 border-gray-200 bg-white shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
              <CardHeader className="border-b-2 border-red-100 bg-gradient-to-r from-red-50 to-rose-50 p-4 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-800 sm:text-xl">
                    <ShoppingBag className="h-5 w-5 text-red-600" />
                    Sản phẩm trong giỏ hàng
                  </CardTitle>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCheckAll}
                    className="border-2 border-red-200 text-sm font-semibold text-red-700 transition-colors duration-200 hover:border-red-300 hover:bg-red-50"
                  >
                    {isAllSelected ? "❌ Bỏ chọn tất cả" : "✅ Chọn tất cả"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 p-4 sm:p-6">
                {cartItems.map((item) => (
                  <div
                    key={item.cartDetailId}
                    className="group rounded-xl border-2 border-gray-200 bg-white p-4 shadow-sm transition-all duration-300 hover:border-red-200 hover:shadow-md sm:p-6"
                  >
                    {/* Mobile Layout */}
                    <div className="flex flex-col space-y-4 sm:hidden">
                      <div className="flex items-start space-x-3">
                        <div className="flex items-center justify-center pt-1">
                          <Checkbox
                            checked={selected.includes(item.cartDetailId)}
                            onCheckedChange={() =>
                              toggleSelectItem(item.cartDetailId)
                            }
                            className="h-5 w-5 rounded-md border-2 border-gray-400 hover:border-red-400 focus:ring-2 focus:ring-red-200 data-[state=checked]:border-red-600 data-[state=checked]:bg-red-600 data-[state=checked]:text-white"
                          />
                        </div>
                        <div className="relative overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                          <img
                            src={
                              item.product.listImages[0]?.link ||
                              "/placeholder.svg"
                            }
                            alt={item.product.productName || "Product Image"}
                            className="h-16 w-16 rounded-lg object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="mb-2 line-clamp-2 text-sm font-semibold text-gray-800">
                            {item.product.productName}
                          </h3>
                          <p className="text-lg font-bold text-red-600">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 rounded-lg border border-gray-200 bg-gray-50 p-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              updateQuantity(
                                item.cartDetailId,
                                item.quantity - 1,
                              )
                            }
                            className="h-8 w-8 border border-red-300 text-red-600 hover:border-red-400 hover:bg-red-50"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm font-bold text-gray-800">
                            {item.quantity}
                          </span>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              updateQuantity(
                                item.cartDetailId,
                                item.quantity + 1,
                              )
                            }
                            className="h-8 w-8 border border-red-300 text-red-600 hover:border-red-400 hover:bg-red-50"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            removeItem(item.cartDetailId);
                          }}
                          className="text-sm text-red-500 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="mr-1 h-4 w-4" />
                          Xóa
                        </Button>
                      </div>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden items-center space-x-4 sm:flex">
                      <div className="flex items-center justify-center">
                        <Checkbox
                          checked={selected.includes(item.cartDetailId)}
                          onCheckedChange={() =>
                            toggleSelectItem(item.cartDetailId)
                          }
                          className="h-5 w-5 rounded-md border-2 border-gray-400 hover:border-red-400 focus:ring-2 focus:ring-red-200 data-[state=checked]:border-red-600 data-[state=checked]:bg-red-600 data-[state=checked]:text-white"
                        />
                      </div>
                      <div className="relative overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                        <img
                          src={
                            item.product.listImages[0]?.link ||
                            "/placeholder.svg"
                          }
                          alt={item.product.productName || "Product Image"}
                          className="h-20 w-20 rounded-lg object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="line-clamp-2 text-base font-semibold text-gray-800 transition-colors duration-200 hover:text-red-600">
                          {item.product.productName}
                        </h3>
                      </div>
                      <div className="flex items-center space-x-3 rounded-lg border border-gray-200 bg-gray-50 p-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            updateQuantity(item.cartDetailId, item.quantity - 1)
                          }
                          className="h-9 w-9 border border-red-300 text-red-600 hover:border-red-400 hover:bg-red-50"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-12 text-center text-lg font-bold text-gray-800">
                          {item.quantity}
                        </span>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            updateQuantity(item.cartDetailId, item.quantity + 1)
                          }
                          className="h-9 w-9 border border-red-300 text-red-600 hover:border-red-400 hover:bg-red-50"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="text-right">
                        <p className="mb-2 text-xl font-bold text-red-600">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            removeItem(item.cartDetailId);
                          }}
                          className="text-red-500 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="mr-1 h-4 w-4" />
                          Xóa
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-200 bg-white shadow-lg backdrop-blur-sm">
              <CardHeader className="border-b-2 border-red-100 bg-gradient-to-r from-red-50 to-rose-50 p-4 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-800 sm:text-xl">
                  <CreditCard className="h-5 w-5 text-red-600" />
                  📍 Thông tin giao hàng
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    <Label className="flex items-center gap-1 text-sm font-semibold text-gray-700">
                      📱 Số điện thoại
                    </Label>
                    <Input
                      type="text"
                      defaultValue=""
                      placeholder="Nhập số điện thoại của bạn"
                      className="border-2 border-gray-200 focus:border-red-300 focus:ring-2 focus:ring-red-200"
                      {...register("phoneNumber", {
                        required: "Vui lòng nhập số điện thoại",
                        pattern: {
                          value: regexPhoneNumber,
                          message: "Số điện thoại không hợp lệ",
                        },
                      })}
                    />
                    {errors.phoneNumber && (
                      <p className="flex items-center gap-1 text-sm text-red-500">
                        ⚠️ {errors.phoneNumber.message as string}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label className="flex items-center gap-1 text-sm font-semibold text-gray-700">
                      🏠 Số nhà, tên đường
                    </Label>
                    <Input
                      type="text"
                      defaultValue=""
                      placeholder="Ví dụ: 123 Đường Lê Lợi"
                      className="border-2 border-gray-200 focus:border-red-300 focus:ring-2 focus:ring-red-200"
                      {...register("streetHouse", {
                        required: "Vui lòng nhập số nhà, tên đường",
                      })}
                    />
                    {errors.streetHouse && (
                      <p className="flex items-center gap-1 text-sm text-red-500">
                        ⚠️ {errors.streetHouse.message as string}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label className="flex items-center gap-1 text-sm font-semibold text-gray-700">
                      🌆 Tỉnh/Thành phố *
                    </Label>
                    <Controller
                      name="province"
                      control={control}
                      rules={{ required: "Vui lòng chọn tỉnh/thành" }}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);
                            const selectedProvince = provinces.find(
                              (p) => p.code === value,
                            );
                            if (selectedProvince) {
                              setProvince(selectedProvince.name_with_type);
                            }
                            // Reset district và ward khi thay đổi province
                            setValue("district", "");
                            setValue("ward", "");
                            setDistrict("");
                            setWard("");
                            setDistricts([]);
                            setWards([]);
                            getDistricts(value);
                          }}
                        >
                          <SelectTrigger className="border-2 border-gray-200 focus:border-red-300 focus:ring-2 focus:ring-red-200">
                            <SelectValue placeholder="Chọn tỉnh/thành phố" />
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
                    {errors.province && (
                      <p className="flex items-center gap-1 text-sm text-red-500">
                        ⚠️ {errors.province.message as string}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label className="flex items-center gap-1 text-sm font-semibold text-gray-700">
                      🏢 Quận/Huyện *
                    </Label>
                    <Controller
                      name="district"
                      control={control}
                      rules={{ required: "Vui lòng chọn quận/huyện" }}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);
                            const selectedDistrict = districts.find(
                              (d) => d.code === value,
                            );
                            if (selectedDistrict) {
                              setDistrict(selectedDistrict.name_with_type);
                            }
                            // Reset ward khi thay đổi district
                            setValue("ward", "");
                            setWard("");
                            setWards([]);
                            getWards(value);
                          }}
                        >
                          <SelectTrigger className="border-2 border-gray-200 focus:border-red-300 focus:ring-2 focus:ring-red-200">
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
                    {errors.district && (
                      <p className="flex items-center gap-1 text-sm text-red-500">
                        ⚠️ {errors.district.message as string}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label className="flex items-center gap-1 text-sm font-semibold text-gray-700">
                      🏘️ Phường/Xã *
                    </Label>
                    <Controller
                      name="ward"
                      control={control}
                      rules={{ required: "Vui lòng chọn phường/xã" }}
                      render={({ field }) => (
                        <Select
                          value={field.value}
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
                          <SelectTrigger className="border-2 border-gray-200 focus:border-red-300 focus:ring-2 focus:ring-red-200">
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
                    {errors.ward && (
                      <p className="flex items-center gap-1 text-sm text-red-500">
                        ⚠️ {errors.ward.message as string}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-4 sm:p-6">
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-red-600 to-rose-600 py-3 text-base text-white shadow-lg transition-all duration-300 hover:from-red-700 hover:to-rose-700 hover:shadow-xl sm:py-4 sm:text-lg"
                  size="lg"
                  onClick={handleSubmitOrder}
                  disabled={selected.length === 0}
                >
                  <CreditCard className="mr-2 h-5 w-5" />
                  💳 Thanh toán ngay ({selected.length} sản phẩm)
                </Button>
              </CardFooter>
            </Card>
          </form>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6 mb-6 border-2 border-gray-200 bg-white shadow-lg backdrop-blur-sm">
              <CardHeader className="border-b-2 border-red-100 bg-gradient-to-r from-red-50 to-rose-50 p-4 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-800 sm:text-xl">
                  📊 Tóm tắt đơn hàng
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-4 sm:p-6">
                <div className="flex items-center justify-between border-b border-gray-100 py-2">
                  <span className="flex items-center gap-1 text-gray-600">
                    📦 Tạm tính:
                  </span>
                  <span className="font-semibold text-gray-800">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                {discount > 0 && (
                  <div className="flex items-center justify-between border-b border-gray-100 py-2">
                    <span className="flex items-center gap-1 text-green-600">
                      🎉 Giảm giá ({Math.round(discount * 100)}%):
                    </span>
                    <span className="font-semibold text-green-600">
                      -{formatPrice(discountAmount)}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between border-b border-gray-100 py-2">
                  <span className="flex items-center gap-1 text-gray-600">
                    🚚 Phí vận chuyển:
                  </span>
                  <span
                    className={`font-semibold ${shipping === 0 ? "text-green-600" : "text-gray-800"}`}
                  >
                    {shipping === 0 ? "🆓 Miễn phí" : formatPrice(shipping)}
                  </span>
                </div>

                <Separator className="h-0.5 bg-red-200" />

                <div className="flex items-center justify-between rounded-lg border-2 border-red-200 bg-red-50 p-4 text-lg font-bold sm:text-xl">
                  <span className="flex items-center gap-1 text-gray-800">
                    💰 Tổng cộng:
                  </span>
                  <span className="text-red-600">{formatPrice(total)}</span>
                </div>
              </CardContent>

              <CardFooter className="p-4 sm:p-6">
                <Button
                  onClick={() => route.push("/products")}
                  variant="outline"
                  className="w-full border-2 border-red-200 font-semibold text-red-600 transition-colors duration-200 hover:border-red-300 hover:bg-red-50"
                >
                  🛍️ Tiếp tục mua sắm
                </Button>
              </CardFooter>
            </Card>

            {/* Shipping Info */}
            {/* <ShippingInfor /> */}
          </div>
        </div>
      </div>
    </div>
  );
}
