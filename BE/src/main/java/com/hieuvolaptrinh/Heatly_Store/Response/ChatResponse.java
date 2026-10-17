package com.hieuvolaptrinh.Heatly_Store.Response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatResponse {

    /**
     * Lời tư vấn / phản hồi tự nhiên của AI
     */
    private String reply;

    /**
     * Danh sách sản phẩm thực tế được tìm thấy từ database (nếu có gợi ý sản phẩm)
     */
    @Builder.Default
    private List<ProductResponse> products = new ArrayList<>();
}
