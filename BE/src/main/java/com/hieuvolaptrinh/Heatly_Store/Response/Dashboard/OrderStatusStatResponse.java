package com.hieuvolaptrinh.Heatly_Store.Response.Dashboard;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderStatusStatResponse {
    private String status;
    private int count;
    private String fill;

    public OrderStatusStatResponse() {
    }

    public OrderStatusStatResponse(String status, int count, String fill) {
        this.status = status;
        this.count = count;
        this.fill = fill;
    }
}
