package com.hieuvolaptrinh.Heatly_Store.Request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.validator.constraints.Range;

@Getter
@Setter
public class CreateCommentRequest {
    @NotNull(message = "userId không được null")
    @Min(value = 1, message = "userId phải ≥ 1")
    private int userId;

    @NotNull(message = "productId không được null")
    @Min(value = 1, message = "productId phải ≥ 1")
    private int productId;

    @NotNull(message = "orderDetailId không được null")
    @Min(value = 1, message = "orderDetailId phải ≥ 1")
    private int orderDetailId;

    @NotNull(message = "Nội dung không được null")
    @Size(min = 1, max = 1000, message = "Nội dung phải từ 1 đến 1000 ký tự")
    private String content;

    @NotNull(message = "Rating không được null")
    @Range(min = 1, max = 5, message = "Rating chỉ được phép từ 1 đến 5")
    private Integer rating;
}
