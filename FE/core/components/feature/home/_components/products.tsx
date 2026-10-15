import { getProducts } from "@/core/apis/products";
import { Button } from "@/core/components/ui/button";
import { useEffect, useRef, useState } from "react";
import ProductCard from "./product.card";

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

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);

  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [showLoadMore, setShowLoadMore] = useState(false);

  const PAGE_SIZE = 5;
  const AUTO_LOAD_LIMIT = 40;

  const getListProducts = async (page: number) => {
    setLoading(true);
    try {
      const response = await getProducts({ page: page, size: PAGE_SIZE });

      // Handle the new API response structure
      const newProducts = response.content || [];
      const totalPages = response.totalPages || 0;
      const currentPage = response.pageNumber || page;

      // Loại bỏ duplicate products dựa trên productId
      setProducts((prev) => {
        const existingIds = new Set(prev.map((p: Product) => p.productId));
        const uniqueNewProducts = newProducts.filter(
          (p: Product) => !existingIds.has(p.productId),
        );
        return [...prev, ...uniqueNewProducts];
      });

      const totalLoaded = (currentPage + 1) * PAGE_SIZE;

      // Check if there are more products to load
      setHasMore(currentPage + 1 < totalPages);
      setShowLoadMore(
        totalLoaded >= AUTO_LOAD_LIMIT && currentPage + 1 < totalPages,
      );
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

  const getUniqueProducts = (products: Product[]): Product[] => {
    return products.filter(
      (product, index, self) =>
        index === self.findIndex((p) => p.productId === product.productId),
    );
  };

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Hàng mới về</h1>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:gap-6 md:grid-cols-4 lg:grid-cols-5">
        {getUniqueProducts(products).map((product) => (
          <ProductCard
            key={product.productId}
            product={product}
            variant="compact"
          />
        ))}
      </div>

      <div ref={loaderRef} className="py-4 text-center">
        {loading && <span>Đang tải...</span>}
      </div>

      {showLoadMore && hasMore && !loading && (
        <div className="my-4 text-center">
          <Button
            type="button"
            onClick={handleManualLoadMore}
            className="rounded-lg bg-gradient-to-r from-rose-600 to-red-600 px-6 py-3 text-white transition-all hover:from-rose-700 hover:to-red-700 hover:shadow-lg sm:rounded-xl sm:px-8 sm:py-4 sm:text-lg"
          >
            Xem thêm
          </Button>
        </div>
      )}

      {!(hasMore || loading) && (
        <div className="my-4 text-center text-gray-500">
          Đã hiển thị tất cả sản phẩm.
        </div>
      )}
    </section>
  );
}
