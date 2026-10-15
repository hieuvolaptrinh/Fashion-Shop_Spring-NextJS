package com.hieuvolaptrinh.Heatly_Store.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.hieuvolaptrinh.Heatly_Store.Response.Notification;
import com.hieuvolaptrinh.Heatly_Store.Service.CloudinaryService;
import com.hieuvolaptrinh.Heatly_Store.Util.ApiMessage;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

//  test
@RestController
@RequestMapping("/api/v1/images")
public class ImageController {

    private final CloudinaryService cloudinaryService;

    public ImageController(CloudinaryService cloudinaryService) {
        this.cloudinaryService = cloudinaryService;
    }

    @PostMapping("/upload")
    @ApiMessage("Upload an image to Cloudinary successfully")
    public ResponseEntity<Notification> uploadImage(
            @RequestParam("file") @NotNull MultipartFile file) {
        try {
            if (file.isEmpty()) {
                Notification notification = new Notification("File không được để trống");
                return ResponseEntity.badRequest().body(notification);
            }
            String imageUrl = cloudinaryService.uploadImage(file);
            Notification notification = new Notification("Upload image successfully");
            notification.setMessage(imageUrl);
            return ResponseEntity.ok(notification);
        } catch (Exception e) {
            Notification notification = new Notification("Lỗi khi upload ảnh: " + e.getMessage());
            return ResponseEntity.internalServerError().body(notification);
        }
    }

    @DeleteMapping("/delete")
    @ApiMessage("Delete an image from Cloudinary successfully")
    public ResponseEntity<Notification> deleteImage(
            @RequestParam("imageUrl") @NotBlank String imageUrl) {
        try {
            String result = cloudinaryService.deleteImageByUrl(imageUrl);

            Notification notification = new Notification("Delete image successfully");
            notification.setMessage(result);
            return ResponseEntity.ok(notification);

        } catch (Exception e) {
            Notification notification = new Notification("Lỗi khi xóa ảnh: " + e.getMessage());
            return ResponseEntity.internalServerError().body(notification);
        }
    }
}
