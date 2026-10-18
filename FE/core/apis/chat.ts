import { http } from "@/core/lib/apiClient";
import { API_ENDPOINTS } from "@/core/constants";
import type { ChatHistoryItem, ChatResponseData } from "@/core/lib/type";

export interface SendChatMessagePayload {
  message: string;
  history?: ChatHistoryItem[];
}

/**
 * Gửi tin nhắn tới AI Chatbot và nhận phản hồi cùng danh sách sản phẩm gợi ý
 */
export const sendChatMessage = async (
  payload: SendChatMessagePayload
): Promise<ChatResponseData> => {
  try {
    const res = await http.post<any>(API_ENDPOINTS.CHAT.MESSAGE, payload);
    if (res?.data) {
      return res.data as ChatResponseData;
    }
    return (res as ChatResponseData) || { reply: "Dạ em chưa nhận được phản hồi, bạn thử lại nhé!", products: [] };
  } catch (error: any) {
    console.error("Lỗi khi gửi tin nhắn tới Chatbot:", error);
    throw error;
  }
};
