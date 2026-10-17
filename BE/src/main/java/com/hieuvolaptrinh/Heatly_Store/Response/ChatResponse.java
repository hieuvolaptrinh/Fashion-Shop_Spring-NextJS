package com.hieuvolaptrinh.Heatly_Store.Response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class ChatResponse {

    /**
     * Lời tư vấn / phản hồi tự nhiên của AI
     */
    private String reply;

    /**
     * Danh sách sản phẩm thực tế được tìm thấy từ database (nếu có gợi ý sản phẩm)
     */
    private List<ProductResponse> products = new ArrayList<>();

    public ChatResponse() {
        this.products = new ArrayList<>();
    }

    @Builder
    public ChatResponse(String reply, List<ProductResponse> products) {
        this.reply = reply;
        this.products = products != null ? products : new ArrayList<>();
    }
}
