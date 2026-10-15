import { postShoppingCart } from "@/core/apis/shopping-cart";
import { Badge } from "@/core/components/ui/badge";
import { Button } from "@/core/components/ui/button";
import { Card, CardContent, CardFooter } from "@/core/components/ui/card";
import OutOfStock from "@/core/components/ui/out-of-stock";
import { convertToSlug } from "@/core/lib/convert";
import { cn } from "@/core/lib/utils";
import { useCartStore } from "@/core/store/cartStore";
import {
  ChevronRight,
  Heart,
  ShoppingBag,
  ShoppingCart,
  Star,
} from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";
import type { MouseEvent } from "react";
import { toast } from "sonner";

// Dynamic import of RequireLoginDialog with ssr disabled
const RequireLoginDialog = dynamic(
  () => import("@/core/components/ui/dialog-require-login"),
  { ssr: false },
);

type ListImages = {
  imageId: string;
  link: string;
};

type ListTypes = {
  typeId: string;
  typeName: string;
};

type Product = {
  productId: string;
  productName: string;
  originalPrice: number;
  usageInstructions: string;
  description: string;
  ingredients: string;
  salePrice: number;
  quantity: number;
  manufactureDate: Date;
  listImages: ListImages[];
  listTypes: ListTypes[];
};

interface ProductCardProps {
  product: Product;
  variant?: "compact" | "full"; // compact cho homepage, full cho products page
}

