package com.hieuvolaptrinh.Heatly_Store.Response;

import lombok.Data;

import java.util.List;

@Data
public class AuthResponse {
    private int userId;
    private String token;
    private String fullName;
    private List<String> roles;

    public AuthResponse(int userId, String token, String fullName, List<String> roles) {
        this.userId = userId;
        this.token = token;
        this.fullName = fullName;
        this.roles = roles;
    }

    public AuthResponse() {

    }

}
