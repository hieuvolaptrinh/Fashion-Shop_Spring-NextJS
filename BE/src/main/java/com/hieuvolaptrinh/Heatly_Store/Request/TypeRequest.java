package com.hieuvolaptrinh.Heatly_Store.Request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TypeRequest {
    private int typeId;

    @NotBlank(message = "Tên loại sản phẩm không được để trống")
    @Size(min = 2, max = 256, message = "Tên loại sản phẩm phải có độ dài từ 2 đến 256 ký tự")
    private String typeName;

    private String imageUrl;

    public TypeRequest() {
    }

    public TypeRequest(int typeId, String typeName) {
        this.typeId = typeId;
        this.typeName = typeName;
    }

    public TypeRequest(int typeId, String typeName, String imageUrl) {
        this.typeId = typeId;
        this.typeName = typeName;
        this.imageUrl = imageUrl;
    }
}
