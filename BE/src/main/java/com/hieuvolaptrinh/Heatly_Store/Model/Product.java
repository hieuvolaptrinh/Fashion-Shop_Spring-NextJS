package com.hieuvolaptrinh.Heatly_Store.Model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.sql.Date;
import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "product")
public class Product {
        public Product() {
        }

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "product_id")
        private int productId;

        @NotBlank(message = "Tên sản phẩm không được để trống")
        @Column(columnDefinition = "TEXT")
        private String productName;

        @Min(value = 1, message = "Giá gốc phải lớn hơn 0")
        private double originalPrice;

        // "Hướng dẫn sử dụng"
        @Column(columnDefinition = "TEXT")
        private String usageInstructions;

        @Column(columnDefinition = "TEXT")
        private String description;

        // nguyên liệu
        @Column(columnDefinition = "TEXT")
        private String ingredients;

        @NotNull(message = "Giá bán không được để trống")
        @Min(value = 1, message = "Giá bán phải lớn hơn 0")
        private double salePrice;

        @NotNull(message = "Số lượng không được để trống")
        private int quantity;

        // ngày sản xuất
        private Date manufactureDate;

        @OneToMany(mappedBy = "product", cascade = {
                        CascadeType.PERSIST,
                        CascadeType.MERGE,
                        CascadeType.REMOVE
        }, fetch = FetchType.LAZY, orphanRemoval = true)
        private List<Image> listImages;

        @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
        private List<OrderDetail> listOrderDetails;

        @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
        private List<CartDetail> listCartDetails;

        @ManyToMany(fetch = FetchType.LAZY, cascade = {
                        CascadeType.PERSIST,
                        CascadeType.MERGE,
                        CascadeType.DETACH,
                        CascadeType.REFRESH
        })
        @JoinTable(name = "product_product_type", joinColumns = @JoinColumn(name = "product_id"), inverseJoinColumns = @JoinColumn(name = "type_id"))
        private List<Type> listTypes;


        @OneToMany(mappedBy = "product", cascade = {
                CascadeType.PERSIST,
                CascadeType.MERGE,
                CascadeType.REMOVE
        }, fetch = FetchType.LAZY, orphanRemoval = true)
        private List<Combo> listCombos;

        public void addImage(Image image) {
                if (listImages == null) {
                        listImages = new java.util.ArrayList<>();
                }
                listImages.add(image);
                image.setProduct(this);
        }

        public void removeImage(Image image) {
                if (listImages != null && image != null) {
                        listImages.remove(image);
                        image.setProduct(null);
                }
        }

        public void addCombo(Combo combo) {
                if (listCombos == null) {
                        listCombos = new java.util.ArrayList<>();
                }
                listCombos.add(combo);
                combo.setProduct(this);
        }
}
