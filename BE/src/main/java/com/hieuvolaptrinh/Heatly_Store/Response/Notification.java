package com.hieuvolaptrinh.Heatly_Store.Response;

import lombok.Data;

@Data
public class Notification {
    private String message;

    public Notification(String message) {
        this.message = message;
    }

    @Override
    public String toString() {
        return  message ;
    }
}
