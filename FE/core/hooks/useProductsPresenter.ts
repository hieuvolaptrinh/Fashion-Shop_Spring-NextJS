import { getCategories, getProducts, type ProductQueryFilters } from '@/core/apis/products';
import { PRICE_RANGES } from '@/core/components/feature/products/ProductsFilterBar';
import type { CategoryItem, Product } from '@/core/lib/type';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

export const PAGE_SIZE = 8;

export function useProductsPresenter() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0); // 0-indexed cho Backend Spring Boot
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPriceRange, setSelectedPriceRange] = useState('ALL');
  const [sortBy, setSortBy] = useState('DEFAULT');
  const [categories, setCategories] = useState<CategoryItem[]>([]);

  const categoryParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const typeParam = categoryParams.get('typeId');

  const selectedCategory = useMemo(() => {
    if (!typeParam) return null;
    return categories.find((c) => c.typeId.toString() === typeParam) || null;
  }, [typeParam, categories]);

  const hasActiveFilters = Boolean(
    searchTerm.trim() ||
      selectedPriceRange !== 'ALL' ||
      typeParam ||
      sortBy !== 'DEFAULT'
  );

  const fetchProductsList = async (
    pageIndex: number,
    keyword: string,
    typeIdParam: string | null,
    priceKey: string
  ) => {
    setLoading(true);
    try {
      const filters: ProductQueryFilters = {
        page: pageIndex,
        size: PAGE_SIZE,
      };

      if (keyword.trim()) {
        filters.productName = keyword.trim();
      }

      if (typeIdParam) {
        filters.typeId = [Number(typeIdParam)];
      }

      const range = PRICE_RANGES.find((r) => r.key === priceKey);
      if (range?.min !== undefined) {
        filters.minSalePrice = range.min;
      }
      if (range?.max !== undefined) {
        filters.maxSalePrice = range.max;
      }

      const response = await getProducts(filters);
      setProducts(response.content || []);
      setTotalPages(response.totalPages || 1);
      setTotalElements(response.totalElements || 0);
    } catch (error) {
      console.error('Lỗi khi gọi API sản phẩm:', error);
      setProducts([]);
      setTotalPages(1);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProductsList(page, searchTerm, typeParam, selectedPriceRange);
    }, 250);
    return () => clearTimeout(timer);
  }, [page, searchTerm, typeParam, selectedPriceRange]);

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    setPage(0);
  };

  const handlePriceRangeChange = (rangeKey: string) => {
    setSelectedPriceRange(rangeKey);
    setPage(0);
  };

  const handleSortChange = (sortKey: string) => {
    setSortBy(sortKey);
  };

  const handleCategorySelect = (typeId?: string | number) => {
    setPage(0);
    const params = new URLSearchParams(categoryParams.toString());
    if (!typeId) {
      params.delete('typeId');
    } else {
      if (typeParam === typeId.toString()) {
        params.delete('typeId');
      } else {
        params.set('typeId', typeId.toString());
      }
    }
    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname, {
      scroll: false,
    });
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedPriceRange('ALL');
    setSortBy('DEFAULT');
    setPage(0);
    if (typeParam) {
      router.push(pathname, { scroll: false });
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage - 1);
    window.scrollTo({ top: 180, behavior: 'smooth' });
  };

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    loadCategories();
  }, []);

  const sortedProducts = useMemo(() => {
    const list = [...products];
    if (sortBy === 'PRICE_ASC') {
      list.sort((a, b) => a.salePrice - b.salePrice);
    } else if (sortBy === 'PRICE_DESC') {
      list.sort((a, b) => b.salePrice - a.salePrice);
    }
    return list;
  }, [products, sortBy]);

  return {
    products: sortedProducts,
    loading,
    page,
    totalPages,
    totalElements,
    pageSize: PAGE_SIZE,
    searchTerm,
    selectedPriceRange,
    sortBy,
    categories,
    typeParam,
    selectedCategory,
    hasActiveFilters,
    handleSearchChange,
    handlePriceRangeChange,
    handleSortChange,
    handleCategorySelect,
    handleClearFilters,
    handlePageChange,
  };
}
