'use client';

import { getProducts } from '@/core/apis/products';
import ProductCard from '@/core/components/feature/products/ProductCard';
import type { Product } from '@/core/lib/type';
import { useEffect, useState } from 'react';

interface ProductRelatedProps {
  currentProductId: string | number;
  typeId?: string | number;
}

export function ProductRelated({ currentProductId, typeId }: ProductRelatedProps) {
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchRelated = async () => {
      setLoading(true);
      try {
        const parsedTypeId = typeId ? Number(typeId) : undefined;
        const filters = parsedTypeId ? { typeId: [parsedTypeId], size: 6 } : { size: 6 };
        const res = await getProducts(filters);
        const list: Product[] = res?.content ?? (Array.isArray(res) ? res : []);

        if (isMounted) {
          const filtered = list
            .filter((p) => String(p.productId) !== String(currentProductId))
            .slice(0, 4);
          setRelatedProducts(filtered);
        }
      } catch (error) {
        console.error('Lỗi khi tải sản phẩm tương tự:', error);
        if (isMounted) setRelatedProducts([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchRelated();

    return () => {
      isMounted = false;
    };
  }, [currentProductId, typeId]);

  if (!loading && relatedProducts.length === 0) {
    return null;
  }

  return (
    <section className="mt-14 border-t border-border/60 pt-12 sm:mt-18 sm:pt-16">
      <div className="mb-8 flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-end">
        <div>
          <h3 className="mt-1 text-xl font-black tracking-tight text-foreground sm:text-2xl">
            Sản phẩm tương tự & Cùng loại
          </h3>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            Các lựa chọn được nhiều khách hàng yêu thích trong cùng danh mục
          </p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 sm:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-72 animate-pulse rounded-2xl border border-border/60 bg-muted/30"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 sm:gap-6">
          {relatedProducts.map((prod) => (
            <ProductCard key={prod.productId} product={prod} />
          ))}
        </div>
      )}
    </section>
  );
}
