package com.hieuvolaptrinh.Heatly_Store.Request.Filter;

import java.util.List;

import com.hieuvolaptrinh.Heatly_Store.Util.Enum.OrderStatusEnum;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderFilterRequest {

    // Lọc theo trạng thái đơn hàng
    private List<OrderStatusEnum> status;

    // Lọc theo user ID
    private Integer userId;

    // Lọc theo trạng thái thanh toán
    private Boolean isPay;

    // lọc theo trạng thái in bill
    private Boolean isBill;

    // Lọc theo khoảng tổng tiền
    private Double minTotalPrice;
    private Double maxTotalPrice;
}
