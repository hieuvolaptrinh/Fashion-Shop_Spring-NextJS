import { getCategories } from '@/core/apis/products';
import { IMAGES } from '@/core/constants';
import type { CategoryItem } from '@/core/lib/type';
import { useEffect, useState } from 'react';

const CATEGORY_IMAGES = [
  IMAGES.DEMO_PRODUCTS.DEMO_1,
  IMAGES.DEMO_PRODUCTS.DEMO_2,
  IMAGES.DEMO_PRODUCTS.DEMO_3,
  IMAGES.DEMO_PRODUCTS.DEMO_4,
  IMAGES.DEMO_PRODUCTS.DEMO_5,
  IMAGES.DEMO_PRODUCTS.DEMO_6,
];

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

  const getCategoryImage = (index: number): string => {
    return (
      CATEGORY_IMAGES[index % CATEGORY_IMAGES.length] || IMAGES.FALLBACK_PRODUCT
    );
  };

  return {
    categories,
    loading,
    getCategoryImage,
  };
}
