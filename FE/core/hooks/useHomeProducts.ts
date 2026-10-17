import { getProducts } from '@/core/apis/products';
import type { Product } from '@/core/lib/type';
import { useEffect, useState } from 'react';

export const DEFAULT_HOME_PRODUCT_LIMIT = 8;

export function useHomeProducts(limit = DEFAULT_HOME_PRODUCT_LIMIT) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchHomeProducts = async () => {
      setLoading(true);
      try {
        const response = await getProducts({ page: 0, size: limit });
        const productList = response?.content || response || [];
        if (isMounted) {
          setProducts(productList.slice(0, limit));
        }
      } catch (error) {
        console.error('Lỗi khi tải danh sách sản phẩm trang chủ:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchHomeProducts();
    return () => {
      isMounted = false;
    };
  }, [limit]);

  return {
    products,
    loading,
  };
}
