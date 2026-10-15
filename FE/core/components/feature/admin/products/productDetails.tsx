"use client";

import {
  createProduct,
  getCategories,
  updateProduct,
} from "@/core/apis/products";
import { Combo, ListTypes, Product, ProductRequest } from "@/core/lib/type";
import Close from "@mui/icons-material/Close";
import Delete from "@mui/icons-material/Delete";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import ComboSection from "./combo.section";

interface ProductDetailsProps {
  open: boolean;
  onClose: () => void;
  onSave: (product: Product, files: File[], deletedImageIds: string[]) => void;
  product?: Product | null;
  isEditing?: boolean;
  isViewing?: boolean;
  loading?: boolean;
}

const ProductDetails = ({
  open,
  onClose,
  onSave,
  product,
  isEditing = false,
  isViewing = false,
  loading = false,
}: ProductDetailsProps) => {
  // Form data state
  const [formData, setFormData] = useState<Product>({
    productId: "",
    productName: "",
    originalPrice: 0,
    salePrice: 0,
    quantity: 0,
    description: "",
    usageInstructions: "",
    ingredients: "",
    manufactureDate: new Date(),
    listImages: [],
    listTypes: [],
  });

  // Other states
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [productTypes, setProductTypes] = useState<ListTypes[]>([]);
  const [isLoadingTypes, setIsLoadingTypes] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [deletedImageIds, setDeletedImageIds] = useState<string[]>([]);
  const [combos, setCombos] = useState<Combo[]>([]);
  const [deletedComboIds, setDeletedComboIds] = useState<number[]>([]);

  useEffect(() => {
    if (open) {
      fetchProductTypes();
    }
  }, [open]);

  const fetchProductTypes = async () => {
    try {
      setIsLoadingTypes(true);
      const response = await getCategories();
      let typesData: ListTypes[] = [];
      if (Array.isArray(response)) {
        typesData = response.map((item) => ({
          typeId: item.typeId.toString(),
          typeName: item.typeName,
        }));
      } else if (response && response.data && Array.isArray(response.data)) {
        typesData = response.data.map((item: any) => ({
          typeId: item.typeId.toString(),
          typeName: item.typeName,
        }));
      } else if (
        response &&
        response.content &&
        Array.isArray(response.content)
      ) {
        typesData = response.content.map((item: any) => ({
          typeId: item.typeId.toString(),
          typeName: item.typeName,
        }));
      }
      setProductTypes(typesData);
    } catch (error) {
      console.error("Error fetching product types:", error);
      setProductTypes([]);
    } finally {
      setIsLoadingTypes(false);
    }
  };

  useEffect(() => {
    if (product && (isEditing || isViewing)) {
      const transformedProduct: Product = {
        ...product,
        productId: product.productId.toString(),
        listCombo: product.listCombo || [],
        usageInstructions: product.usageInstructions || "",
        ingredients: product.ingredients || "",
        manufactureDate:
          product.manufactureDate instanceof Date
            ? product.manufactureDate
            : new Date(product.manufactureDate),
      };
      setFormData(transformedProduct);
      setCombos(transformedProduct.listCombo || []);
      setDeletedComboIds([]);
      setDeletedImageIds([]);
      setNewImageFiles([]);
      setErrors({});
    } else if (!isEditing && !isViewing) {
      // Reset form
      setFormData({
        productId: "",
        productName: "",
        originalPrice: 0,
        salePrice: 0,
        quantity: 0,
        description: "",
        usageInstructions: "",
        ingredients: "",
        manufactureDate: new Date(),
        listImages: [],
        listTypes: [],
      });
      setCombos([]);
      setDeletedComboIds([]);
      setDeletedImageIds([]);
      setNewImageFiles([]);
      setErrors({});
    }
  }, [product, isEditing, isViewing, open]);

  const addCombo = () => {
    const newCombo: Combo = {
      quantityInCombo: 1,
      comboPrice: 0,
      comboDescription: "",
    };
    setCombos([...combos, newCombo]);
  };

  const removeCombo = (index: number) => {
    const comboToRemove = combos[index];
    if (comboToRemove?.comboId) {
      setDeletedComboIds([...deletedComboIds, comboToRemove.comboId]);
    }
    setCombos(combos.filter((_, i) => i !== index));
  };

  const updateCombo = (index: number, field: keyof Combo, value: any) => {
    const updatedCombos = combos.map((combo, i) =>
      i === index ? { ...combo, [field]: value } : combo,
    );
    setCombos(updatedCombos);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.productName.trim()) {
      newErrors.productName = "Tên sản phẩm không được để trống";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Mô tả sản phẩm không được để trống";
    }
    if (formData.originalPrice <= 0) {
      newErrors.originalPrice = "Giá gốc phải lớn hơn 0";
    }
    if (formData.salePrice <= 0) {
      newErrors.salePrice = "Giá bán phải lớn hơn 0";
    }
    if (formData.quantity < 0) {
      newErrors.quantity = "Số lượng không được âm";
    }
    if (!formData.usageInstructions.trim()) {
      newErrors.usageInstructions = "Hướng dẫn sử dụng không được để trống";
    }
    if (!formData.ingredients.trim()) {
      newErrors.ingredients = "Thành phần không được để trống";
    }
    if (
      !(formData.manufactureDate instanceof Date) ||
      isNaN(formData.manufactureDate.getTime())
    ) {
      newErrors.manufactureDate = "Ngày sản xuất không hợp lệ";
    }

    combos.forEach((combo, index) => {
      if (combo.quantityInCombo <= 0) {
        newErrors[`combo_${index}_quantity`] =
          `Số lượng combo ${index + 1} phải lớn hơn 0`;
      }
      if (combo.comboPrice <= 0) {
        newErrors[`combo_${index}_price`] =
          `Giá combo ${index + 1} phải lớn hơn 0`;
      }
      if (
        combo.quantityInCombo > 0 &&
        combo.comboPrice >= formData.salePrice * combo.quantityInCombo
      ) {
        newErrors[`combo_${index}_price`] =
          `Giá combo ${index + 1} phải nhỏ hơn giá lẻ (${(formData.salePrice * combo.quantityInCombo).toLocaleString("vi-VN")}₫)`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (validateForm()) {
      try {
        setIsSubmitting(true);

        const productRequest: ProductRequest = {
          productId: isEditing ? parseInt(formData.productId || "0") : 0,
          productName: formData.productName,
          description: formData.description,
          originalPrice: formData.originalPrice,
          usageInstructions: formData.usageInstructions || undefined,
          ingredients: formData.ingredients || undefined,
          salePrice: formData.salePrice,
          quantity: formData.quantity,
          manufactureDate:
            formData.manufactureDate instanceof Date
              ? formData.manufactureDate.toISOString().split("T")[0]
              : undefined,
          listTypes: formData.listTypes.map((type: ListTypes) =>
            parseInt(type.typeId),
          ),
          deletedImageIds: deletedImageIds
            .map((id: string) => parseInt(String(id)))
            .filter((id: number) => !isNaN(id)),
          deletedComboIds:
            deletedComboIds.length > 0 ? deletedComboIds : undefined,
          listCombo: combos.length > 0 ? combos : undefined,
        };

        if (isEditing) {
          await updateProduct(
            productRequest,
            newImageFiles,
            localStorage.getItem("accessToken"),
          );
        } else {
          const { productId, ...createRequest } = productRequest;
          await createProduct(
            createRequest,
            newImageFiles,
            localStorage.getItem("accessToken"),
          );
        }

        const savedProduct: Product = {
          ...formData,
          productId: formData.productId || "0",
          listCombo: combos,
          usageInstructions: formData.usageInstructions,
          ingredients: formData.ingredients,
        };
        onSave(savedProduct, newImageFiles, deletedImageIds);
      } catch (error: any) {
        console.error("=== ERROR in handleSave ===");
        console.error("Full error object:", error);
        console.error("Error response:", error.response);
        console.error("Error response data:", error.response?.data);
        console.error("Error response status:", error.response?.status);

        let errorMessage = "Có lỗi xảy ra khi lưu sản phẩm";
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.message) {
          errorMessage = error.message;
        }
        alert(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setNewImageFiles((prev) => [...prev, ...fileArray]);
      const newDisplayImages = fileArray.map((file) => ({
        imageId: "",
        link: URL.createObjectURL(file),
      }));
      setFormData((prev) => ({
        ...prev,
        listImages: [...prev.listImages, ...newDisplayImages],
      }));
    }
  };

  const handleRemoveImage = (index: number) => {
    const imageToRemove = formData.listImages[index];
    if (imageToRemove && imageToRemove.imageId) {
      setDeletedImageIds((prev) => [...prev, imageToRemove.imageId!]);
    } else {
      const fileIndex = newImageFiles.findIndex(
        (file: File) => URL.createObjectURL(file) === imageToRemove?.link,
      );
      if (fileIndex >= 0) {
        setNewImageFiles((prev) => prev.filter((_, i) => i !== fileIndex));
      }
    }
    setFormData((prev) => ({
      ...prev,
      listImages: prev.listImages.filter((_, i) => i !== index),
    }));
  };

  const handleTypeChange = (selectedTypes: ListTypes[]) => {
    setFormData((prev) => ({
      ...prev,
      listTypes: selectedTypes,
    }));
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: "90vh",
        },
      }}
    >
      <DialogTitle
        sx={{
          pb: 2,
          borderBottom: 1,
          borderColor: "divider",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {isViewing
            ? "Chi tiết sản phẩm"
            : isEditing
              ? "Chỉnh sửa sản phẩm"
              : "Thêm sản phẩm mới"}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <TextField
            fullWidth
            label="Tên sản phẩm"
            value={formData.productName}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, productName: e.target.value }))
            }
            error={!!errors.productName}
            helperText={errors.productName}
            required
            disabled={isViewing}
            sx={{
              bgcolor: isViewing ? "action.disabledBackground" : "inherit",
            }}
          />

          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              fullWidth
              label="Giá gốc"
              type="number"
              value={formData.originalPrice}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  originalPrice: Number(e.target.value),
                }))
              }
              error={!!errors.originalPrice}
              helperText={errors.originalPrice}
              InputProps={{
                endAdornment: <InputAdornment position="end">₫</InputAdornment>,
                inputProps: { min: 0, step: 1000 },
              }}
              required
              disabled={isViewing}
              sx={{
                bgcolor: isViewing ? "action.disabledBackground" : "inherit",
              }}
            />
            <TextField
              fullWidth
              label="Giá bán"
              type="number"
              value={formData.salePrice}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  salePrice: Number(e.target.value),
                }))
              }
              error={!!errors.salePrice}
              helperText={errors.salePrice}
              InputProps={{
                endAdornment: <InputAdornment position="end">₫</InputAdornment>,
                inputProps: { min: 0, step: 1000 },
              }}
              required
              disabled={isViewing}
              sx={{
                bgcolor: isViewing ? "action.disabledBackground" : "inherit",
              }}
            />
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              fullWidth
              label="Số lượng"
              type="number"
              value={formData.quantity}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  quantity: Number(e.target.value),
                }))
              }
              error={!!errors.quantity}
              helperText={errors.quantity}
              InputProps={{
                inputProps: { min: 0 },
              }}
              required
              disabled={isViewing}
              sx={{
                bgcolor: isViewing ? "action.disabledBackground" : "inherit",
              }}
            />
            <TextField
              fullWidth
              label="Hạn sử dụng"
              type="date"
              value={
                formData.manufactureDate instanceof Date
                  ? formData.manufactureDate.toISOString().split("T")[0]
                  : ""
              }
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  manufactureDate: new Date(e.target.value),
                }))
              }
              error={!!errors.manufactureDate}
              helperText={errors.manufactureDate}
              InputLabelProps={{ shrink: true }}
              required
              disabled={isViewing}
              sx={{
                bgcolor: isViewing ? "action.disabledBackground" : "inherit",
              }}
            />
          </Box>

          <Autocomplete
            multiple
            options={productTypes}
            getOptionLabel={(option) => option.typeName}
            value={formData.listTypes}
            onChange={(_, newValue) => handleTypeChange(newValue)}
            loading={isLoadingTypes}
            disabled={isViewing}
            renderTags={(tagValue, getTagProps) =>
              tagValue.map((option, index) => (
                <Chip
                  label={option.typeName}
                  {...getTagProps({ index })}
                  key={option.typeId}
                  variant="outlined"
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Loại sản phẩm"
                placeholder={
                  isLoadingTypes ? "Đang tải..." : "Chọn loại sản phẩm"
                }
                helperText={
                  productTypes.length === 0 && !isLoadingTypes
                    ? "Không có loại sản phẩm"
                    : ""
                }
              />
            )}
            sx={{
              bgcolor: isViewing ? "action.disabledBackground" : "inherit",
            }}
          />

          <ComboSection
            combos={combos}
            onAddCombo={addCombo}
            onRemoveCombo={removeCombo}
            onUpdateCombo={updateCombo}
            salePrice={formData.salePrice}
            errors={errors}
            isViewing={isViewing}
          />

          <TextField
            fullWidth
            label="Mô tả sản phẩm"
            multiline
            rows={3}
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            error={!!errors.description}
            helperText={errors.description}
            disabled={isViewing}
            required
            sx={{
              bgcolor: isViewing ? "action.disabledBackground" : "inherit",
            }}
          />

          <TextField
            fullWidth
            label="Hướng dẫn sử dụng"
            multiline
            rows={3}
            value={formData.usageInstructions}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                usageInstructions: e.target.value,
              }))
            }
            error={!!errors.usageInstructions}
            helperText={errors.usageInstructions}
            disabled={isViewing}
            required
            sx={{
              bgcolor: isViewing ? "action.disabledBackground" : "inherit",
            }}
          />

          <TextField
            fullWidth
            label="Thành phần"
            multiline
            rows={2}
            value={formData.ingredients}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, ingredients: e.target.value }))
            }
            error={!!errors.ingredients}
            helperText={errors.ingredients}
            disabled={isViewing}
            required
            sx={{
              bgcolor: isViewing ? "action.disabledBackground" : "inherit",
            }}
          />

          <Box>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
              Hình ảnh sản phẩm
            </Typography>
            <Box sx={{ mb: 2 }}>
              {!isViewing && (
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<PhotoCamera />}
                  sx={{ borderRadius: 2 }}
                  disabled={isSubmitting}
                >
                  Thêm ảnh
                  <input
                    type="file"
                    hidden
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </Button>
              )}
            </Box>
            {formData.listImages.length > 0 ? (
              <ImageList cols={4} rowHeight={120} gap={8}>
                {formData.listImages.map((image, index) => (
                  <ImageListItem key={index} sx={{ position: "relative" }}>
                    <img
                      src={image.link}
                      alt={`product-${index}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: 8,
                      }}
                    />
                    <IconButton
                      sx={{
                        position: "absolute",
                        top: 4,
                        right: 4,
                        bgcolor: "rgba(255, 255, 255, 0.8)",
                        "&:hover": { bgcolor: "rgba(255, 255, 255, 0.9)" },
                        size: "small",
                        display: isViewing ? "none" : "flex",
                      }}
                      onClick={() => handleRemoveImage(index)}
                    >
                      <Delete fontSize="small" color="error" />
                    </IconButton>
                  </ImageListItem>
                ))}
              </ImageList>
            ) : (
              <Typography color="text.secondary" textAlign="center" py={2}>
                Chưa có hình ảnh sản phẩm
              </Typography>
            )}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, borderTop: 1, borderColor: "divider" }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{ borderRadius: 2, px: 3 }}
          disabled={isSubmitting}
        >
          {isViewing ? "Đóng" : "Hủy"}
        </Button>
        {!isViewing && (
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={loading || isSubmitting}
            sx={{ borderRadius: 2, px: 3, ml: 2 }}
          >
            {isSubmitting ? "Đang lưu..." : isEditing ? "Cập nhật" : "Thêm mới"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ProductDetails;
