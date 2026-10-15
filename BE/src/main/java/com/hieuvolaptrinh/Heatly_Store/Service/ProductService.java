package com.hieuvolaptrinh.Heatly_Store.Service;

import java.util.ArrayList;
import java.util.List;

import com.hieuvolaptrinh.Heatly_Store.Model.Combo;
import com.hieuvolaptrinh.Heatly_Store.Repository.ComboRepository;
import com.hieuvolaptrinh.Heatly_Store.Response.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.hieuvolaptrinh.Heatly_Store.Model.Image;
import com.hieuvolaptrinh.Heatly_Store.Model.Product;
import com.hieuvolaptrinh.Heatly_Store.Model.Type;
import com.hieuvolaptrinh.Heatly_Store.Repository.ImageRepository;
import com.hieuvolaptrinh.Heatly_Store.Repository.ProductRepository;
import com.hieuvolaptrinh.Heatly_Store.Repository.TypeRepository;
import com.hieuvolaptrinh.Heatly_Store.Request.ProductRequest;
import com.hieuvolaptrinh.Heatly_Store.Request.Filter.ProductFilterRequest;
import com.hieuvolaptrinh.Heatly_Store.Service.Sepcification.ProductSpecification;

@Service
public class ProductService {
    private final ProductRepository productRepository;
    private final CloudinaryService cloudinaryService;
    private final TypeRepository typeRepository;
    private final ImageRepository imageRepository;
    private final ComboRepository comboRepository;


    public ProductService(ProductRepository productRepository,
                          CloudinaryService cloudinaryService,
                          TypeRepository typeRepository,
                          ImageRepository imageRepository, ComboRepository comboRepository) {
        this.productRepository = productRepository;
        this.cloudinaryService = cloudinaryService;
        this.typeRepository = typeRepository;
        this.imageRepository = imageRepository;
        this.comboRepository = comboRepository;
    }

    // Product-> ProductResponse
    public ProductResponse convertToProductResponse(Product product) {
        if (product == null) {
            return null;
        }
        ProductResponse response = new ProductResponse();
        response.setProductId(product.getProductId());
        response.setProductName(product.getProductName());
        response.setOriginalPrice(product.getOriginalPrice());
        response.setUsageInstructions(product.getUsageInstructions());
        response.setDescription(product.getDescription());
        response.setIngredients(product.getIngredients());
        response.setSalePrice(product.getSalePrice());
        response.setQuantity(product.getQuantity());
        response.setManufactureDate(product.getManufactureDate());
        if (product.getListImages() != null) {
            List<ImageResponse> imageResponses = new ArrayList<>();
            for (Image image : product.getListImages()) {
                ImageResponse imageResponse = new ImageResponse();
                imageResponse.setImageId(image.getImageId());
                imageResponse.setLink(image.getLink());
                imageResponses.add(imageResponse);
            }
            response.setListImages(imageResponses);
        }
        if (product.getListTypes() != null) {
            List<TypeResponse> typeResponses = new ArrayList<>();
            for (Type type : product.getListTypes()) {
                TypeResponse typeResponse = new TypeResponse();
                typeResponse.setTypeId(type.getTypeId());
                typeResponse.setTypeName(type.getTypeName());
                typeResponses.add(typeResponse);
            }
            response.setListTypes(typeResponses);
        }
        List<Combo> comboResponses = this.comboRepository.findComoByProduct(product);

        if (comboResponses != null) {

            List<ComboResponse> combos = new ArrayList<>();
            for (Combo combo : comboResponses) {
                ComboResponse comboResponse = new ComboResponse();
                comboResponse.setComboId(combo.getComboId());
                comboResponse.setComboPrice(combo.getComboPrice());
                comboResponse.setQuantityInCombo(combo.getQuantityInCombo());
                comboResponse.setComboDescription(combo.getComboDescription());
                combos.add(comboResponse);
            }
            response.setListCombo(combos);
        }
        return response;
    }

    @Transactional
    public void deleteProduct(int id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy sản phẩm với ID: " + id));

        // Xóa images từ Cloudinary trước
        if (product.getListImages() != null) {
            for (Image image : product.getListImages()) {
                try {
                    cloudinaryService.deleteImageByUrl(image.getLink());
                } catch (Exception e) {
                    System.err.println("Lỗi khi xóa ảnh từ Cloudinary: " + e.getMessage());
                    // Log error but continue
                }
            }
        }
        productRepository.delete(product);
    }

