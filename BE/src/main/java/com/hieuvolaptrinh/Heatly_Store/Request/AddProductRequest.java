package com.hieuvolaptrinh.Heatly_Store.Request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddProductRequest {
    @NotNull
    private Integer productId;

    @Min(1)
    private int quantity;

    private int comboId; // Optional, if the product is part of a combo
}
