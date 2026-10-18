package com.hieuvolaptrinh.Heatly_Store.Controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hieuvolaptrinh.Heatly_Store.Request.TypeRequest;
import com.hieuvolaptrinh.Heatly_Store.Response.TypeResponse;
import com.hieuvolaptrinh.Heatly_Store.Service.TypeService;
import com.hieuvolaptrinh.Heatly_Store.Util.ApiMessage;

import java.util.Collections;
import java.util.List;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/v1/types")
public class TypeController {

    private final TypeService typeService;

    public TypeController(TypeService typeService) {
        this.typeService = typeService;
    }

    // lấy tất cả các loại sản phẩm
    @GetMapping("")
    @ApiMessage("Lấy tất cả các loại sản phẩm thành công")
    public ResponseEntity<List<TypeResponse>> getAllTypes() {
        List<TypeResponse> listTypes = typeService.getAllTypes();
        return ResponseEntity.ok(listTypes != null ? listTypes : Collections.emptyList());
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

    // Cập nhật loại sản phẩm (admin)
    @PutMapping("/{typeId}")
    @ApiMessage("Cập nhật loại sản phẩm thành công")
    public ResponseEntity<TypeResponse> updateType(
            @PathVariable int typeId,
            @Valid @RequestBody TypeRequest typeRequest) {
        TypeResponse updatedType = typeService.updateType(typeId, typeRequest);
        return ResponseEntity.ok(updatedType);
    }

    // Xóa loại sản phẩm (admin)
    @DeleteMapping("/{typeId}")
    @ApiMessage("Xóa loại sản phẩm thành công")
    public ResponseEntity<Void> deleteType(@PathVariable int typeId) {
        typeService.deleteType(typeId);
        return ResponseEntity.noContent().build();
    }
}
