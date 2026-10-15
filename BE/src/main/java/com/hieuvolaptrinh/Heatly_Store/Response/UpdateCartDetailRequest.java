package com.hieuvolaptrinh.Heatly_Store.Response;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateCartDetailRequest {
    @NotNull
    private Integer cartDetailId;

    private int quantity;


}
