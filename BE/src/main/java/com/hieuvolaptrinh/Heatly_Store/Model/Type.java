package com.hieuvolaptrinh.Heatly_Store.Model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class Type {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "type_id")
    private int typeId;

    @NotBlank(message = "Tên loại sản phẩm không được để trống")
    @Size(min = 2, max = 256, message = "Tên loại sản phẩm phải có độ dài từ 2 đến 256 ký tự")
    @Column(columnDefinition = "TEXT")
    private String typeName;


    @JsonIgnore
    @ManyToMany(mappedBy = "listTypes", fetch = FetchType.LAZY, cascade = {
            CascadeType.PERSIST,
            CascadeType.MERGE,
            CascadeType.DETACH,
            CascadeType.REFRESH
    })
    private List<Product> listProducts;
}
