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
const INITIAL_FILTERS: ProductFiltersState = INITIAL_PRODUCT_FILTERS;
const INITIAL_PAGINATION: PaginationModel = DEFAULT_PAGINATION;

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
  const [paginationModel, setPaginationModel] = useState<PaginationModel>(INITIAL_PAGINATION);
  const [totalRows, setTotalRows] = useState(0);

  // Filter states
  const [filters, setFilters] = useState<ProductFiltersState>(INITIAL_FILTERS);
  const [isFilterApplied, setIsFilterApplied] = useState(false);

  const fetchProductTypes = useCallback(async () => {
    try {
      const response = await getCategories();
      let typesData: ListTypes[] = [];

      if (Array.isArray(response)) {
        typesData = response;
      } else if (response && response.data && Array.isArray(response.data)) {
        typesData = response.data;
      } else if (
        response &&
        response.content &&
        Array.isArray(response.content)
      ) {
        typesData = response.content;
      }

      setProductTypes(typesData);
    } catch (error) {
      console.error("Error fetching product types:", error);
      setProductTypes([]);
    }
  }, []);

  const fetchProducts = useCallback(
    async (
      pageNumber?: number,
      pageSize?: number,
      currentFilters?: ProductFiltersState
    ) => {
      try {
        setIsLoadingProducts(true);
        const finalPageNumber =
          pageNumber !== undefined ? pageNumber : paginationModel.page;
        const finalPageSize =
          pageSize !== undefined ? pageSize : paginationModel.pageSize;
        const finalFilters =
          currentFilters !== undefined ? currentFilters : filters;

        const filterParams = {
          page: finalPageNumber,
          size: finalPageSize,
          ...Object.fromEntries(
            Object.entries(finalFilters).filter(([_, value]) => {
              if (Array.isArray(value)) {
                return value.length > 0;
              }
              return value !== "" && value !== null;
            })
          ),
        };

        const response = await getProducts(filterParams);

        let productsData: any[] = [];
        let pagination: any = {};

        if (response && response.content && Array.isArray(response.content)) {
          productsData = response.content;
          pagination = {
            totalElements: response.totalElements || 0,
            totalPages: response.totalPages || 0,
            number: response.pageNumber || 0,
            size: finalPageSize,
          };
        } else if (
          response &&
          response.data &&
          response.data.content &&
          Array.isArray(response.data.content)
        ) {
          productsData = response.data.content;
          pagination = {
            totalElements: response.data.totalElements || 0,
            totalPages: response.data.totalPages || 0,
            number: response.data.pageNumber || response.data.number || 0,
            size: finalPageSize,
          };
        }

        const convertedProducts: Product[] = productsData.map((product) => ({
          ...product,
          productId: product.productId.toString(),
          manufactureDate: new Date(product.manufactureDate),
          listCombo: product.listCombo || [],
        }));

        setProducts(convertedProducts);

        if (pagination.totalElements !== undefined) {
          setTotalRows(pagination.totalElements);
          setPaginationModel((prev) => ({
            ...prev,
            page: pagination.number || finalPageNumber,
            pageSize: finalPageSize,
          }));
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setIsLoadingProducts(false);
      }
    },
    [paginationModel, filters]
  );

  const handleFilterChange = useCallback((field: keyof ProductFiltersState, value: any) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  }, []);

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
    fetchProducts(0, paginationModel.pageSize, filters);
  }, [paginationModel.pageSize, filters, fetchProducts]);

  const handleResetFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
    setIsFilterApplied(false);
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
    fetchProducts(0, paginationModel.pageSize, INITIAL_FILTERS);
  }, [paginationModel.pageSize, fetchProducts]);

  const handlePaginationModelChange = useCallback(
    (newModel: PaginationModel) => {
      setPaginationModel(newModel);
      fetchProducts(newModel.page, newModel.pageSize, filters);
    },
    [filters, fetchProducts]
  );

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
      setProducts((prev) =>
        prev.filter((p) => p.productId !== productToDelete.productId)
      );
      toast.success(`Đã xóa thành công sản phẩm "${productToDelete.productName}"`);
      setIsDeleteDialogOpen(false);
      setProductToDelete(null);
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Không thể xóa sản phẩm. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  }, [productToDelete]);

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

  const handleSave = useCallback(
    async (productData: Product) => {
      setLoading(true);
      try {
        if (isEditing && selectedProduct) {
          setProducts((prev) =>
            prev.map((p) =>
              p.productId === selectedProduct.productId
                ? { ...productData, productId: selectedProduct.productId }
                : p
            )
          );
        } else {
          setProducts((prev) => {
            const maxId =
              prev.length > 0
                ? Math.max(...prev.map((p) => parseInt(p.productId) || 0))
                : 0;
            const newProduct = {
              ...productData,
              productId: (maxId + 1).toString(),
            };
            return [newProduct, ...prev];
          });
        }

        setIsDialogOpen(false);
        setSelectedProduct(null);
        await fetchProducts();
      } catch (error) {
        console.error("Error saving product:", error);
      } finally {
        setLoading(false);
      }
    },
    [isEditing, selectedProduct, fetchProducts]
  );

  const handleCloseDialog = useCallback(() => {
    setIsDialogOpen(false);
    setSelectedProduct(null);
    setIsEditing(false);
    setIsViewing(false);
  }, []);

  const refreshProducts = useCallback(async () => {
    await fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    Promise.all([fetchProducts(), fetchProductTypes()]);
  }, [fetchProducts, fetchProductTypes]);

  return {
    // Data states
    products,
    totalRows,
    loading,
    isLoadingProducts,
    paginationModel,

    // Filters states
    filters,
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
