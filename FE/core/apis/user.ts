import axios from "axios";

export const getUser = async () => {
  try {
    const user = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      },
    );
    return user.data.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

export const registerUser = async (userData: any) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/register`,
      userData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return response.data.data.message;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "Lỗi trong quá trình đăng ký";
    // Ném lỗi để xử lý ở nơi gọi
    throw new Error(errorMessage);
  }
};
