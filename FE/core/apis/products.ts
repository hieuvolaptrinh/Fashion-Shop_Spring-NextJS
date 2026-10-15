import axios from "axios";
import type { ProductRequest } from "../lib/type";

export const getCategories = async () => {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const response = await axios.get(`${API_URL}/api/v1/types`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

// Updated to match backend API structure
export const getProducts = async (filters: any = {}) => {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

    // Build query parameters from filters object
    const params = new URLSearchParams();

    // Add pagination
    params.append("page", (filters.page || 0).toString());
    params.append("size", (filters.size || 10).toString());

    // Add filters if they exist and are not empty
    if (filters.productName?.trim()) {
      params.append("productName", filters.productName.trim());
    }

    if (filters.minSalePrice && filters.minSalePrice > 0) {
      params.append("minSalePrice", filters.minSalePrice.toString());
    }

    if (filters.maxSalePrice && filters.maxSalePrice > 0) {
      params.append("maxSalePrice", filters.maxSalePrice.toString());
    }

    if (
      filters.typeId &&
      Array.isArray(filters.typeId) &&
      filters.typeId.length > 0
    ) {
      // biome-ignore lint/complexity/noForEach: <explanation>
      filters.typeId.forEach((id: number) => {
        params.append("typeId", id.toString());
      });
    }

    const response = await axios.get(
      `${API_URL}/api/v1/products?${params.toString()}`,
    );

    // Return the full response structure for pagination info
    return response.data.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// update product
export const updateProduct = async (
  product: ProductRequest,
  files: File[] = [],
  accessToken: string | null = null,
) => {
  try {
    const token = accessToken;
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

    const formData = new FormData();

    // Include deletedImageIds in the product JSON since backend expects it in ProductRequest
    formData.append(
      "product",
      new Blob([JSON.stringify(product)], {
        type: "application/json",
      }),
    );

    if (files && files.length > 0) {
      files.forEach((file, _) => {
        formData.append("images", file);
      });
    }

    const response = await axios.put(
      `${API_URL}/api/v1/products/${product.productId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          // Bỏ Content-Type để axios tự động set với boundary
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error("Full error:", error);
    throw error;
  }
};

// create product
export const createProduct = async (
  product: Omit<ProductRequest, "productId">,
  files: File[] = [],
  accessToken: string | null = null,
) => {
  try {
    const token = accessToken;
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

    const formData = new FormData();
    formData.append(
      "product",
      new Blob([JSON.stringify(product)], { type: "application/json" }),
    );

    if (files && files.length > 0) {
      files.forEach((file, _) => {
        formData.append("images", file);
      });
    }

    const response = await axios.post(`${API_URL}/api/v1/products`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Full error:", error);

    throw error;
  }
};
export const getProductById = async (productId: number) => {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const response = await axios.get(`${API_URL}/api/v1/products/${productId}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching product by id:", error);
    throw error;
  }
};

export const deleteProduct = async (productID: number) => {
  try {
    const token = localStorage.getItem("accessToken");
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    await axios.delete(`${API_URL}/api/v1/products/${productID}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        // Bỏ Content-Type để axios tự động set với boundary
      },
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};
