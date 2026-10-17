package com.hieuvolaptrinh.Heatly_Store.Response;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserResponse {

    private Integer userId;
    private boolean isActive;

    private String phoneNumber;

    private String fullName;

    private List<AddressResponse> listAddress;

    public UserResponse() {
    }

    public UserResponse(Integer userId, boolean isActive, String phoneNumber, String fullName, List<AddressResponse> listAddress) {
        this.userId = userId;
        this.isActive = isActive;
        this.phoneNumber = phoneNumber;
        this.fullName = fullName;
        this.listAddress = listAddress;
    }

    @Getter
    @Setter
    public static class AddressResponse {
        private Integer addressId;
        private String addressName;
        private String districtName;
        private String provinceName;
        private String wardName;
        private String provinceCode;
        private String wardCode;

        public AddressResponse() {
        }

        public AddressResponse(Integer addressId, String addressName, String districtName, String provinceName,
                               String wardName, String provinceCode, String wardCode) {
            this.addressId = addressId;
            this.addressName = addressName;
            this.districtName = districtName;
            this.provinceName = provinceName;
            this.wardName = wardName;
            this.provinceCode = provinceCode;
            this.wardCode = wardCode;
        }
    }
}
