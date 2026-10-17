package com.hieuvolaptrinh.Heatly_Store.Request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class ChatMessageRequest {

    @NotBlank(message = "Nội dung câu hỏi không được để trống")
    @Size(max = 500, message = "Câu hỏi tối đa 500 ký tự")
    private String message;

    /**
     * Lịch sử hội thoại 4-6 câu gần nhất để AI duy trì ngữ cảnh
     */
    private List<ChatHistoryItem> history;

    public ChatMessageRequest() {
        this.history = new ArrayList<>();
    }

    public ChatMessageRequest(String message, List<ChatHistoryItem> history) {
        this.message = message;
        this.history = history != null ? history : new ArrayList<>();
    }
}
