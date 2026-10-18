package com.hieuvolaptrinh.Heatly_Store.Response.Dashboard;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class DashboardSummaryResponse {
    private double totalRevenue;
    private int totalOrders;
    private long totalProducts;
    private long totalCustomers;
    private Double revenueGrowth;
    private int ordersToday;
    private List<RevenueStatResponse> revenueData;
    private List<OrderStatusStatResponse> orderStatusData;
    private List<DashboardOrderItemResponse> recentOrders;

    public DashboardSummaryResponse() {
    }

    public DashboardSummaryResponse(double totalRevenue, int totalOrders, long totalProducts, long totalCustomers,
                                  Double revenueGrowth, int ordersToday, List<RevenueStatResponse> revenueData,
                                  List<OrderStatusStatResponse> orderStatusData, List<DashboardOrderItemResponse> recentOrders) {
        this.totalRevenue = totalRevenue;
        this.totalOrders = totalOrders;
        this.totalProducts = totalProducts;
        this.totalCustomers = totalCustomers;
        this.revenueGrowth = revenueGrowth;
        this.ordersToday = ordersToday;
        this.revenueData = revenueData;
        this.orderStatusData = orderStatusData;
        this.recentOrders = recentOrders;
    }
}
