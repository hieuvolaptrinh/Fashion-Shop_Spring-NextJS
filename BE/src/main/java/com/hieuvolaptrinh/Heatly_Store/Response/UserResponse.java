package com.hieuvolaptrinh.Heatly_Store.Response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {

    private Integer userId;
    private boolean isActive;

    private String phoneNumber;

    private String fullName;

    private List<AddressResponse> listAddress;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AddressResponse {
        private Integer addressId;
        private String addressName;
        private String districtName;
        private String provinceName;
        private String wardName;
        private String provinceCode;
        private String wardCode;
    }
}