    @Transactional
    public Product updateProduct(int id, ProductRequest productRequest, List<MultipartFile> images) throws Exception {
        if (productRequest == null) {
            throw new IllegalArgumentException("ProductRequest is null");
        }

        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy sản phẩm với ID: " + id));

        existingProduct.setProductName(productRequest.getProductName());
        existingProduct.setDescription(productRequest.getDescription());
        existingProduct.setOriginalPrice(productRequest.getOriginalPrice());
        existingProduct.setUsageInstructions(productRequest.getUsageInstructions());
        existingProduct.setIngredients(productRequest.getIngredients());
        existingProduct.setSalePrice(productRequest.getSalePrice());
        existingProduct.setQuantity(productRequest.getQuantity());
        existingProduct.setManufactureDate(productRequest.getManufactureDate());

        if (productRequest.getListTypes() != null && !productRequest.getListTypes().isEmpty()) {
            List<Type> types = typeRepository.findAllByTypeIdIn(productRequest.getListTypes());
            if (types.size() != productRequest.getListTypes().size()) {
                throw new IllegalArgumentException("Một số Type không tồn tại");
            }
            existingProduct.setListTypes(types);
        }

        // Xử lý xóa hình ảnh
        if (productRequest.getDeletedImageIds() != null && !productRequest.getDeletedImageIds().isEmpty()) {
            System.out.println("Deleting image IDs: " + productRequest.getDeletedImageIds());
            debugProductImages(existingProduct, "BEFORE DELETION");
            List<Image> currentImages = existingProduct.getListImages();
            if (currentImages != null) {
                List<Image> imagesToDelete = new ArrayList<>();
                for (Image image : currentImages) {
                    if (productRequest.getDeletedImageIds().contains((long) image.getImageId())) {
                        imagesToDelete.add(image);
                    }
                }
                System.out.println("Found " + imagesToDelete.size() + " images to delete");
                for (Image image : imagesToDelete) {
                    try {
                        cloudinaryService.deleteImageByUrl(image.getLink());
                        System.out.println("Deleted from Cloudinary - Image ID: " + image.getImageId() + ", URL: "
                                + image.getLink());
                    } catch (Exception e) {
                        System.err.println(
                                "Error deleting image from Cloudinary - ID " + image.getImageId() + ": "
                                        + e.getMessage());
                    }
                    existingProduct.removeImage(image);
                    try {
                        imageRepository.deleteByImageId(image.getImageId());
                        System.out.println("Deleted from database - Image ID: " + image.getImageId());
                    } catch (Exception e) {
                        System.err.println(
                                "Error deleting from database - ID " + image.getImageId() + ": " + e.getMessage());
                    }
                    System.out.println("Removed image from product - Image ID: " + image.getImageId());
                }
                debugProductImages(existingProduct, "AFTER DELETION");
                existingProduct = productRepository.save(existingProduct);
                debugProductImages(existingProduct, "AFTER SAVE");
            } else {
                System.out.println("No images found in product");
            }
        }

        // Xử lý xóa combo
        if (productRequest.getDeletedComboIds() != null && !productRequest.getDeletedComboIds().isEmpty()) {
            System.out.println("Deleting combo IDs: " + productRequest.getDeletedComboIds());

            List<Combo> currentCombos = existingProduct.getListCombos();
            if (currentCombos != null) {
                List<Combo> combosToDelete = new ArrayList<>();
                for (Combo combo : currentCombos) {
                    if (productRequest.getDeletedComboIds().contains((long) combo.getComboId())) {
                        combosToDelete.add(combo);
                    }
                }
                System.out.println("Found " + combosToDelete.size() + " combos to delete");
                for (Combo combo : combosToDelete) {
                    try {
                        existingProduct.getListCombos().remove(combo);
                        comboRepository.deleteById(combo.getComboId());
                        System.out.println("Deleted combo from database - Combo ID: " + combo.getComboId());
                    } catch (Exception e) {
                        System.err.println(
                                "Error deleting combo from database - ID " + combo.getComboId() + ": " + e.getMessage());
                    }
                }

                existingProduct = productRepository.save(existingProduct);

            } else {
                System.out.println("No combos found in product");
            }
        }

        // Xử lý thêm hoặc cập nhật combo
        if (productRequest.getListCombo() != null && !productRequest.getListCombo().isEmpty()) {
            for (ComboResponse comboResponse : productRequest.getListCombo()) {
                Combo combo;
                if (comboResponse.getComboId() > 0) {
                    // Cập nhật combo hiện có
                    combo = comboRepository.findById(comboResponse.getComboId())
                            .orElseThrow(() -> new IllegalArgumentException("Combo không tồn tại: " + comboResponse.getComboId()));
                } else {
                    // Tạo combo mới
                    combo = new Combo();
                    combo.setProduct(existingProduct);
                }
                combo.setQuantityInCombo(comboResponse.getQuantityInCombo());
                combo.setComboPrice(comboResponse.getComboPrice());
                combo.setComboDescription(comboResponse.getComboDescription());
                existingProduct.addCombo(combo);
            }
            existingProduct = productRepository.save(existingProduct);
        }

        // Xử lý thêm hình ảnh mới
        if (images != null && !images.isEmpty()) {
            for (MultipartFile file : images) {
                if (file.isEmpty()) {
                    throw new IllegalArgumentException("Có file hình ảnh rỗng: " + file.getOriginalFilename());
                }
                try {
                    String imageUrl = cloudinaryService.uploadImage(file);
                    Image image = new Image();
                    image.setImageName(file.getOriginalFilename());
                    image.setLink(imageUrl);
                    existingProduct.addImage(image);
                } catch (Exception e) {
                    throw new Exception("Lỗi khi upload ảnh " + file.getOriginalFilename() + ": " + e.getMessage());
                }
            }
        }

        return productRepository.save(existingProduct);
    }
    @Transactional
    public Product createProduct(ProductRequest productRequest, List<MultipartFile> images) throws Exception {
        if (productRequest == null) {
            throw new IllegalArgumentException("ProductRequest is null");
        }
        Product product = new Product();
        product.setProductName(productRequest.getProductName());
        product.setDescription(productRequest.getDescription());
        product.setOriginalPrice(productRequest.getOriginalPrice());
        product.setUsageInstructions(productRequest.getUsageInstructions());
        product.setIngredients(productRequest.getIngredients());
        product.setSalePrice(productRequest.getSalePrice());
        product.setQuantity(productRequest.getQuantity());
        product.setManufactureDate(productRequest.getManufactureDate());
        if (productRequest.getListTypes() != null && !productRequest.getListTypes().isEmpty()) {
            List<Type> types = typeRepository.findAllByTypeIdIn(productRequest.getListTypes());
            if (types.size() != productRequest.getListTypes().size()) {
                throw new IllegalArgumentException("Một số Type không tồn tại");
            }
            product.setListTypes(types);
        }
        if (images != null && !images.isEmpty()) {
            for (MultipartFile file : images) {
                if (file.isEmpty()) {
                    throw new IllegalArgumentException("Có file hình ảnh rỗng: " + file.getOriginalFilename());
                }
                try {
                    String imageUrl = cloudinaryService.uploadImage(file);
                    Image image = new Image();
                    image.setImageName(file.getOriginalFilename());
                    image.setLink(imageUrl);
                    product.addImage(image);
                } catch (Exception e) {
                    throw new Exception("Lỗi khi upload ảnh " + file.getOriginalFilename() + ": " + e.getMessage());
                }
            }
        }
        // Xử lý danh sách combo
        if (productRequest.getListCombo() != null && !productRequest.getListCombo().isEmpty()) {
            for (ComboResponse comboResponse : productRequest.getListCombo()) {
                Combo combo = new Combo();
                combo.setQuantityInCombo(comboResponse.getQuantityInCombo());
                combo.setComboPrice(comboResponse.getComboPrice());
                combo.setComboDescription(comboResponse.getComboDescription());
                product.addCombo(combo);
            }
        }
        return productRepository.save(product);
    }
    public List<ProductResponse> getAllProducts() {
        List<Product> products = productRepository.findAll();
        List<ProductResponse> responses = new ArrayList<>();
        for (Product product : products) {
            responses.add(convertToProductResponse(product));
        }
        return responses;
    }

