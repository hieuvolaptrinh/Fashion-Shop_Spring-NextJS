package com.hieuvolaptrinh.Heatly_Store.Response;

import com.hieuvolaptrinh.Heatly_Store.Model.Combo;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Date;
import java.util.List;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {
    private int productId;
    private String productName;
    private double originalPrice;
    private String usageInstructions;
    private String description;
    private String ingredients;
    private double salePrice;
    private int quantity;
    private Date manufactureDate;
    private List<ImageResponse> listImages;
    private List<TypeResponse> listTypes;
//    add combo
    private List<ComboResponse> listCombo;


}