const ProductCard = ({ product, variant = "compact" }: ProductCardProps) => {
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  // Format giá tiền
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Tính phần trăm giảm giá
  const getDiscountPercent = (original: number, current: number) => {
    return Math.round(((original - current) / original) * 100);
  };

  const handleAddShoppingCart = async (
    e?: MouseEvent<HTMLButtonElement>,
    productId?: string,
  ) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // Check if user is logged in - only in browser environment
    const isLoggedIn =
      typeof window !== "undefined"
        ? !!localStorage.getItem("accessToken")
        : false;

    if (!isLoggedIn) {
      setShowLoginDialog(true);
      return;
    }

    try {
      const response = await postShoppingCart({
        productId: Number.parseInt(productId || product.productId),
        quantity: 1,
      });

      if (response.status === 201) {
        toast.success("Thêm vào giỏ hàng thành công!", {
          position: "bottom-right",
        });
        await useCartStore.getState().fetchCartQuantity();
      } else {
        toast.error(`Lỗi: ${response.message}`);
      }
    } catch (error: any) {
      toast.error(`Lỗi: ${error.message || "Không thể thêm vào giỏ hàng"}`, {
        position: "bottom-right",
      });
    }
  };

  if (variant === "compact") {
    // Compact version for homepage
    return (
      <>
        <RequireLoginDialog
          open={showLoginDialog}
          onClose={() => setShowLoginDialog(false)}
        />
        <Card className="group transition-shadow duration-300 hover:shadow-lg">
          <CardContent className="p-0">
            <div className="relative overflow-hidden rounded-t-lg">
              <img
                src={product.listImages[0]?.link || "/older.png"}
                alt={product.productName}
                width={400}
                height={400}
                className="h-24 w-full object-cover transition-transform duration-300 group-hover:scale-105 sm:h-48"
              />
              <div className="absolute top-0.5 left-0.5 sm:top-2 sm:left-2">
                <Badge
                  variant="destructive"
                  className="px-0.5 py-0 text-[8px] sm:px-2 sm:py-1 sm:text-sm"
                >
                  -
                  {getDiscountPercent(product.originalPrice, product.salePrice)}
                  %
                </Badge>
              </div>
              <div className="absolute top-0.5 right-0.5 opacity-0 transition-opacity group-hover:opacity-100 sm:top-2 sm:right-2">
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-4 w-4 sm:h-8 sm:w-8"
                >
                  <Heart className="h-2 w-2 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </div>

            <div className="px-1 sm:px-4">
              <Link
                href={`/products/${convertToSlug(product.productName)}-${product.productId}.html`}
                className="group rounded-2xl focus:ring-4 focus:ring-rose-300 focus:outline-none"
              >
                <div className="mb-1 sm:mb-2">
                  <Badge
                    variant="outline"
                    className="px-1 py-0 text-[8px] sm:px-2 sm:py-1 sm:text-xs"
                  >
                    {product.listTypes[0]?.typeName || "Chưa phân loại"}
                  </Badge>
                </div>

                <h3 className="mb-2 line-clamp-2 h-8 text-[10px] font-semibold sm:mb-2 sm:h-10 sm:text-sm">
                  {product.productName}
                </h3>

                <div className="mb-2 flex items-center gap-1 sm:mb-2">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((index) => (
                      <Star
                        key={index}
                        className={cn("h-1.5 w-1.5 sm:h-3 sm:w-3", {
                          "fill-yellow-400 text-yellow-400": index <= 5,
                          "text-gray-300": index > 5,
                        })}
                      />
                    ))}
                  </div>
                </div>

                <div className="mb-2 space-y-0.5 sm:mb-3 sm:space-y-1">
                  <div className="flex items-center gap-1">
                    <span className="text-[9px] font-bold text-red-600 sm:text-base">
                      {formatPrice(product.salePrice)}
                    </span>
                  </div>
                  <div className="text-muted-foreground text-[8px] line-through sm:text-xs">
                    {formatPrice(product.originalPrice)}
                  </div>
                </div>
              </Link>
              {product.quantity > 0 ? (
                <Button
                  className="w-full cursor-pointer text-[8px] sm:py-2 sm:text-sm"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleAddShoppingCart(e, product.productId);
                  }}
                >
                  <ShoppingCart className="mr-0.5 h-2 w-2 sm:mr-2 sm:h-4 sm:w-4" />
                  <span className="">Thêm vào giỏ </span>
                </Button>
              ) : (
                <OutOfStock size="sm" />
              )}
            </div>
          </CardContent>
        </Card>
      </>
    );
  }

  // Full version for products page
  return (
    <>
      <RequireLoginDialog
        open={showLoginDialog}
        onClose={() => setShowLoginDialog(false)}
      />
      <Link
        href={`/products/${product.productId}`}
        className="group rounded-2xl focus:ring-4 focus:ring-rose-300 focus:outline-none"
      >
        <Card className="h-full overflow-hidden rounded-2xl border-0 bg-white transition-all duration-300 group-hover:shadow-xl">
          <div className="relative overflow-hidden">
            <img
              src={product.listImages[0]?.link || "/older.png"}
              alt={product.productName}
              width={500}
              height={500}
              className="h-80 w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              <Button
                size="icon"
                variant="secondary"
                className="h-10 w-10 rounded-full bg-white/80 text-rose-600 backdrop-blur-sm hover:bg-white"
              >
                <Heart className="h-5 w-5" />
                <span className="sr-only">Thêm vào yêu thích</span>
              </Button>
              <Button
                size="icon"
                variant="secondary"
                className="h-10 w-10 rounded-full bg-white/80 text-rose-600 backdrop-blur-sm hover:bg-white"
              >
                <ShoppingBag className="h-5 w-5" />
                <span className="sr-only">Thêm vào giỏ hàng</span>
              </Button>
            </div>
            {(product.salePrice / product.originalPrice) * 100 && (
              <Badge className="text-md absolute top-4 left-4 rounded-full bg-rose-600 px-3 py-1.5 text-white hover:bg-rose-700 sm:text-lg">
                <span>
                  Giảm giá{" "}
                  {Math.ceil(
                    100 - (product.salePrice / product.originalPrice) * 100,
                  )}
                  %
                </span>
              </Badge>
            )}
          </div>
          <CardContent className="flex flex-col p-6">
            <div className="mb-2 flex items-center text-lg">
              <div className="flex text-rose-500">
                {[1, 2, 3, 4, 5].map((index) => (
                  <Star
                    key={index}
                    className={cn("size-5", {
                      "fill-yellow-400 text-yellow-400": index <= 5,
                    })}
                  />
                ))}
              </div>
            </div>
            <h3 className="mb-1 line-clamp-2 min-h-16 text-xl font-medium text-gray-900 transition-colors group-hover:text-rose-700 sm:text-2xl">
              {product.productName}
            </h3>
            <p className="text-md mb-3 text-gray-600 sm:text-lg">
              {product.listTypes[0]?.typeName || "Chưa phân loại"}
            </p>
            <div className="mt-auto flex items-center justify-between">
              <div className="flex flex-col-reverse items-center gap-2 md:flex-row">
                <span className="text-xl font-bold text-rose-700 sm:text-2xl">
                  {product.salePrice.toLocaleString("vi-VN")}đ
                </span>
                {6 % 3 === 0 && (
                  <span className="text-lg text-gray-500 line-through">
                    {product.originalPrice.toLocaleString("vi-VN")}đ
                  </span>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="mt-auto px-6 pt-0 pb-6">
            {product.quantity > 0 ? (
              <Button
                onClick={(e) => handleAddShoppingCart(e, product.productId)}
                className="text-md group/btn relative flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-rose-600 to-red-600 py-4 text-white transition-all duration-300 hover:from-rose-700 hover:to-red-700 hover:shadow-lg sm:py-6 sm:text-lg"
              >
                <div className="relative z-10 flex items-center space-x-2">
                  <svg
                    className="h-4 w-4 transition-transform group-hover/btn:scale-110"
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
                  <span>Thêm vào giỏ hàng</span>
                  <ChevronRight className="ml-1 hidden h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1 md:block" />
                </div>
                <div className="absolute inset-0 origin-left scale-x-0 transform bg-gradient-to-r from-red-700 to-rose-700 transition-transform duration-300 group-hover/btn:scale-x-100"></div>
              </Button>
            ) : (
              <OutOfStock size="md" />
            )}
          </CardFooter>
        </Card>
      </Link>
    </>
  );
};

export default ProductCard;
