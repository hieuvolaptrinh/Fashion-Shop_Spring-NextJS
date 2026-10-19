package com.hieuvolaptrinh.Heatly_Store.Request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {
    @NotBlank(message = "Số điện thoại không được để trống")
    @Pattern(regexp = "^(\\+84|84|0)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-6|8|9]|9[0-9])[0-9]{7}$", message = "Số điện thoại phải là số Việt Nam hợp lệ (10-11 số, bắt đầu bằng 0, +84 hoặc 84)")
    private String phoneNumber;

    @NotBlank(message = "Họ và tên không được để trống")
    private String fullName;

    @NotBlank(message = "Mật khẩu không được để trống")
    @Size(min = 6, message = "Mật khẩu phải từ 6 ký tự trở lên")
    private String password;

    @NotNull(message = "Địa chỉ không được để trống")
    private AddressRequest addressRequest;

    public RegisterRequest() {
    }

    public RegisterRequest(String phoneNumber, String fullName, String password, AddressRequest addressRequest) {
        this.phoneNumber = phoneNumber;
        this.fullName = fullName;
        this.password = password;
        this.addressRequest = addressRequest;
    }
}
