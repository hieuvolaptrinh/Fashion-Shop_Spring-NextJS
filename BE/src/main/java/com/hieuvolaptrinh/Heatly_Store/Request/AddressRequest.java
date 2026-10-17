package com.hieuvolaptrinh.Heatly_Store.Request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddressRequest {

    @NotBlank(message = "Tên đường không được để trống")
    private String addressName;

    private String districtName;

    @NotBlank(message = "Tên tỉnh/thành phố không được để trống")
    private String provinceName;

    @NotBlank(message = "Tên phường/xã không được để trống")
    private String wardName;

    private String provinceCode;

    private String wardCode;

}
