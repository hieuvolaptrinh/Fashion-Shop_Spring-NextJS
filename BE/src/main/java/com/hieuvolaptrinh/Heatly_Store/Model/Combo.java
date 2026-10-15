package com.hieuvolaptrinh.Heatly_Store.Model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "combo")
public class Combo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "combo_id")
    private int comboId;

    @NotNull(message = "Sản phẩm không được để trống")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @NotNull(message = "Số lượng sản phẩm trong combo không được để trống")
    @Min(value = 1, message = "Số lượng sản phẩm trong combo phải lớn hơn 0")
    @Column(name = "quantity_in_combo")
    private int quantityInCombo;

    @NotNull(message = "Giá combo không được để trống")
    @Min(value = 1, message = "Giá combo phải lớn hơn 0")
    @Column(name = "combo_price")
    private double comboPrice;

    @Column(columnDefinition = "TEXT")
    private String comboDescription;
}