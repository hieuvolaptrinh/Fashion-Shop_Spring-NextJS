package com.hieuvolaptrinh.Heatly_Store.Request.Filter;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductFilterRequest {

    // Tìm kiếm theo tên sản phẩm
    private String productName;

    // Lọc theo khoảng giá bán
    private Double minSalePrice;
    private Double maxSalePrice;
   
    // Lọc theo loại sản phẩm
    private List<Integer> typeId;
}
