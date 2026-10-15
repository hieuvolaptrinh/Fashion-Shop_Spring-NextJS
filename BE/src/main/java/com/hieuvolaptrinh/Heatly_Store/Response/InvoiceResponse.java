package com.hieuvolaptrinh.Heatly_Store.Response;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Getter
@Setter
public class InvoiceResponse {
    private Integer orderId;
    private Date createAt;
    private String  customerName;
    private String  customerPhone;
    private String  shippingAddress;
    private List<InvoiceItemResponse> items;
    private double  totalPrice;
}
