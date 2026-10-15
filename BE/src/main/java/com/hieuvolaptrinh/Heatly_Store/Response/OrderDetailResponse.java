package com.hieuvolaptrinh.Heatly_Store.Response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderDetailResponse {
    private int orderDetailId;
    private ProductResponse product;
    private int quantity;
    private double price;
}
