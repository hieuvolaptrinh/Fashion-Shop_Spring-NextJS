package com.hieuvolaptrinh.Heatly_Store.Service;

import com.hieuvolaptrinh.Heatly_Store.Request.ChatMessageRequest;
import com.hieuvolaptrinh.Heatly_Store.Response.ChatResponse;

public interface ChatService {
    /**
     * Xử lý câu hỏi của khách hàng, tích hợp Gemini AI và kho sản phẩm
     *
     * @param request  Thông tin tin nhắn và lịch sử chat từ Client
     * @param clientIp Địa chỉ IP của client để kiểm soát giới hạn (Rate Limiting)
     * @return ChatResponse chứa lời tư vấn và danh sách sản phẩm gợi ý
     */
    ChatResponse processChat(ChatMessageRequest request, String clientIp);
}
