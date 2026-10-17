package com.hieuvolaptrinh.Heatly_Store.Response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TypeResponse {
    private int typeId;
    private String typeName;

    public TypeResponse() {
    }

    public TypeResponse(int typeId, String typeName) {
        this.typeId = typeId;
        this.typeName = typeName;
    }
}
