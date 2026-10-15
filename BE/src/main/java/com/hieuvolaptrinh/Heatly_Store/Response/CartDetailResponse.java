package com.hieuvolaptrinh.Heatly_Store.Response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CartDetailResponse {
    private int cartDetailId;
    private int quantity;
    private double price;
    private ProductResponse product;
}
