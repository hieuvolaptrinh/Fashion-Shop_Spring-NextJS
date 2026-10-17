package com.hieuvolaptrinh.Heatly_Store.Service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Optional;

import com.hieuvolaptrinh.Heatly_Store.Repository.TypeRepository;
import com.hieuvolaptrinh.Heatly_Store.Model.Type;
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
        return types.stream()
                .map(this::convertToTypeResponse)
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
        Type type = new Type();
        type.setTypeName(typeRequest.getTypeName());

        Type savedType = typeRepository.save(type);
        return convertToTypeResponse(savedType);
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
        return response;
    }
}
