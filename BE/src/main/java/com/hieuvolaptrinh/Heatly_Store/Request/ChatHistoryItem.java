package com.hieuvolaptrinh.Heatly_Store.Request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatHistoryItem {
    /**
     * Vai trò trong lượt hội thoại: "user" hoặc "model"
     */
    private String role;

    /**
     * Nội dung câu thoại
     */
    private String text;

    public ChatHistoryItem() {
    }

    public ChatHistoryItem(String role, String text) {
        this.role = role;
        this.text = text;
    }
}
