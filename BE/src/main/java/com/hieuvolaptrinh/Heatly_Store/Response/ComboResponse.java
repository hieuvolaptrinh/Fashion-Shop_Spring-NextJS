package com.hieuvolaptrinh.Heatly_Store.Response;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ComboResponse {

    private int comboId;
    private int quantityInCombo;
    private double comboPrice;
    private String comboDescription;

    public ComboResponse() {
    }

    public ComboResponse(int comboId, int quantityInCombo, double comboPrice, String comboDescription) {
        this.comboId = comboId;
        this.quantityInCombo = quantityInCombo;
        this.comboPrice = comboPrice;
        this.comboDescription = comboDescription;
    }
}
