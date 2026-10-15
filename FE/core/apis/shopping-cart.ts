import axios from "axios";

type ShoppingCartProps = {
  productId: number;
  quantity: number;
  comboId?: number;
};
type UpdateCartProps = {
  cartDetailId: number;
  quantity: number;
};
export const postShoppingCart = async (data: ShoppingCartProps) => {
  const localStorageToken = localStorage.getItem("accessToken");
  if (!localStorageToken) {
    throw new Error("No access token provided");
  }
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const response = await axios.post(`${API_URL}/api/v1/carts/items`, data, {
    headers: {
      Authorization: `Bearer ${localStorageToken}`,
    },
  });
  if (response.status !== 201) {
    throw new Error("Failed to add item to shopping cart hi hi");
  }
  return response.data;
};

export const putShoppingCart = async (data: UpdateCartProps) => {
  const localStorageToken = localStorage.getItem("accessToken");
  if (!localStorageToken) {
    throw new Error("No access token provided");
  }
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  const response = await axios.put(`${API_URL}/api/v1/carts/items`, data, {
    headers: {
      Authorization: `Bearer ${localStorageToken}`,
    },
  });
  if (response.status !== 200) {
    throw new Error("Failed to update shopping cart item");
  }
  return response.data;
};

export const deleteShoppingCart = async (id: number) => {
  const localStorageToken = localStorage.getItem("accessToken");
  if (!localStorageToken) {
    throw new Error("No access token provided");
  }
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  const response = await axios.delete(`${API_URL}/api/v1/carts/items/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorageToken}`,
    },
  });
  if (response.status !== 200) {
    throw new Error("Failed to delete shopping cart item");
  }
  return response.data;
};

export const getShoppingCart = async () => {
  const localStorageToken = localStorage.getItem("accessToken");
  if (!localStorageToken) {
    throw new Error("No access token provided");
  }
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  const response = await axios.get(`${API_URL}/api/v1/carts`, {
    headers: {
      Authorization: `Bearer ${localStorageToken}`,
    },
  });
  if (response.status !== 200) {
    throw new Error("Failed to fetch shopping cart items");
  }
  return response.data;
};
