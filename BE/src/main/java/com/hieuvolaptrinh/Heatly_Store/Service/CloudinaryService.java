package com.hieuvolaptrinh.Heatly_Store.Service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.Arrays;
import java.util.List;

@Service
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public CloudinaryService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    @SuppressWarnings("unchecked")
    public String uploadImage(MultipartFile file) throws IOException {
        // Validate file type
        validateImageFile(file);

        Map<String, Object> uploadParams = ObjectUtils.asMap(
                "resource_type", "image",
                "folder", "healthy-store",
                "use_filename", true,
                "unique_filename", true,
                "overwrite", false);

        Map<String, Object> uploadResult = cloudinary.uploader().upload(file.getBytes(), uploadParams);
        return uploadResult.get("secure_url").toString();
    }

    /**
     * Upload ảnh lên Cloudinary với optimization
     */
    @SuppressWarnings("unchecked")
    public String uploadImageWithOptimization(MultipartFile file) throws IOException {
        // Validate file type
        validateImageFile(file);

        // Upload ảnh với các tham số tối ưu hóa
        Map<String, Object> uploadParams = ObjectUtils.asMap(
                "resource_type", "image",
                "folder", "healthy-store",
                "use_filename", true,
                "unique_filename", true,
                "overwrite", false,
                "transformation", "q_auto,f_auto,c_limit,w_1920,h_1080");

        Map<String, Object> uploadResult = cloudinary.uploader().upload(file.getBytes(), uploadParams);
        return uploadResult.get("secure_url").toString();
    }

    public String deleteImageByUrl(String imageUrl) throws IOException {
        String publicId = extractPublicIdFromUrl(imageUrl);
        return deleteImage(publicId);
    }

    /**
     * Xóa ảnh từ Cloudinary bằng public ID
     */
    @SuppressWarnings("unchecked")
    public String deleteImage(String publicId) throws IOException {
        try {
            System.out.println("Attempting to delete image with public ID: " + publicId);

            Map<String, Object> result = cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());

            System.out.println("Delete result: " + result);

            String status = result.get("result").toString();

            if ("ok".equals(status)) {
                return "Xóa ảnh thành công";
            } else if ("not found".equals(status)) {
                return "Không tìm thấy ảnh với ID: " + publicId;
            } else {
                return "Xóa ảnh thất bại: " + status;
            }

        } catch (Exception e) {
            System.err.println("Error deleting image: " + e.getMessage());
            throw new IOException("Lỗi khi xóa ảnh: " + e.getMessage(), e);
        }
    }

    /**
     * Trích xuất public ID từ URL Cloudinary
     */
    private String extractPublicIdFromUrl(String imageUrl) {
        // URL Cloudinary có dạng:
        // https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{folder}/{filename}.{extension}
        // Ví dụ:
        // https://res.cloudinary.com/dsea27ihd/image/upload/v1750091029/healthy-store/file_uz0mmb.jpg

        if (imageUrl == null || !imageUrl.contains("cloudinary.com")) {
            throw new IllegalArgumentException("URL không hợp lệ hoặc không phải từ Cloudinary");
        }

        try {
            // Tách phần sau "/upload/"
            String[] parts = imageUrl.split("/upload/");
            if (parts.length < 2) {
                throw new IllegalArgumentException("URL Cloudinary không hợp lệ");
            }

            String afterUpload = parts[1];

            // Loại bỏ phần version (vXXXX/) nếu có
            if (afterUpload.startsWith("v")) {
                int firstSlash = afterUpload.indexOf('/');
                if (firstSlash > 0) {
                    afterUpload = afterUpload.substring(firstSlash + 1);
                }
            }

            // Loại bỏ extension (.jpg, .png, etc.)
            int lastDotIndex = afterUpload.lastIndexOf('.');
            String publicId = lastDotIndex > 0 ? afterUpload.substring(0, lastDotIndex) : afterUpload;

            System.out.println("Extracted public ID: " + publicId);
            return publicId;

        } catch (Exception e) {
            throw new IllegalArgumentException("Không thể trích xuất public ID từ URL: " + imageUrl, e);
        }
    }

    /**
     * Validate file ảnh
     */
    private void validateImageFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File không được để trống");
        }

        String contentType = file.getContentType();
        List<String> allowedTypes = Arrays.asList(
                "image/jpeg", "image/png", "image/gif", "image/webp", "image/bmp");

        if (contentType == null || !allowedTypes.contains(contentType)) {
            throw new IllegalArgumentException("Chỉ chấp nhận file ảnh (JPEG, PNG, GIF, WebP, BMP)");
        }

        // Giới hạn kích thước file (10MB)
        long maxSizeInBytes = 10 * 1024 * 1024; // 10MB
        if (file.getSize() > maxSizeInBytes) {
            throw new IllegalArgumentException("Kích thước file không được vượt quá 10MB");
        }
    }
}
