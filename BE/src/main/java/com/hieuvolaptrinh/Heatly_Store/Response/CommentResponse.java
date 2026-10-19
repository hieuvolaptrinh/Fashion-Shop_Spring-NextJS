package com.hieuvolaptrinh.Heatly_Store.Response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class CommentResponse {
    private int commentId;
    private int userId;
    private String userName;
    private int productId;
    private String productName;
    private int orderDetailId;

    @JsonProperty("isPurchased")
    private boolean isPurchased;

    private String content;
    private Integer rating;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

