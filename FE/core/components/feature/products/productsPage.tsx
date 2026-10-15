"use client";

import { getCategories, getProducts } from "@/core/apis/products";
import ProductCard from "@/core/components/feature/home/_components/product.card";
import { Button } from "@/core/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/core/components/ui/dropdown-menu";
import { Input } from "@/core/components/ui/input";
import type { CategoryItem, Product } from "@/core/lib/type";
import { Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import ShoppingGuide from "./shopping.guie";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    const filtered = products.filter((product) =>
      product.productName.toLowerCase().includes(value.toLowerCase()),
    );
    setFilteredProducts(filtered);
  };

  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const [showLoadMore, setShowLoadMore] = useState(false);

  const [categories, setCategories] = useState<CategoryItem[]>([]);

  const PAGE_SIZE = 5;
  const AUTO_LOAD_LIMIT = 40;

  const categoryParams = useSearchParams();

  const getListProducts = async (page: number) => {
    setLoading(true);
    try {
      const response = await getProducts({ page: page, size: PAGE_SIZE });
      const newProducts = response.content;

      // Loại bỏ duplicate products dựa trên productId
      setProducts((prev) => {
        const existingIds = new Set(prev.map((p: Product) => p.productId));
        const uniqueNewProducts = newProducts.filter(
          (p: Product) => !existingIds.has(p.productId),
        );
        return [...prev, ...uniqueNewProducts];
      });

      const totalLoaded = (page + 1) * PAGE_SIZE;

      setHasMore(newProducts.length > 0); // còn dữ liệu không
      setShowLoadMore(totalLoaded >= AUTO_LOAD_LIMIT && newProducts.length > 0);
    } catch (error) {
      console.error("Lỗi khi gọi API sản phẩm", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (products.length >= AUTO_LOAD_LIMIT || showLoadMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !loading && hasMore) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1.0 },
    );

    const currentLoader = loaderRef.current;
    if (currentLoader) observer.observe(currentLoader);

    return () => {
      if (currentLoader) observer.unobserve(currentLoader);
    };
  }, [products, loading, hasMore, showLoadMore]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    getListProducts(page);
  }, [page]);

  const handleManualLoadMore = () => {
    if (hasMore) setPage((prev) => prev + 1);
  };

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    fetchCategories();
  }, []);

  const typeParam = categoryParams.get("typeId");

  const filterProducts = () => {
    let filtered: Product[] = [];

    if (typeParam) {
      filtered = products.filter((item) =>
        item.listTypes.some((type) => type.typeId.toString() === typeParam),
      );
    } else if (searchTerm) {
      filtered = filteredProducts.filter((product) =>
        product.productName.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    } else {
      filtered = products;
    }

    // Đảm bảo không có duplicate products trong kết quả filter
    const uniqueFiltered = filtered.filter(
      (product, index, self) =>
        index === self.findIndex((p) => p.productId === product.productId),
    );

    return uniqueFiltered;
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="min-h-screen bg-gradient-to-b from-white to-rose-50">
        {/* Hero Banner - Responsive */}

        <div className="relative hidden md:block">
          <div className="flex h-48 justify-center overflow-hidden bg-gradient-to-r from-rose-900 to-red-600 sm:h-64 md:h-80 lg:h-96 xl:h-[400px]">
            <div className="container flex h-full flex-col items-center justify-center px-4 py-6 text-center sm:py-8 md:py-12">
              <h1 className="mb-2 text-2xl font-bold tracking-tight text-white sm:mb-4 sm:text-3xl md:text-4xl lg:text-5xl">
                Bộ Sưu Tập Sản Phẩm Cao Cấp
              </h1>
              <p className="max-w-xs text-sm text-rose-100 sm:max-w-md sm:text-base md:max-w-lg md:text-lg lg:max-w-2xl lg:text-xl">
                Khám phá những sản phẩm chất lượng cao, được thiết kế đặc biệt
                cho nhu cầu của bạn
              </p>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-3 py-6 sm:px-4 sm:py-8 lg:py-12">
          {/* Search and Filter Bar - Responsive */}
          <div className="mb-6 rounded-xl border border-rose-100 bg-white p-3 shadow-lg sm:mb-8 sm:rounded-2xl sm:p-4 lg:mb-12 lg:p-6">
            <div className="flex flex-col gap-3 sm:gap-4 md:flex-row md:items-center lg:gap-6">
              <div className="relative flex-grow">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-rose-500 sm:left-4 sm:h-5 sm:w-5" />
                <Input
                  value={searchTerm}
                  onChange={handleSearch}
                  type="search"
                  placeholder="Tìm kiếm sản phẩm..."
                  className="w-full rounded-lg border-2 border-rose-200 py-3 pr-3 pl-10 text-base focus-visible:ring-rose-500 sm:rounded-xl sm:py-4 sm:pr-4 sm:pl-12 sm:text-lg lg:py-6"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full rounded-lg border-rose-200 bg-white px-2 py-1 text-xs font-medium text-rose-700 hover:bg-rose-50 sm:px-2.5 sm:py-1.5 sm:text-sm md:w-auto md:px-3 md:py-2 md:text-base"
                  >
                    {typeParam
                      ? categories.find(
                          (c) => c.typeId.toString() === typeParam,
                        )?.typeName || "Tất cả"
                      : "Tất cả"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[200px] sm:w-[250px]">
                  <DropdownMenuItem
                    onClick={() => {
                      const url = new URL(window.location.href);
                      url.searchParams.delete("typeId");
                      window.history.pushState({}, "", url.toString());
                    }}
                    className={typeParam ? "" : "bg-rose-50 text-rose-700"}
                  >
                    Tất cả
                  </DropdownMenuItem>
                  {categories.map((category) => (
                    <DropdownMenuItem
                      key={category.typeId}
                      onClick={() => {
                        const url = new URL(window.location.href);
                        if (typeParam === category.typeId.toString()) {
                          url.searchParams.delete("typeId");
                        } else {
                          url.searchParams.set(
                            "typeId",
                            category.typeId.toString(),
                          );
                        }
                        window.history.pushState({}, "", url.toString());
                      }}
                      className={
                        typeParam === category.typeId.toString()
                          ? "bg-rose-50 text-rose-700"
                          : ""
                      }
                    >
                      {category.typeName}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Products Grid - Enhanced Responsive Layout */}
          <div className="grid grid-cols-3 gap-3 sm:gap-6 md:grid-cols-4 lg:grid-cols-5">
            {filterProducts().map((product) => (
              <ProductCard
                key={product.productId}
                product={product}
                variant="compact"
              />
            ))}
          </div>

          <div ref={loaderRef} className="py-4 text-center">
            {loading && (
              <div className="flex items-center justify-center">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-rose-600 border-t-transparent sm:h-8 sm:w-8"></div>
                <span className="ml-2 text-sm text-gray-600 sm:text-base">
                  Đang tải...
                </span>
              </div>
            )}
          </div>

          {showLoadMore && hasMore && !loading && (
            <div className="my-6 text-center sm:my-8">
              <Button
                onClick={handleManualLoadMore}
                className="rounded-lg bg-gradient-to-r from-rose-600 to-red-600 px-6 py-3 text-white transition-all hover:from-rose-700 hover:to-red-700 hover:shadow-lg sm:rounded-xl sm:px-8 sm:py-4 sm:text-lg"
              >
                Xem thêm sản phẩm
              </Button>
            </div>
          )}

          {!(hasMore || loading) && (
            <div className="my-6 text-center text-gray-500 sm:my-8">
              <p className="text-sm sm:text-base">
                Đã hiển thị tất cả sản phẩm.
              </p>
            </div>
          )}

          {/* Shopping Guide */}
          <div className="mt-8 sm:mt-12">
            <ShoppingGuide />
          </div>
        </div>
      </div>
    </Suspense>
  );
}
