package com.hieuvolaptrinh.Heatly_Store.Service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;
import java.util.Optional;

import com.hieuvolaptrinh.Heatly_Store.Repository.TypeRepository;
import com.hieuvolaptrinh.Heatly_Store.Model.Type;
import com.hieuvolaptrinh.Heatly_Store.Model.Product;
import com.hieuvolaptrinh.Heatly_Store.Request.TypeRequest;
import com.hieuvolaptrinh.Heatly_Store.Response.TypeResponse;

@Service
public class TypeService {

    private final TypeRepository typeRepository;

    public TypeService(TypeRepository typeRepository) {
        this.typeRepository = typeRepository;
    }

    /**
     * Lấy tất cả các loại sản phẩm
     * 
     * @return List<TypeResponse> - Danh sách tất cả các loại sản phẩm
     */
    @Transactional(readOnly = true)
    public List<TypeResponse> getAllTypes() {
        List<Type> types = typeRepository.findAll();
        List<Object[]> countList = typeRepository.countProductsGroupedByType();
        Map<Integer, Integer> productCountMap = new HashMap<>();
        if (countList != null) {
            for (Object[] row : countList) {
                if (row.length >= 2 && row[0] instanceof Number && row[1] instanceof Number) {
                    productCountMap.put(((Number) row[0]).intValue(), ((Number) row[1]).intValue());
                }
            }
        }

        return types.stream()
                .map(type -> {
                    TypeResponse response = new TypeResponse();
                    response.setTypeId(type.getTypeId());
                    response.setTypeName(type.getTypeName());
                    response.setImageUrl(type.getImageUrl());
                    response.setProductCount(productCountMap.getOrDefault(type.getTypeId(), 0));
                    return response;
                })
                .collect(Collectors.toList());
    }

    /**
     * Lấy loại sản phẩm theo ID
     * 
     * @param typeId - ID của loại sản phẩm cần tìm
     * @return TypeResponse - Thông tin loại sản phẩm hoặc null nếu không tìm thấy
     */
    @Transactional(readOnly = true)
    public TypeResponse getTypeById(int typeId) {
        Optional<Type> typeOptional = typeRepository.findById(typeId);
        if (typeOptional.isPresent()) {
            return convertToTypeResponse(typeOptional.get());
        }
        return null;
    }

    /**
     * Tạo loại sản phẩm mới
     * 
     * @param typeRequest - Thông tin loại sản phẩm cần tạo
     * @return TypeResponse - Thông tin loại sản phẩm đã được tạo
     */
    @Transactional(rollbackFor = Exception.class)
    public TypeResponse createType(TypeRequest typeRequest) {
        if (typeRequest.getTypeName() == null || typeRequest.getTypeName().trim().isEmpty()) {
            throw new IllegalArgumentException("Tên danh mục không được để trống");
        }
        Type type = new Type();
        type.setTypeName(typeRequest.getTypeName().trim());
        type.setImageUrl(typeRequest.getImageUrl() != null && !typeRequest.getImageUrl().trim().isEmpty() 
                ? typeRequest.getImageUrl().trim() : null);

        Type savedType = typeRepository.save(type);
        return convertToTypeResponse(savedType);
    }

    /**
     * Cập nhật thông tin loại sản phẩm
     * 
     * @param typeId - ID loại sản phẩm cần cập nhật
     * @param typeRequest - Thông tin cập nhật
     * @return TypeResponse
     */
    @Transactional(rollbackFor = Exception.class)
    public TypeResponse updateType(int typeId, TypeRequest typeRequest) {
        Type type = typeRepository.findById(typeId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy danh mục với ID: " + typeId));

        if (typeRequest.getTypeName() == null || typeRequest.getTypeName().trim().isEmpty()) {
            throw new IllegalArgumentException("Tên danh mục không được để trống");
        }

        type.setTypeName(typeRequest.getTypeName().trim());
        if (typeRequest.getImageUrl() != null) {
            type.setImageUrl(typeRequest.getImageUrl().trim().isEmpty() ? null : typeRequest.getImageUrl().trim());
        }
        Type updatedType = typeRepository.save(type);
        return convertToTypeResponse(updatedType);
    }

    /**
     * Xóa loại sản phẩm và tự động gỡ liên kết khỏi các sản phẩm liên quan
     * 
     * @param typeId - ID loại sản phẩm cần xóa
     */
    @Transactional(rollbackFor = Exception.class)
    public void deleteType(int typeId) {
        Type type = typeRepository.findById(typeId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy danh mục với ID: " + typeId));

        // Tự động gỡ liên kết danh mục khỏi các sản phẩm, đảm bảo không xóa mất sản phẩm
        if (type.getListProducts() != null) {
            for (Product product : type.getListProducts()) {
                if (product.getListTypes() != null) {
                    product.getListTypes().remove(type);
                }
            }
            type.getListProducts().clear();
        }

        typeRepository.delete(type);
    }

    /**
     * Chuyển đổi từ Type entity sang TypeResponse
     * 
     * @param type - Type entity
     * @return TypeResponse
     */
    private TypeResponse convertToTypeResponse(Type type) {
        TypeResponse response = new TypeResponse();
        response.setTypeId(type.getTypeId());
        response.setTypeName(type.getTypeName());
        response.setImageUrl(type.getImageUrl());
        long count = type.getTypeId() > 0 ? typeRepository.countProductsByTypeId(type.getTypeId()) : 0;
        response.setProductCount((int) count);
        return response;
    }
}
