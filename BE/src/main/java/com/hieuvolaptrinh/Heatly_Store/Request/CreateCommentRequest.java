package com.hieuvolaptrinh.Heatly_Store.Request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.validator.constraints.Range;

@Getter
@Setter
public class CreateCommentRequest {
    private Integer userId;

    @NotNull(message = "productId không được null")
    @Min(value = 1, message = "productId phải ≥ 1")
    private int productId;

    private Integer orderDetailId;

    @NotBlank(message = "Nội dung bình luận không được để trống")
    @Size(min = 1, max = 1000, message = "Nội dung phải từ 1 đến 1000 ký tự")
    private String content;

    @NotNull(message = "Rating không được null")
    @Range(min = 1, max = 5, message = "Rating chỉ được phép từ 1 đến 5")
    private Integer rating;
}

