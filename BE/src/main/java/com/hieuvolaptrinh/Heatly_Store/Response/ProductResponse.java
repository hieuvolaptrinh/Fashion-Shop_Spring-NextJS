package com.hieuvolaptrinh.Heatly_Store.Response;

import lombok.Getter;
import lombok.Setter;

import java.sql.Date;
import java.util.List;

@Setter
@Getter
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

    public ProductResponse() {
    }

    public ProductResponse(int productId, String productName, double originalPrice, String usageInstructions,
                           String description, String ingredients, double salePrice, int quantity,
                           Date manufactureDate, List<ImageResponse> listImages, List<TypeResponse> listTypes,
                           List<ComboResponse> listCombo) {
        this.productId = productId;
        this.productName = productName;
        this.originalPrice = originalPrice;
        this.usageInstructions = usageInstructions;
        this.description = description;
        this.ingredients = ingredients;
        this.salePrice = salePrice;
        this.quantity = quantity;
        this.manufactureDate = manufactureDate;
        this.listImages = listImages;
        this.listTypes = listTypes;
        this.listCombo = listCombo;
    }
}
