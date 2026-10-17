package com.hieuvolaptrinh.Heatly_Store.Request;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class OrderRequest {
    // @NotNull
    // private AddressRequest addressRequest;

   @NotBlank(message = "địa chỉ giao hàng không được để trống")
    private String shippingAddress;

    @NotNull
    private List<Integer> selectedIds;

    @NotBlank(message = "Số điên thoại không được để trống")
    @Pattern(regexp = "^(\\+84|84|0)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-6|8|9]|9[0-9])[0-9]{7}$|^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$", message = "Email hoặc số điện thoại không đúng định dạng. Số điện thoại phải là số Việt Nam hợp lệ (10-11 số, bắt đầu bằng 0, +84 hoặc 84)")
    private String phoneNumber;

    public OrderRequest() {
    }

    public OrderRequest(String shippingAddress, List<Integer> selectedIds, String phoneNumber) {
        this.shippingAddress = shippingAddress;
        this.selectedIds = selectedIds;
        this.phoneNumber = phoneNumber;
    }
}