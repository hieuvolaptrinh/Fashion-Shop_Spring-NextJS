package com.hieuvolaptrinh.Heatly_Store.Request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChatHistoryItem {
    /**
     * Vai trò trong lượt hội thoại: "user" hoặc "model"
     */
    private String role;

    /**
     * Nội dung câu thoại
     */
    private String text;
}
