package com.hieuvolaptrinh.Heatly_Store.Response.Dashboard;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RevenueStatResponse {
    private String month;
    private double revenue;
    private int orders;

    public RevenueStatResponse() {
    }

    public RevenueStatResponse(String month, double revenue, int orders) {
        this.month = month;
        this.revenue = revenue;
        this.orders = orders;
    }
}
