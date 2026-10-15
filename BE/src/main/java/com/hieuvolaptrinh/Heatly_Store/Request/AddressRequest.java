package com.hieuvolaptrinh.Heatly_Store.Request;

import jakarta.persistence.Column;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddressRequest {

    @NotBlank(message = "Tên đường không được để trống")
    private String addressName;

    @NotBlank(message = "Tên quận/huyện không được để trống")
    private String districtName;

    @NotBlank(message = "Tên tỉnh/thành phố không được để trống")
    private String provinceName;


    private String wardName;

}
