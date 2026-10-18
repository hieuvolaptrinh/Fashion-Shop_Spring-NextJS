package com.hieuvolaptrinh.Heatly_Store.Config;

public class Endpoint {

    public static final String[] PUBLIC_ENDPOINTS = {
            "/api/v1/auth/**",
            "/oauth2/**",
            "/login/oauth2/code/**",
            "/api/v1/oauth2/**",
            "/api/v1/oauth2/google",
            "/api/v1/images/**",
            "/api/v1/comments/by-product/**",
            "/api/v1/chat/**",
    };

    public static final String[] ADMIN_ENDPOINTS = {
            "/api/v1/admin/dashboard/**",
            "/api/v1/bills/**",
            "/api/v1/products/**",
            "/api/v1/orders/**",
            "/api/v1/users/**",
            "/api/v1/carts/**",
            "/api/v1/types/**",
    };
    public static final String[] USER_GET_ENDPOINTS = {
            "/api/v1/user/**",
            "/api/v1/carts/**",
            "/api/v1/comments/**",
            "/api/v1/orders",
            "/api/v1/products/**",
            "/api/v1/users",
            "/api/v1/users/address/**",
            "/api/v1/types/**",

    };
    public static final String[] USER_POST_ENDPOINTS = {
            "/api/v1/user/**",
            "/api/v1/carts/items",
            "/api/v1/comments/**",
            "/api/v1/orders/**",
            "/api/v1/users/address",

    };
    public static final String[] USER_DELETE_ENDPOINTS = {
            "/api/v1/user/**",
            "/api/v1/carts/items/**",
            "/api/v1/comments/**",
            "/api/v1/users/address/**",
    };
    public static final String[] USER_PUT_ENDPOINTS = {
            "/api/v1/user/**",
            "/api/v1/carts/items/**",
            "/api/v1/comments/**",
            "/api/v1/users",
            "/api/v1/users/address/**"
    };
}
