package com.hieuvolaptrinh.Heatly_Store.Service.Sepcification;

import org.springframework.data.jpa.domain.Specification;

import com.hieuvolaptrinh.Heatly_Store.Model.Order;
import com.hieuvolaptrinh.Heatly_Store.Request.Filter.OrderFilterRequest;

import jakarta.persistence.criteria.Predicate;

public class OrderSpecification {

    public static Specification<Order> filterOrders(OrderFilterRequest filter) {
        return (root, query, criteriaBuilder) -> {
            Predicate predicate = criteriaBuilder.conjunction();

            if (filter.getStatus() != null && !filter.getStatus().isEmpty()) {
                predicate = criteriaBuilder.and(predicate,
                        root.get("status").in(filter.getStatus()));
            }

            if (filter.getUserId() != null) {
                predicate = criteriaBuilder.and(predicate,
                        criteriaBuilder.equal(root.get("user").get("userId"), filter.getUserId()));
            }

            if (filter.getIsPay() != null) {
                predicate = criteriaBuilder.and(predicate,
                        criteriaBuilder.equal(root.get("isPay"), filter.getIsPay()));
            }

            if (filter.getMinTotalPrice() != null && filter.getMinTotalPrice() > 0) {
                predicate = criteriaBuilder.and(predicate,
                        criteriaBuilder.greaterThanOrEqualTo(root.get("totalPrice"), filter.getMinTotalPrice()));
            }

            if (filter.getMaxTotalPrice() != null && filter.getMaxTotalPrice() > 0) {
                predicate = criteriaBuilder.and(predicate,
                        criteriaBuilder.lessThanOrEqualTo(root.get("totalPrice"), filter.getMaxTotalPrice()));
            }

            if (filter.getIsBill() != null) {
                predicate = criteriaBuilder.and(predicate,
                        criteriaBuilder.equal(root.get("isBill"), filter.getIsBill()));
            }

            return predicate;
        };
    }
}
