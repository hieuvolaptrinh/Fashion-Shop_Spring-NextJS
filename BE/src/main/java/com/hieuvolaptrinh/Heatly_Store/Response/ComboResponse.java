package com.hieuvolaptrinh.Heatly_Store.Response;


import com.hieuvolaptrinh.Heatly_Store.Model.Product;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;


import java.time.LocalDateTime;
@Getter
@Setter
public class ComboResponse {

    private int comboId;
    private int quantityInCombo;
    private double comboPrice;
    private String comboDescription;


}
