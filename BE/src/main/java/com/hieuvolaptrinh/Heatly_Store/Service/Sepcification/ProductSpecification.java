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
            Join<Product, Type> typeJoin = null;

            // Lọc theo tên sản phẩm / từ khóa (tìm trong productName, description, hoặc typeName)
            if (filter.getProductName() != null && !filter.getProductName().trim().isEmpty()) {
                String searchKeyword = "%" + filter.getProductName().toLowerCase().trim() + "%";
                typeJoin = root.join("listTypes", jakarta.persistence.criteria.JoinType.LEFT);

                Predicate nameMatch = criteriaBuilder.like(criteriaBuilder.lower(root.get("productName")), searchKeyword);
                Predicate descMatch = criteriaBuilder.like(criteriaBuilder.lower(root.get("description")), searchKeyword);
                Predicate typeNameMatch = criteriaBuilder.like(criteriaBuilder.lower(typeJoin.get("typeName")), searchKeyword);

                predicate = criteriaBuilder.and(predicate, criteriaBuilder.or(nameMatch, descMatch, typeNameMatch));
                query.distinct(true);
            }

            if (filter.getMinSalePrice() != null && filter.getMinSalePrice() > 0) {
                predicate = criteriaBuilder.and(predicate,
                        criteriaBuilder.greaterThanOrEqualTo(root.get("salePrice"), filter.getMinSalePrice()));
            }

            if (filter.getMaxSalePrice() != null && filter.getMaxSalePrice() > 0) {
                predicate = criteriaBuilder.and(predicate,
                        criteriaBuilder.lessThanOrEqualTo(root.get("salePrice"), filter.getMaxSalePrice()));
            }

            if (filter.getTypeId() != null && !filter.getTypeId().isEmpty()) {
                if (typeJoin == null) {
                    typeJoin = root.join("listTypes", jakarta.persistence.criteria.JoinType.LEFT);
                }
                predicate = criteriaBuilder.and(predicate,
                        typeJoin.get("typeId").in(filter.getTypeId()));
                query.distinct(true);
            }

            return predicate;
        };
    }
}
