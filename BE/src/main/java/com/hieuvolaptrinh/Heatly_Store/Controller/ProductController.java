package com.hieuvolaptrinh.Heatly_Store.Controller;


import org.springframework.web.bind.annotation.*;

import org.springframework.web.multipart.MultipartFile;

import com.hieuvolaptrinh.Heatly_Store.Model.Product;
import com.hieuvolaptrinh.Heatly_Store.Request.ProductRequest;
import com.hieuvolaptrinh.Heatly_Store.Request.Filter.ProductFilterRequest;
import com.hieuvolaptrinh.Heatly_Store.Response.PageResponse;
import com.hieuvolaptrinh.Heatly_Store.Response.ProductResponse;
import com.hieuvolaptrinh.Heatly_Store.Service.ProductService;
import com.hieuvolaptrinh.Heatly_Store.Util.ApiMessage;

import jakarta.validation.Valid;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/api/v1/products")
public class ProductController {
    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping(consumes = { "multipart/form-data" })
    @ApiMessage("Create a new product successfully")
    public ResponseEntity<ProductResponse> createProduct(
            @Valid @RequestPart("product") ProductRequest productRequest, // @RequestPart("product") để nhận JSON của
                                                                          // ProductRequest từ phần product của
                                                                          // multipart/form-data.
            @RequestPart(value = "images", required = false) List<MultipartFile> images) throws Exception {
        Product created = productService.createProduct(productRequest, images);
        ProductResponse response = productService.convertToProductResponse(created);
        return ResponseEntity.status(org.springframework.http.HttpStatus.CREATED).body(response);
    }

    // ### 1. Lấy tất cả sản phẩm (phân trang)
    // GET /api/v1/products?page=0&size=10
    // ### 2. Tìm kiếm sản phẩm theo tên
    // GET /api/v1/products?productName=vitamin&page=0&size=5
    // ### 3. Lọc theo khoảng giá
    // GET /api/v1/products?minSalePrice=100000&maxSalePrice=500000&page=0&size=10
    // ### 4. Lọc theo loại sản phẩm
    // GET /api/v1/products?typeId=1&typeId=2&typeId=3&page=0&size=10
    // ### 5. Lọc kết hợp nhiều điều kiện
    // GET
    // api/v1/products?productName=protein&minSalePrice=200000&maxSalePrice=800000&typeId=1&typeId=2&page=0&size=10

    @GetMapping
    @ApiMessage("Get all products successfully")
    public ResponseEntity<PageResponse<ProductResponse>> getAllProducts(
            @RequestParam(name = "page", required = false, defaultValue = "0") int page,
            @RequestParam(name = "size", required = false, defaultValue = "5") int size,
            @RequestParam(name = "productName", required = false) String productName,
            @RequestParam(name = "minSalePrice", required = false) Double minSalePrice,
            @RequestParam(name = "maxSalePrice", required = false) Double maxSalePrice,
            @RequestParam(name = "typeId", required = false) List<Integer> typeId) {

        // Tạo ProductFilterRequest từ request parameters
        ProductFilterRequest filter = new ProductFilterRequest();
        filter.setProductName(productName);
        filter.setMinSalePrice(minSalePrice);
        filter.setMaxSalePrice(maxSalePrice);
        filter.setTypeId(typeId);

        PageResponse<ProductResponse> response = productService.getAllProducts(page, size, filter);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @ApiMessage("Get product by ID successfully")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable int id) {
        ProductResponse product = productService.getProductById(id);
        if (product == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(product);
    }

    @PutMapping(value = "/{id}", consumes = { "multipart/form-data" })
    @ApiMessage("Update product by ID successfully")
    public ResponseEntity<ProductResponse> updateProduct(
            @PathVariable int id,
            @Valid @RequestPart("product") ProductRequest productRequest,
            @RequestPart(value = "images", required = false) List<MultipartFile> images) throws Exception {
        Product updated = productService.updateProduct(id, productRequest, images);
        ProductResponse response = productService.convertToProductResponse(updated);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @DeleteMapping("/{id}")
    @ApiMessage("Delete product by ID successfully")
    public ResponseEntity<Void> deleteAProduct(@PathVariable int id) {
        productService.deleteProduct(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }


}
