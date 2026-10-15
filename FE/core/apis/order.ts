import axios from "axios";

type OrderItem = {
  shippingAddress: string;
  phoneNumber: string;
  selectedIds: number[];
};

export const postOrder = async (data: OrderItem, accessToken: string) => {
  if (!accessToken) {
    throw new Error("No access token provided");
  }
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  const response = await fetch(`${API_URL}/api/v1/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create order");
  }

  return response.json();
};

// get all orders with filter support
export const getAllOrders = async (filters = {}, accessToken: string) => {
  try {
    const token = accessToken;
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

    // Build query parameters
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        if (Array.isArray(value)) {
          // For array values like status, add each value separately
          value.forEach((v) => params.append(key, v));
        } else {
          params.append(key, value.toString());
        }
      }
    });

    const queryString = params.toString();
    const url = `${API_URL}/api/v1/orders/admin/filter${queryString ? `?${queryString}` : ""}`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

export const getOrders = async () => {
  const localStorageToken = localStorage.getItem("accessToken");
  if (!localStorageToken) {
    throw new Error("No access token provided");
  }
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  const response = await fetch(`${API_URL}/api/v1/orders`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorageToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to get orders");
  }

  return response.json();
};
