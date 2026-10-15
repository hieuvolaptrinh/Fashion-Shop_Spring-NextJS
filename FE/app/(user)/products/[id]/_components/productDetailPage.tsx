"use client";

import { getProductById } from "@/core/apis/products";
import { postShoppingCart } from "@/core/apis/shopping-cart";
import { Badge } from "@/core/components/ui/badge";
import { Button } from "@/core/components/ui/button";
import { Card, CardContent } from "@/core/components/ui/card";
import RequireLoginDialog from "@/core/components/ui/dialog-require-login";
import { Label } from "@/core/components/ui/label";
import { Separator } from "@/core/components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/core/components/ui/tabs";
import { Combo, Product } from "@/core/lib/type";
import {
  ChevronLeft,
  ChevronRight,
  Gift,
  Minus,
  Package,
  Plus,
  RotateCcw,
  Star,
  Truck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type PurchaseOption = {
  type: "single" | "combo";
  data?: Combo;
};

export default function productDetailPage({
  productId,
}: {
  productId: string;
}) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [product, setProduct] = useState<Product>();
  const [quantity, setQuantity] = useState(1);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [selectedOption, setSelectedOption] = useState<PurchaseOption>({
    type: "single",
  });

  // Mảng chứa các đánh giá mẫu từ khách hàng
  const reviews = [
    {
      id: 1,
      userName: "Nguyễn Văn An",
      rating: 5,
      date: "2 ngày trước",
      content:
        "Sản phẩm rất chất lượng, đúng với mô tả. Tôi đã sử dụng được 1 tuần và cảm thấy rất hài lòng với kết quả. Sẽ tiếp tục ủng hộ!",
    },
    {
      id: 2,
      userName: "Trần Thị B",
      rating: 4,
      date: "1 tuần trước",
      content:
        "Giao hàng nhanh, đóng gói cẩn thận. Sản phẩm tốt nhưng giá hơi cao so với thị trường.",
    },
    {
      id: 3,
      userName: "Lê Văn Mạnh",
      rating: 5,
      date: "2 tuần trước",
      content:
        "Mẹ tôi rất thích sản phẩm này. Đã mua nhiều lần và sẽ tiếp tục ủng hộ. Chất lượng luôn ổn định qua từng lần mua.",
    },
    {
      id: 4,
      userName: "Phạm Thị Bo",
      rating: 3,
      date: "1 tháng trước",
      content:
        "Sản phẩm tạm được, nhưng hướng dẫn sử dụng chưa rõ ràng lắm. Cần cải thiện phần này.",
    },
    {
      id: 5,
      userName: "Hoàng Văn Em",
      rating: 5,
      date: "1 tháng trước",
      content:
        "Tuyệt vời! Đã cải thiện sức khỏe của tôi rõ rệt sau 2 tuần sử dụng. Sẽ giới thiệu cho bạn bè và người thân.",
    },
  ];

  const router = useRouter();

  useEffect(() => {
    const fetchProduct = async () => {
      const product = await getProductById(Number(productId));
      setProduct(product);
    };
    fetchProduct();
  }, [productId]);

  // Reset quantity when option changes
  useEffect(() => {
    setQuantity(1);
  }, [selectedOption]);

  const getCurrentPrice = () => {
    if (!product) return 0;
    if (selectedOption.type === "combo" && selectedOption.data) {
      return selectedOption.data.comboPrice;
    }
    return product.salePrice;
  };

  const getCurrentOriginalPrice = () => {
    if (!product) return 0;
    if (selectedOption.type === "combo" && selectedOption.data) {
      // For combo, we might want to show the total original price if buying individually
      return product.originalPrice * selectedOption.data.quantityInCombo;
    }
    return product.originalPrice;
  };

  const getMaxQuantity = () => {
    if (!product) return 0;
    if (selectedOption.type === "combo" && selectedOption.data) {
      // For combo, max quantity might be different based on stock
      return Math.floor(product.quantity / selectedOption.data.quantityInCombo);
    }
    return product.quantity;
  };

  const handleAddToCart = async () => {
    const isLoggedIn =
      typeof window !== "undefined"
        ? !!localStorage.getItem("accessToken")
        : false;

    if (!isLoggedIn) {
      setShowLoginDialog(true);
      return;
    }

    const maxQty = getMaxQuantity();
    if (quantity > maxQty) {
      toast.error(
        `Không thể đặt hàng nhiều hơn số lượng hiện có (${maxQty} ${
          selectedOption.type === "combo" ? "combo" : "sản phẩm"
        })`,
      );
      return;
    }

    try {
      const requestData = {
        productId: Number(productId),
        quantity,
        comboId:
          selectedOption.type === "combo" && selectedOption.data?.comboId
            ? selectedOption.data.comboId
            : 0,
      };

      await postShoppingCart(requestData);
      toast.success("Thêm vào giỏ hàng thành công");
    } catch (error: any) {
      toast.error(`Lỗi: ${error.message || "Thêm vào giỏ hàng thất bại"}`);
    }
  };

  const handleBuyNow = async () => {
    const isLoggedIn =
      typeof window !== "undefined"
        ? !!localStorage.getItem("accessToken")
        : false;

    if (!isLoggedIn) {
      setShowLoginDialog(true);
      return;
    }

    const maxQty = getMaxQuantity();
    if (quantity > maxQty) {
      toast.error(
        `Không thể đặt hàng nhiều hơn số lượng hiện có (${maxQty} ${
          selectedOption.type === "combo" ? "combo" : "sản phẩm"
        })`,
      );
      return;
    }

    try {
      const requestData = {
        productId: Number(productId),
        quantity,
        comboId:
          selectedOption.type === "combo" && selectedOption.data?.comboId
            ? selectedOption.data.comboId
            : 0,
      };

      await postShoppingCart(requestData);
      toast.success("Đặt hàng thành công, chuyển đến giỏ hàng");
      router.push("/shopping-cart");
    } catch (error: any) {
      toast.error(`Lỗi: ${error.message || "Đặt hàng thất bại"}`);
    }
  };

  return (
    <>
      <RequireLoginDialog
        open={showLoginDialog}
        onClose={() => setShowLoginDialog(false)}
      />
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-9 lg:gap-12">
          <div className="lg:col-span-4">
            <div className="space-y-4">
              {/* Main Image with Navigation */}
              <div className="group relative">
                <div className="aspect-square overflow-hidden rounded-lg border shadow-lg">
                  <img
                    src={
                      product?.listImages[selectedImage]?.link ||
                      "/productDemo1.jpg"
                    }
                    alt={product?.productName}
                    width={500}
                    height={500}
                    className="h-full w-full object-cover transition-all hover:scale-105"
                  />
                </div>

                {/* Navigation Arrows */}
                {product?.listImages && product.listImages.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setSelectedImage(
                          selectedImage === 0
                            ? product.listImages.length - 1
                            : selectedImage - 1,
                        )
                      }
                      className="absolute top-1/2 left-2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/70"
                      aria-label="Ảnh trước"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() =>
                        setSelectedImage(
                          selectedImage === product.listImages.length - 1
                            ? 0
                            : selectedImage + 1,
                        )
                      }
                      className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/70"
                      aria-label="Ảnh tiếp theo"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </>
                )}

                {/* Image Counter */}
                {product?.listImages && product.listImages.length > 1 && (
                  <div className="absolute right-2 bottom-2 rounded bg-black/70 px-2 py-1 text-xs text-white">
                    {selectedImage + 1} / {product.listImages.length}
                  </div>
                )}
              </div>

              {/* Image Slideshow/Thumbnails */}
              {product?.listImages && product.listImages.length > 1 && (
                <div className="space-y-3">
                  <div className="flex snap-x gap-2 overflow-x-auto scroll-smooth pb-2">
                    {product.listImages.map((image, index) => (
                      <button
                        type="button"
                        key={image.imageId}
                        onClick={() => setSelectedImage(index)}
                        className={`aspect-square max-w-[70px] min-w-[70px] flex-shrink-0 snap-start overflow-hidden rounded-lg border-2 transition-all ${
                          selectedImage === index
                            ? "scale-105 border-blue-500 ring-2 ring-blue-200"
                            : "border-gray-200 hover:scale-105 hover:border-gray-300"
                        }`}
                      >
                        <img
                          src={image.link || "/productDemo1.jpg"}
                          alt={`${product?.productName} ${index + 1}`}
                          width={70}
                          height={70}
                          className="h-full w-full object-cover"
                        />
                      </button>
                    ))}
                  </div>

                  {/* Slide Navigation Dots */}
                  <div className="flex justify-center gap-2">
                    {product.listImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`h-2 w-2 rounded-full transition-all ${
                          selectedImage === index
                            ? "scale-125 bg-blue-500"
                            : "bg-gray-300 hover:bg-gray-400"
                        }`}
                        aria-label={`Xem ảnh ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="space-y-6 lg:col-span-5">
            <div>
              {product?.listTypes.map((type) => (
                <Badge key={type.typeId} variant="secondary" className="mb-2">
                  {type.typeName}
                </Badge>
              ))}
              <h1 className="text-xl font-bold tracking-tight md:text-3xl">
                {product?.productName}
              </h1>
              <p className="text-muted-foreground mt-2 line-clamp-2 text-sm md:text-base">
                {product?.usageInstructions}
              </p>
              <span className="text-muted-foreground text-sm">
                {/* Ngày sản xuất =>> thành ngày hết hạn để khỏi chỉnh backend */}
                <strong>Hạn sử dụng</strong>:{" "}
                {product?.manufactureDate
                  ? product.manufactureDate instanceof Date
                    ? product.manufactureDate.toLocaleDateString("vi-VN")
                    : product.manufactureDate
                  : ""}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {[0, 1, 2, 3, 4].map((index) => (
                  <Star
                    key={index}
                    className={`h-4 w-4 ${
                      index < 5
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              <span className="text-muted-foreground text-sm">
                (128 reviews)
              </span>
            </div>

            {/* Purchase Options */}
            <div className="space-y-4">
              <Label className="text-base font-medium">Tùy chọn mua hàng</Label>
              <div className="grid gap-3">
                {/* Single Product Option */}
                <div
                  className={`cursor-pointer rounded-lg border-2 p-4 transition-all hover:shadow-md ${
                    selectedOption.type === "single"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedOption({ type: "single" })}
                >
                  <div className="flex items-start space-x-3">
                    <div className="mt-1">
                      <input
                        type="radio"
                        checked={selectedOption.type === "single"}
                        onChange={() => setSelectedOption({ type: "single" })}
                        className="h-4 w-4 text-blue-600"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <Package className="h-5 w-5 text-blue-600" />
                        <span className="font-medium">Mua sản phẩm đơn lẻ</span>
                      </div>
                      <div className="mt-2 flex items-center space-x-4">
                        <span className="text-lg font-bold text-blue-600">
                          {product?.salePrice.toLocaleString("vi-VN")} đ
                        </span>
                        <span className="text-muted-foreground text-sm line-through">
                          {product?.originalPrice.toLocaleString("vi-VN")} đ
                        </span>
                      </div>
                      <p className="text-muted-foreground mt-1 text-sm">
                        Mua từng sản phẩm riêng lẻ
                      </p>
                    </div>
                  </div>
                </div>

                {/* Combo Options */}
                {product?.listCombo && product.listCombo.length > 0 && (
                  <>
                    {product.listCombo.map((combo) => (
                      <div
                        key={combo.comboId}
                        className={`cursor-pointer rounded-lg border-2 p-4 transition-all hover:shadow-md ${
                          selectedOption.type === "combo" &&
                          selectedOption.data?.comboId === combo.comboId
                            ? "border-orange-500 bg-orange-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() =>
                          setSelectedOption({ type: "combo", data: combo })
                        }
                      >
                        <div className="flex items-start space-x-3">
                          <div className="mt-1">
                            <input
                              type="radio"
                              checked={
                                selectedOption.type === "combo" &&
                                selectedOption.data?.comboId === combo.comboId
                              }
                              onChange={() =>
                                setSelectedOption({
                                  type: "combo",
                                  data: combo,
                                })
                              }
                              className="h-4 w-4 text-orange-600"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <Gift className="h-5 w-5 text-orange-600" />
                              <span className="font-medium">
                                {combo.comboDescription}
                              </span>
                              <Badge variant="destructive" className="text-xs">
                                Tiết kiệm{" "}
                                {product &&
                                  Math.ceil(
                                    ((product.salePrice *
                                      combo.quantityInCombo -
                                      combo.comboPrice) /
                                      (product.salePrice *
                                        combo.quantityInCombo)) *
                                      100,
                                  )}
                                %
                              </Badge>
                            </div>
                            <div className="mt-2 flex items-center space-x-4">
                              <span className="text-lg font-bold text-orange-600">
                                {combo.comboPrice.toLocaleString("vi-VN")} đ
                              </span>
                              <span className="text-muted-foreground text-sm line-through">
                                {product &&
                                  (
                                    product.salePrice * combo.quantityInCombo
                                  ).toLocaleString("vi-VN")}{" "}
                                đ
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-2xl font-bold md:text-3xl">
                {getCurrentPrice().toLocaleString("vi-VN")} đ
              </span>
              <span className="text-muted-foreground text-base line-through md:text-xl">
                {getCurrentOriginalPrice().toLocaleString("vi-VN")} đ
              </span>
              {getCurrentOriginalPrice() && getCurrentPrice() && (
                <Badge variant="destructive">
                  Giảm{" "}
                  {Math.ceil(
                    ((getCurrentOriginalPrice() - getCurrentPrice()) /
                      getCurrentOriginalPrice()) *
                      100,
                  )}
                  %
                </Badge>
              )}
            </div>

            <div className="space-y-3">
              <Label className="text-base font-medium">Số lượng</Label>
              <div className="flex items-center space-x-3">
                <Button
                  className="cursor-pointer"
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  className="cursor-pointer"
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    const maxQty = getMaxQuantity();
                    if (quantity >= maxQty) {
                      toast.warning(
                        `Số lượng tối đa có thể đặt là ${maxQty} ${
                          selectedOption.type === "combo" ? "combo" : "sản phẩm"
                        }`,
                      );
                    } else {
                      setQuantity(Math.min(maxQty, quantity + 1));
                    }
                  }}
                  disabled={quantity >= getMaxQuantity()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-6">
              {getMaxQuantity() > 0 ? (
                <>
                  <div className="flex items-center justify-between rounded-xl border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-4 shadow-sm">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="h-3 w-3 animate-pulse rounded-full bg-green-500"></div>
                        <div className="absolute inset-0 h-3 w-3 animate-ping rounded-full bg-green-400"></div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <svg
                          className="h-4 w-4 text-green-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-sm font-semibold text-green-700">
                          Còn lại: {getMaxQuantity()}{" "}
                          {selectedOption.type === "combo"
                            ? "combo"
                            : "sản phẩm"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 rounded-full bg-green-400"></div>
                      <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-600">
                        Có sẵn
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons - Same Row */}
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Button
                      size="lg"
                      className="group relative cursor-pointer overflow-hidden border-2 border-blue-500 bg-white py-3 text-sm font-semibold text-blue-600 shadow-lg transition-all duration-300 hover:bg-blue-500 hover:text-white hover:shadow-xl"
                      variant="outline"
                      onClick={handleAddToCart}
                    >
                      <div className="relative z-10 flex items-center justify-center space-x-2">
                        <svg
                          className="h-4 w-4 transition-transform group-hover:scale-110"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5M7 13l1.1 5m0 0h8.8M17 18a1 1 0 110 2 1 1 0 010-2zm-8 0a1 1 0 110 2 1 1 0 010-2z"
                          />
                        </svg>
                        <span>Thêm vào giỏ</span>
                      </div>
                      <div className="absolute inset-0 translate-x-full transform bg-gradient-to-r from-blue-600 to-blue-500 transition-transform duration-300 group-hover:translate-x-0"></div>
                    </Button>

                    <Button
                      size="lg"
                      className="group relative cursor-pointer overflow-hidden bg-gradient-to-r from-orange-500 to-red-500 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:from-orange-600 hover:to-red-600 hover:shadow-xl"
                      onClick={handleBuyNow}
                    >
                      <div className="relative z-10 flex items-center justify-center space-x-2">
                        <svg
                          className="h-4 w-4 transition-transform group-hover:scale-110"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                        <span>Mua ngay</span>
                        <svg
                          className="h-3 w-3 transition-transform group-hover:translate-x-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                      <div className="absolute inset-0 origin-left scale-x-0 transform bg-gradient-to-r from-red-600 to-orange-600 transition-transform duration-300 group-hover:scale-x-100"></div>
                    </Button>
                  </div>
                </>
              ) : (
                <div className="relative overflow-hidden rounded-xl border-2 border-red-200 bg-gradient-to-br from-red-50 to-pink-50 p-6 text-center">
                  <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-red-400 to-pink-400"></div>
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                        <svg
                          className="h-8 w-8 text-red-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500">
                        <svg
                          className="h-3 w-3 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="flex items-center justify-center space-x-2 text-lg font-bold text-red-600">
                        <svg
                          className="h-5 w-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>Sản phẩm đã hết hàng</span>
                      </h3>
                      <p className="text-sm leading-relaxed text-red-500">
                        Rất tiếc, sản phẩm này hiện đã hết hàng.
                        <br />
                        Vui lòng quay lại sau hoặc liên hệ để được thông báo khi
                        có hàng.
                      </p>
                    </div>
                    <div className="flex items-center space-x-4 pt-2">
                      <button className="flex items-center space-x-2 text-sm font-medium text-red-600 transition-colors hover:text-red-700">
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 17h5l-5 5v-5zM4 19l5-5m0 0l5 5m-5-5v5"
                          />
                        </svg>
                        <span>Thông báo khi có hàng</span>
                      </button>
                      <div className="h-4 w-px bg-red-300"></div>
                      <button className="flex items-center space-x-2 text-sm font-medium text-red-600 transition-colors hover:text-red-700">
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                        <span>Liên hệ</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <Separator />
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center space-x-3">
                  <Truck className="text-muted-foreground h-5 w-5" />
                  <span className="text-sm">
                    Miễn phí vận chuyển trên đơn hàng trên 500.000 đ
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <RotateCcw className="text-muted-foreground h-5 w-5" />
                  <span className="text-sm">Đổi trả trong 30 ngày</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="description">Mô tả</TabsTrigger>
              <TabsTrigger value="reviews">Đánh giá</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="prose max-w-none">
                    <p className="text-muted-foreground leading-relaxed">
                      {product?.description}
                    </p>
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="mb-2 font-medium">Thành phần</h4>
                      <p className="text-muted-foreground">
                        {product?.ingredients}
                      </p>
                    </div>
                    <div>
                      <h4 className="mb-2 font-medium">Hướng dẫn sử dụng</h4>
                      <p className="text-muted-foreground">
                        {product?.usageInstructions}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">
                        Khách hàng đánh giá
                      </h3>
                    </div>

                    <div className="space-y-4">
                      {reviews.map((review) => (
                        <div
                          key={review.id}
                          className="border-b pb-4 last:border-b-0"
                        >
                          <div className="mb-2 flex items-center space-x-2">
                            <div className="flex items-center">
                              {[1, 2, 3, 4, 5].map((i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i <= review.rating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="font-medium">
                              {review.userName}
                            </span>
                            <span className="text-muted-foreground text-sm">
                              {review.date}
                            </span>
                          </div>
                          <p className="text-muted-foreground">
                            {review.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