    // phân trang và lọc
    public PageResponse<ProductResponse> getAllProducts(int page, int size, ProductFilterRequest filter) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("productName").ascending());
        Specification<Product> spec = ProductSpecification.filterProducts(filter);
        Page<Product> productPage = productRepository.findAll(spec, pageable);
        List<ProductResponse> responses = new ArrayList<>();
        for (Product product : productPage.getContent()) {
            responses.add(convertToProductResponse(product));
        }
        return new PageResponse<>(
                responses,
                productPage.getNumber(),
                productPage.getTotalElements(),
                productPage.getTotalPages());
    }

    // chỉ phân trang (không có filter)
    public PageResponse<ProductResponse> getAllProducts(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("productName").ascending());
        Page<Product> productPage = productRepository.findAll(pageable);
        List<ProductResponse> responses = new ArrayList<>();
        for (Product product : productPage.getContent()) {
            responses.add(convertToProductResponse(product));
        }
        return new PageResponse<>(
                responses,
                productPage.getNumber(),
                productPage.getTotalElements(),
                productPage.getTotalPages());
    }

    public ProductResponse getProductById(int id) {
        Product product = productRepository.findById(id).orElse(null);
        if (product == null) {
            return null;
        }
        return convertToProductResponse(product);
    }

    // Helper method để debug
    private void debugProductImages(Product product, String context) {
        System.out.println("=== DEBUG " + context + " ===");
        System.out.println("Product ID: " + product.getProductId());
        List<Image> images = product.getListImages();
        if (images == null) {
            System.out.println("Images list is NULL");
        } else {
            System.out.println("Images count: " + images.size());
            for (Image img : images) {
                System.out.println("  - Image ID: " + img.getImageId() + ", Link: " + img.getLink());
            }
        }
        System.out.println("=== END DEBUG ===");
    }
}
