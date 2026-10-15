package com.hieuvolaptrinh.Heatly_Store.Service.Sepcification;

import org.springframework.data.jpa.domain.Specification;

import com.hieuvolaptrinh.Heatly_Store.Model.Order;
import com.hieuvolaptrinh.Heatly_Store.Request.Filter.OrderFilterRequest;

import jakarta.persistence.criteria.Predicate;

public class OrderSpecification {

    public static Specification<Order> filterOrders(OrderFilterRequest filter) {
        return (root, query, criteriaBuilder) -> {
            Predicate predicate = criteriaBuilder.conjunction();

            // Lọc theo trạng thái đơn hàng
            if (filter.getStatus() != null && !filter.getStatus().isEmpty()) {
                predicate = criteriaBuilder.and(predicate,
                        root.get("status").in(filter.getStatus()));
            }

            // Lọc theo user ID
            if (filter.getUserId() != null) {
                predicate = criteriaBuilder.and(predicate,
                        criteriaBuilder.equal(root.get("user").get("userId"), filter.getUserId()));
            }

            // Lọc theo trạng thái thanh toán
            if (filter.getIsPay() != null) {
                predicate = criteriaBuilder.and(predicate,
                        criteriaBuilder.equal(root.get("isPay"), filter.getIsPay()));
            }

            // Lọc theo tổng tiền tối thiểu
            if (filter.getMinTotalPrice() != null && filter.getMinTotalPrice() > 0) {
                predicate = criteriaBuilder.and(predicate,
                        criteriaBuilder.greaterThanOrEqualTo(root.get("totalPrice"), filter.getMinTotalPrice()));
            }

            // Lọc theo tổng tiền tối đa
            if (filter.getMaxTotalPrice() != null && filter.getMaxTotalPrice() > 0) {
                predicate = criteriaBuilder.and(predicate,
                        criteriaBuilder.lessThanOrEqualTo(root.get("totalPrice"), filter.getMaxTotalPrice()));
            }

            // LỌC THEO TRẠNG THÁI IN BILL
            if (filter.getIsBill() != null) {
                predicate = criteriaBuilder.and(predicate,
                        criteriaBuilder.equal(root.get("isBill"), filter.getIsBill()));
            }

            return predicate;
        };
    }
}
