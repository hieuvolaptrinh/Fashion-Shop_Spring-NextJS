package com.hieuvolaptrinh.Heatly_Store.Request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AuthRequest {
    @NotBlank(message = "Số điên thoại không được để trống")
    @Pattern(regexp = "^(\\+84|84|0)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-6|8|9]|9[0-9])[0-9]{7}$|^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$", message = "Email hoặc số điện thoại không đúng định dạng. Số điện thoại phải là số Việt Nam hợp lệ (10-11 số, bắt đầu bằng 0, +84 hoặc 84)")
    private String phoneNumber;

    public AuthRequest() {
    }

    public AuthRequest(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }
}
