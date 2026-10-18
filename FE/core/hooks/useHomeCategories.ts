import { getCategories } from '@/core/apis/products';
import { getCategoryImage, getCategoryFallbackImage } from '@/core/lib/categoryUtils';
import type { CategoryItem } from '@/core/lib/type';
import { useEffect, useState } from 'react';

export function useHomeCategories() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await getCategories();
        if (isMounted) {
          setCategories(response || []);
        }
      } catch (error) {
        console.error('Lỗi khi tải danh mục sản phẩm:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  return {
    categories,
    loading,
    getCategoryImage: (item: CategoryItem, index: number) => getCategoryImage(item, index),
    getCategoryFallbackImage: (item: CategoryItem, index: number) =>
      getCategoryFallbackImage(item.typeName, index),
  };
}
