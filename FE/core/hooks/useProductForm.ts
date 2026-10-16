import {
  createProduct,
  getCategories,
  updateProduct,
} from "@/core/apis/products";
import type {
  Combo,
  ListTypes,
  Product,
  ProductRequest,
} from "@/core/lib/type";
import { validateProductForm } from "@/core/lib/validators/productValidator";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export interface UseProductFormProps {
  product?: Product | null;
  isEditing?: boolean;
  isViewing?: boolean;
  open: boolean;
  onSave: (product: Product, files: File[], deletedImageIds: string[]) => void;
}

const INITIAL_PRODUCT: Product = {
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
};

export const useProductForm = ({
  product,
  isEditing = false,
  isViewing = false,
  open,
  onSave,
}: UseProductFormProps) => {
  const [formData, setFormData] = useState<Product>(INITIAL_PRODUCT);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [productTypes, setProductTypes] = useState<ListTypes[]>([]);
  const [isLoadingTypes, setIsLoadingTypes] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [deletedImageIds, setDeletedImageIds] = useState<string[]>([]);
  const [combos, setCombos] = useState<Combo[]>([]);
  const [deletedComboIds, setDeletedComboIds] = useState<number[]>([]);

  // Fetch product types on open
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
        typesData = response.data.map(
          (item: { typeId: number | string; typeName: string }) => ({
            typeId: item.typeId.toString(),
            typeName: item.typeName,
          }),
        );
      } else if (
        response &&
        response.content &&
        Array.isArray(response.content)
      ) {
        typesData = response.content.map(
          (item: { typeId: number | string; typeName: string }) => ({
            typeId: item.typeId.toString(),
            typeName: item.typeName,
          }),
        );
      }
      setProductTypes(typesData);
    } catch (error) {
      console.error("Error fetching product types:", error);
      setProductTypes([]);
    } finally {
      setIsLoadingTypes(false);
    }
  };

  // Sync formData with selected product
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
      setFormData(INITIAL_PRODUCT);
      setCombos([]);
      setDeletedComboIds([]);
      setDeletedImageIds([]);
      setNewImageFiles([]);
      setErrors({});
    }
  }, [product, isEditing, isViewing, open]);

  // Combo handlers
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

  const updateCombo = (index: number, field: keyof Combo, value: unknown) => {
    const updatedCombos = combos.map((combo, i) =>
      i === index ? { ...combo, [field]: value } : combo,
    );
    setCombos(updatedCombos);
  };

  // Image handlers
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
      setDeletedImageIds((prev) => [...prev, imageToRemove.imageId]);
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

  // Type tag toggle
  const toggleType = (typeItem: ListTypes) => {
    if (isViewing) return;
    const exists = formData.listTypes.some((t) => t.typeId === typeItem.typeId);
    if (exists) {
      setFormData((prev) => ({
        ...prev,
        listTypes: prev.listTypes.filter((t) => t.typeId !== typeItem.typeId),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        listTypes: [...prev.listTypes, typeItem],
      }));
    }
  };

  // Save handler
  const handleSave = async () => {
    const { isValid, errors: validationErrors } = validateProductForm(
      formData,
      combos
    );
    setErrors(validationErrors);
    if (!isValid) return;

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
        await updateProduct(productRequest, newImageFiles);
        toast.success("Cập nhật thông tin sản phẩm thành công!");
      } else {
        const { productId, ...createRequest } = productRequest;
        await createProduct(createRequest, newImageFiles);
        toast.success("Thêm mới sản phẩm thành công!");
      }

      const savedProduct: Product = {
        ...formData,
        productId: formData.productId || "0",
        listCombo: combos,
        usageInstructions: formData.usageInstructions,
        ingredients: formData.ingredients,
      };
      onSave(savedProduct, newImageFiles, deletedImageIds);
    } catch (error: unknown) {
      console.error("=== ERROR in handleSave ===", error);
      let errorMessage = "Có lỗi xảy ra khi lưu sản phẩm";
      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as { response?: { data?: { message?: string } } })
          .response?.data?.message === "string"
      ) {
        errorMessage = (error as { response: { data: { message: string } } })
          .response.data.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    setFormData,
    errors,
    productTypes,
    isLoadingTypes,
    isSubmitting,
    combos,
    addCombo,
    removeCombo,
    updateCombo,
    handleImageUpload,
    handleRemoveImage,
    toggleType,
    handleSave,
  };
};

export default useProductForm;
