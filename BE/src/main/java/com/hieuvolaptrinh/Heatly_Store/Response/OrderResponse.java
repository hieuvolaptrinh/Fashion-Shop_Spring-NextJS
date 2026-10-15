package com.hieuvolaptrinh.Heatly_Store.Response;

import com.hieuvolaptrinh.Heatly_Store.Util.Enum.OrderStatusEnum;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Setter
@Getter
public class OrderResponse {
    private int orderId;
    private Date createAt;
    private OrderStatusEnum status;
    private double totalPrice;
    private boolean isPay;
    private int userId;
    private boolean isBill;
    private String shippingAddress;
    private String phoneNumber;
    private List<OrderDetailResponse> items;
}
