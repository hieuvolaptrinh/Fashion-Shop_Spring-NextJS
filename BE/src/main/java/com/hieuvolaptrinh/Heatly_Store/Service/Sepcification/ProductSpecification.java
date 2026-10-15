package com.hieuvolaptrinh.Heatly_Store.Service.Sepcification;

import org.springframework.data.jpa.domain.Specification;

import com.hieuvolaptrinh.Heatly_Store.Model.Product;
import com.hieuvolaptrinh.Heatly_Store.Model.Type;
import com.hieuvolaptrinh.Heatly_Store.Request.Filter.ProductFilterRequest;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;

public class ProductSpecification {

    public static Specification<Product> filterProducts(ProductFilterRequest filter) {
        return (root, query, criteriaBuilder) -> {
            Predicate predicate = criteriaBuilder.conjunction();

            // Lọc theo tên sản phẩm (LIKE - không phân biệt hoa thường)
            if (filter.getProductName() != null && !filter.getProductName().trim().isEmpty()) {
                predicate = criteriaBuilder.and(predicate,
                        criteriaBuilder.like(
                                criteriaBuilder.lower(root.get("productName")),
                                "%" + filter.getProductName().toLowerCase().trim() + "%"));
            }

            // Lọc theo khoảng giá bán tối thiểu
            if (filter.getMinSalePrice() != null && filter.getMinSalePrice() > 0) {
                predicate = criteriaBuilder.and(predicate,
                        criteriaBuilder.greaterThanOrEqualTo(root.get("salePrice"), filter.getMinSalePrice()));
            }

            // Lọc theo khoảng giá bán tối đa
            if (filter.getMaxSalePrice() != null && filter.getMaxSalePrice() > 0) {
                predicate = criteriaBuilder.and(predicate,
                        criteriaBuilder.lessThanOrEqualTo(root.get("salePrice"), filter.getMaxSalePrice()));
            }

            // Lọc theo danh sách loại sản phẩm
            if (filter.getTypeId() != null && !filter.getTypeId().isEmpty()) {
                Join<Product, Type> typeJoin = root.join("listTypes");
                predicate = criteriaBuilder.and(predicate,
                        typeJoin.get("typeId").in(filter.getTypeId()));
                // Để tránh duplicate kết quả khi join với nhiều types
                query.distinct(true);
            }

            return predicate;
        };
    }
}
