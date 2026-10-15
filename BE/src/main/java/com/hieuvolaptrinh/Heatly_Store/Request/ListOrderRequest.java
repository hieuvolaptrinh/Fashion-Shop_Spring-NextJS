package com.hieuvolaptrinh.Heatly_Store.Request;

import lombok.Getter;
import lombok.Setter;

import java.util.List;
@Getter
@Setter
public class ListOrderRequest {
    private List<Integer> orderIds;
}
