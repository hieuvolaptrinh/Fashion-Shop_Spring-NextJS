package com.hieuvolaptrinh.Heatly_Store.Response;

import lombok.Getter;
import lombok.Setter;

import java.util.List;
@Getter
@Setter
public class ConfirmOrderResponse {
    private List<OrderResponse> orderResponses;
    private List<Integer> notFoundIds;
    public ConfirmOrderResponse(List<OrderResponse> orderResponses, List<Integer> notFoundIds) {
        this.orderResponses = orderResponses;
        this.notFoundIds = notFoundIds;
    }
}
