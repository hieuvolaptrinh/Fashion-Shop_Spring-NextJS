package com.hieuvolaptrinh.Heatly_Store.Controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hieuvolaptrinh.Heatly_Store.Request.TypeRequest;
import com.hieuvolaptrinh.Heatly_Store.Response.TypeResponse;
import com.hieuvolaptrinh.Heatly_Store.Service.TypeService;
import com.hieuvolaptrinh.Heatly_Store.Util.ApiMessage;

import java.util.List;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/v1/types")
public class TypeController {

    private final TypeService typeService;

    public TypeController(TypeService typeService) {
        this.typeService = typeService;
    }

    // lấy tẩt cả các loại sản phẩm
    @GetMapping("")
    @ApiMessage("Lấy tất cả các loại sản phẩm thành công")
    public ResponseEntity<List<TypeResponse>> getMethodName() {
        List<TypeResponse> listTypes = typeService.getAllTypes();
        if (listTypes.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(listTypes);
    }

    // lấy loại sản phẩm theo id
    @GetMapping("/{typeId}")
    @ApiMessage("Lấy loại sản phẩm theo ID thành công")
    public ResponseEntity<TypeResponse> getTypeById(@PathVariable int typeId) {
        TypeResponse typeResponse = typeService.getTypeById(typeId);
        if (typeResponse == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(typeResponse);
    }

    // Thêm loại sản phẩm mới (admin)
    @PostMapping("")
    @ApiMessage("Thêm loại sản phẩm mới thành công")
    public ResponseEntity<TypeResponse> createType(@Valid @RequestBody TypeRequest typeRequest) {
        TypeResponse createdType = typeService.createType(typeRequest);
        return ResponseEntity.status(201).body(createdType);
    }

}
