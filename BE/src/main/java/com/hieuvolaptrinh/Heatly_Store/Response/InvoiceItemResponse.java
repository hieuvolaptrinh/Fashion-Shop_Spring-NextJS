package com.hieuvolaptrinh.Heatly_Store.Response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InvoiceItemResponse {
    private Integer productId;
    private String  productName;
    private Integer quantity;
    private Double  unitPrice;
    private Double  lineTotal;
}
