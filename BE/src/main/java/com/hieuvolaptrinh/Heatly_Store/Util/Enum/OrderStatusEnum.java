package com.hieuvolaptrinh.Heatly_Store.Util.Enum;

public enum OrderStatusEnum {
    PENDING("Chưa xử lý"),
    SHIPPING("Đang giao"),
    DELIVERED("Đã giao"),
    CANCELLED("Đã hủy");
    private final String label;

    OrderStatusEnum(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}
