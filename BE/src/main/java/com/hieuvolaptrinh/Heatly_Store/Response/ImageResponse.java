package com.hieuvolaptrinh.Heatly_Store.Response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ImageResponse {
    private int imageId;
    private String link;

    public ImageResponse() {
    }

    public ImageResponse(int imageId, String link) {
        this.imageId = imageId;
        this.link = link;
    }
}