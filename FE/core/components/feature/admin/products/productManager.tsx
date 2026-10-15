"use client";

import {
  deleteProduct,
  getCategories,
  getProducts,
} from "@/core/apis/products";
import type { ListTypes, Product } from "@/core/lib/type";
import Refresh from "@mui/icons-material/Refresh";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { GridPaginationModel, GridSortModel } from "@mui/x-data-grid/models";
import { useCallback, useEffect, useState } from "react";
import ConfirmDelete from "./confirm.delete";
import ProductDetails from "./productDetails";
import ProductsDataGrid from "./productsDataGrid";

const ProductManager = () => {
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

  // DataGrid states
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });
  const [totalRows, setTotalRows] = useState(0);
  const [sortModel, setSortModel] = useState<GridSortModel>([]);

  // Filter states
  const [filters, setFilters] = useState({
    productName: "",
    minSalePrice: "",
    maxSalePrice: "",
    typeId: [] as number[],
  });

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
      currentFilters?: typeof filters,
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
            }),
          ),
        };

        const response = await getProducts(filterParams);

        let productsData: any[] = [];
        let pagination: any = {};

        // Handle response structure from backend
        // Response structure: { status, error, message, data: { content: [], pageNumber, totalElements, totalPages } }
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
          // Fallback for old structure
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
          productId: product.productId.toString(), // Ensure productId is string
          manufactureDate: new Date(product.manufactureDate),
          listCombo: product.listCombo || [],
        }));

        setProducts(convertedProducts);

        // Update pagination info
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
    [paginationModel, filters],
  );

  // Handle filter changes
  const handleFilterChange = useCallback((field: string, value: any) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleApplyFilters = useCallback(() => {
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
    fetchProducts(0, paginationModel.pageSize, filters);
  }, [paginationModel.pageSize, filters, fetchProducts]);

  const handleResetFilters = useCallback(() => {
    const resetFilters = {
      productName: "",
      minSalePrice: "",
      maxSalePrice: "",
      typeId: [] as number[],
    };
    setFilters(resetFilters);
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
    fetchProducts(0, paginationModel.pageSize, resetFilters);
  }, [paginationModel.pageSize, fetchProducts]);

  // DataGrid handlers
  const handlePaginationModelChange = useCallback(
    (newModel: GridPaginationModel) => {
      setPaginationModel(newModel);
      fetchProducts(newModel.page, newModel.pageSize, filters);
    },
    [filters, fetchProducts],
  );

  const handleSortModelChange = useCallback((newModel: GridSortModel) => {
    setSortModel(newModel);
    // Client-side sorting is handled by DataGrid
  }, []);

  // Action handlers for DataGrid
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

  const handleDelete = useCallback(async (product: Product) => {
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!productToDelete) return;

    setLoading(true);
    try {
      await deleteProduct(parseInt(productToDelete.productId));
      setProducts((prev) =>
        prev.filter((p) => p.productId !== productToDelete.productId),
      );
      setIsDeleteDialogOpen(false);
      setProductToDelete(null);
    } catch (error) {
      console.error("Error deleting product:", error);
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
          // Update existing product
          setProducts((prev) =>
            prev.map((p) =>
              p.productId === selectedProduct.productId
                ? { ...productData, productId: selectedProduct.productId }
                : p,
            ),
          );
        } else {
          // Add new product
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

        // Refresh data from server to get latest state
        await fetchProducts();
      } catch (error) {
        console.error("Error saving product:", error);
      } finally {
        setLoading(false);
      }
    },
    [isEditing, selectedProduct, fetchProducts],
  );

  const handleCloseDialog = useCallback(() => {
    setIsDialogOpen(false);
    setSelectedProduct(null);
    setIsEditing(false);
    setIsViewing(false);
  }, []);

  // Initial data fetch
  const initializeData = useCallback(async () => {
    await Promise.all([fetchProducts(), fetchProductTypes()]);
  }, [fetchProducts, fetchProductTypes]);

  // Fetch products on component mount
  useEffect(() => {
    initializeData();
  }, []);

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Page Header */}
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <Box>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 700,
              color: "text.primary",
              mb: 1,
            }}
          >
            Quản lý sản phẩm
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "text.secondary",
            }}
          >
            Quản lý thông tin sản phẩm và combo trong hệ thống
          </Typography>
        </Box>
        <Tooltip title="Tải lại dữ liệu">
          <IconButton
            onClick={() => fetchProducts()}
            disabled={isLoadingProducts}
            sx={{
              bgcolor: "action.hover",
              "&:hover": { bgcolor: "action.selected" },
            }}
          >
            <Refresh />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Bộ lọc
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: 3,
            }}
          >
            <TextField
              fullWidth
              size="small"
              label="Tên sản phẩm"
              value={filters.productName}
              onChange={(e) =>
                handleFilterChange("productName", e.target.value)
              }
              placeholder="Nhập tên sản phẩm"
            />
            <FormControl fullWidth size="small">
              <InputLabel>Loại sản phẩm</InputLabel>
              <Select
                multiple
                value={filters.typeId}
                onChange={(e) => handleFilterChange("typeId", e.target.value)}
                label="Loại sản phẩm"
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {(selected as number[]).map((value) => {
                      const type = productTypes.find(
                        (t) => parseInt(t.typeId) === value,
                      );
                      return (
                        <Chip
                          key={value}
                          label={type?.typeName || value}
                          size="small"
                          variant="outlined"
                        />
                      );
                    })}
                  </Box>
                )}
              >
                {productTypes.map((type) => (
                  <MenuItem key={type.typeId} value={parseInt(type.typeId)}>
                    {type.typeName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              size="small"
              label="Giá tối thiểu"
              type="number"
              value={filters.minSalePrice}
              onChange={(e) =>
                handleFilterChange("minSalePrice", e.target.value)
              }
              placeholder="0"
            />
            <TextField
              fullWidth
              size="small"
              label="Giá tối đa"
              type="number"
              value={filters.maxSalePrice}
              onChange={(e) =>
                handleFilterChange("maxSalePrice", e.target.value)
              }
              placeholder="1000000"
            />
          </Box>
          <Box sx={{ display: "flex", gap: 1, mt: 3 }}>
            <Button
              variant="contained"
              onClick={handleApplyFilters}
              sx={{ borderRadius: 2 }}
            >
              Lọc
            </Button>
            <Button
              variant="outlined"
              onClick={handleResetFilters}
              sx={{ borderRadius: 2 }}
            >
              Đặt lại
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Add Product Button */}
      <Box sx={{ mb: 3, display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          onClick={handleAdd}
          sx={{
            backgroundColor: "primary.main",
            "&:hover": { backgroundColor: "primary.dark" },
          }}
        >
          Thêm sản phẩm
        </Button>
      </Box>

      {/* Products DataGrid */}
      <ProductsDataGrid
        products={products}
        loading={isLoadingProducts}
        paginationModel={paginationModel}
        totalRows={totalRows}
        sortModel={sortModel}
        onPaginationModelChange={handlePaginationModelChange}
        onSortModelChange={handleSortModelChange}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Product Details Dialog */}
      <ProductDetails
        open={isDialogOpen}
        onClose={handleCloseDialog}
        onSave={handleSave}
        product={selectedProduct}
        isEditing={isEditing}
        isViewing={isViewing}
        loading={loading}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDelete
        open={isDeleteDialogOpen}
        product={productToDelete}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        loading={loading}
      />
    </Container>
  );
};

export default ProductManager;
