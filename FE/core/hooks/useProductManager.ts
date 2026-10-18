import { useCallback, useEffect, useState } from "react";
import {
  deleteProduct,
  getCategories,
  getProducts,
} from "@/core/apis/products";
import type { ListTypes, Product, ProductFiltersState } from "@/core/lib/type";
import type { PaginationModel } from "@/core/components/feature/admin/common/AdminDataTable";
import { toast } from "sonner";
import {
  DEFAULT_PAGINATION,
  INITIAL_PRODUCT_FILTERS,
} from "@/core/constants";

export type { ProductFiltersState };

export const useProductManager = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  // Delete confirmation dialog states
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Product types for filter
  const [productTypes, setProductTypes] = useState<ListTypes[]>([]);

  // Pagination states
  const [paginationModel, setPaginationModel] =
    useState<PaginationModel>(DEFAULT_PAGINATION);
  const [totalRows, setTotalRows] = useState(0);

  // Filter states: filters (draft form state) vs appliedFilters (API trigger state)
  const [filters, setFilters] =
    useState<ProductFiltersState>(INITIAL_PRODUCT_FILTERS);
  const [appliedFilters, setAppliedFilters] =
    useState<ProductFiltersState>(INITIAL_PRODUCT_FILTERS);
  const [isFilterApplied, setIsFilterApplied] = useState(false);

  // 1. Fetch categories/types once on mount
  const fetchProductTypes = useCallback(async () => {
    try {
      const response = await getCategories();
      const list = Array.isArray(response) ? response : [];
      const typesData: ListTypes[] = list.map((item) => ({
        typeId: item.typeId.toString(),
        typeName: item.typeName,
      }));

      setProductTypes(typesData);
    } catch (error) {
      console.error("Error fetching product types:", error);
      setProductTypes([]);
    }
  }, []);

  useEffect(() => {
    fetchProductTypes();
  }, [fetchProductTypes]);

  // 2. Fetch products triggered ONLY when paginationModel or appliedFilters changes
  const fetchProducts = useCallback(async () => {
    try {
      setIsLoadingProducts(true);

      const filterParams = {
        page: paginationModel.page,
        size: paginationModel.pageSize,
        ...Object.fromEntries(
          Object.entries(appliedFilters).filter(([_, value]) => {
            if (Array.isArray(value)) {
              return value.length > 0;
            }
            return value !== "" && value !== null;
          })
        ),
      };

      const response = await getProducts(filterParams);
      const rawList = response?.content ?? (Array.isArray(response) ? response : []);
      const total = response?.totalElements ?? rawList.length;

      const convertedProducts: Product[] = rawList.map((product) => ({
        ...product,
        productId: product.productId.toString(),
        manufactureDate: new Date(product.manufactureDate),
        listCombo: product.listCombo || [],
      }));

      setProducts(convertedProducts);
      setTotalRows(total);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
      setTotalRows(0);
    } finally {
      setIsLoadingProducts(false);
    }
  }, [paginationModel, appliedFilters]);

  // Initial load and when pagination / appliedFilters change
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Handlers for filters
  const handleFilterChange = useCallback(
    (field: keyof ProductFiltersState, value: any) => {
      setFilters((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const toggleFilterType = useCallback((typeIdNum: number) => {
    setFilters((prev) => {
      const exists = prev.typeId.includes(typeIdNum);
      const nextTypeIds = exists
        ? prev.typeId.filter((id) => id !== typeIdNum)
        : [...prev.typeId, typeIdNum];
      return { ...prev, typeId: nextTypeIds };
    });
  }, []);

  const handleApplyFilters = useCallback(() => {
    const hasValues = Boolean(
      filters.productName.trim() ||
        filters.minSalePrice ||
        filters.maxSalePrice ||
        filters.typeId.length > 0
    );
    setIsFilterApplied(hasValues);
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
    setAppliedFilters(filters);
  }, [filters]);

  const handleResetFilters = useCallback(() => {
    setFilters(INITIAL_PRODUCT_FILTERS);
    setAppliedFilters(INITIAL_PRODUCT_FILTERS);
    setIsFilterApplied(false);
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  }, []);

  const handlePaginationModelChange = useCallback((newModel: PaginationModel) => {
    setPaginationModel(newModel);
  }, []);

  const handleView = useCallback((product: Product) => {
    setSelectedProduct(product);
    setIsEditing(false);
    setIsViewing(true);
    setIsDialogOpen(true);
  }, []);

  const handleEdit = useCallback((product: Product) => {
    setSelectedProduct(product);
    setIsEditing(true);
    setIsViewing(false);
    setIsDialogOpen(true);
  }, []);

  const handleDelete = useCallback((product: Product) => {
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!productToDelete) return;

    setLoading(true);
    try {
      await deleteProduct(parseInt(productToDelete.productId));
      toast.success(
        `Đã xóa thành công sản phẩm "${productToDelete.productName}"`
      );
      setIsDeleteDialogOpen(false);
      setProductToDelete(null);
      await fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Không thể xóa sản phẩm. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  }, [productToDelete, fetchProducts]);

  const handleCancelDelete = useCallback(() => {
    setIsDeleteDialogOpen(false);
    setProductToDelete(null);
  }, []);

  const handleAdd = useCallback(() => {
    setSelectedProduct(null);
    setIsEditing(false);
    setIsViewing(false);
    setIsDialogOpen(true);
  }, []);

  const handleSave = useCallback(async () => {
    setLoading(true);
    try {
      setIsDialogOpen(false);
      setSelectedProduct(null);
      setIsEditing(false);
      setIsViewing(false);
      await fetchProducts();
    } catch (error) {
      console.error("Error refreshing products after save:", error);
    } finally {
      setLoading(false);
    }
  }, [fetchProducts]);

  const handleCloseDialog = useCallback(() => {
    setIsDialogOpen(false);
    setSelectedProduct(null);
    setIsEditing(false);
    setIsViewing(false);
  }, []);

  const refreshProducts = useCallback(async () => {
    await fetchProducts();
  }, [fetchProducts]);

  return {
    // Data states
    products,
    totalRows,
    loading,
    isLoadingProducts,
    paginationModel,

    // Filters states
    filters,
    appliedFilters,
    isFilterApplied,
    productTypes,

    // Dialog states
    selectedProduct,
    isDialogOpen,
    isEditing,
    isViewing,
    isDeleteDialogOpen,
    productToDelete,

    // Actions & Handlers
    refreshProducts,
    handlePaginationModelChange,
    handleFilterChange,
    toggleFilterType,
    handleApplyFilters,
    handleResetFilters,
    handleAdd,
    handleView,
    handleEdit,
    handleDelete,
    handleConfirmDelete,
    handleCancelDelete,
    handleSave,
    handleCloseDialog,
  };
};

export default useProductManager;
