package com.hieuvolaptrinh.Heatly_Store.Request;

import com.hieuvolaptrinh.Heatly_Store.Response.ComboResponse;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.sql.Date;
import java.util.List;

@Getter
@Setter
public class ProductRequest {
    private int productId;

    @NotBlank(message = "Product Name not be blank")
    private String productName;

    @NotBlank(message = "Description not be blank")
    private String description;

    @NotNull(message = "Original Price not be null")
    @Min(value = 1, message = "Original Price must be greater than 0")
    private double originalPrice;

    // "Hướng dẫn sử dụng"
    private String usageInstructions;

    // nguyên liệu
    private String ingredients;

    @NotNull(message = "Sale Price not be null")
    @Min(value = 1, message = "Sale Price must be greater than 0")
    private double salePrice;

    @NotNull(message = "Quantity not be null")
    @Min(value = 0, message = "Quantity must be greater than or equal to 0")
    private int quantity;

    // ngày sản xuất
    private Date manufactureDate;

    private List<Integer> listTypes;

    private List<Long> deletedImageIds; // Danh sách ID hình ảnh cần xóa

    private List<ComboResponse> listCombo;

    private List<Long> deletedComboIds; // Danh sách ID hình ảnh cần xóa
}
