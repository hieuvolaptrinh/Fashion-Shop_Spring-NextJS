package com.hieuvolaptrinh.Heatly_Store.Response.Dashboard;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class DashboardOrderItemResponse {
    private int orderId;
    private double totalPrice;
    private String status;
    private String receiverName;
    private String receiverPhone;
    private Date createAt;

    public DashboardOrderItemResponse() {
    }

    public DashboardOrderItemResponse(int orderId, double totalPrice, String status, String receiverName, String receiverPhone, Date createAt) {
        this.orderId = orderId;
        this.totalPrice = totalPrice;
        this.status = status;
        this.receiverName = receiverName;
        this.receiverPhone = receiverPhone;
        this.createAt = createAt;
    }
}
