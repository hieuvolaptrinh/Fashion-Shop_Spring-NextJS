package com.hieuvolaptrinh.Heatly_Store.Response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TypeResponse {
    private int typeId;
    private String typeName;
    private String imageUrl;
    private int productCount;

    public TypeResponse() {
    }

    public TypeResponse(int typeId, String typeName) {
        this.typeId = typeId;
        this.typeName = typeName;
    }

    public TypeResponse(int typeId, String typeName, String imageUrl) {
        this.typeId = typeId;
        this.typeName = typeName;
        this.imageUrl = imageUrl;
    }

    public TypeResponse(int typeId, String typeName, int productCount) {
        this.typeId = typeId;
        this.typeName = typeName;
        this.productCount = productCount;
    }

    public TypeResponse(int typeId, String typeName, String imageUrl, int productCount) {
        this.typeId = typeId;
        this.typeName = typeName;
        this.imageUrl = imageUrl;
        this.productCount = productCount;
    }
}
