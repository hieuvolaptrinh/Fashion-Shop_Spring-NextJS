package com.hieuvolaptrinh.Heatly_Store.Response;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class CartResponse {
    private int cartId;
    private double totalPrices;
    private List<CartDetailResponse> items;
}
