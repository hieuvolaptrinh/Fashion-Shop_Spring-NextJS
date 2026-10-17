package com.hieuvolaptrinh.Heatly_Store.Request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TypeRequest {
    private int typeId;
    private String typeName;

    public TypeRequest() {
    }

    public TypeRequest(int typeId, String typeName) {
        this.typeId = typeId;
        this.typeName = typeName;
    }
}
