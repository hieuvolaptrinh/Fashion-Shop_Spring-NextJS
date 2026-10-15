package com.hieuvolaptrinh.Heatly_Store.Controller;

import com.hieuvolaptrinh.Heatly_Store.Request.AddProductRequest;
import com.hieuvolaptrinh.Heatly_Store.Response.CartResponse;
import com.hieuvolaptrinh.Heatly_Store.Response.UpdateCartDetailRequest;
import com.hieuvolaptrinh.Heatly_Store.Service.CartService;
import com.hieuvolaptrinh.Heatly_Store.Request.UpdateCartItemRequest;
import com.hieuvolaptrinh.Heatly_Store.Util.ApiMessage;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/carts")
public class CartController {
    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    // 1. Thêm sản phẩm vào cart
    @PostMapping("/items")
    @ApiMessage("Add product to cart successfully")
    public ResponseEntity<CartResponse> addProduct(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody AddProductRequest req) {
        CartResponse updated = cartService.addProductToCart(userDetails, req);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(updated);
    }

    // 2. Lấy cart theo user
    @GetMapping()
    @ApiMessage("Get cart by user successfully")
    public ResponseEntity<CartResponse> getCart(
            @AuthenticationPrincipal UserDetails userDetails) {
        CartResponse dto = cartService.getCartByUserDetails(userDetails);
        return ResponseEntity.ok(dto);
    }

    // 3. Xóa một sản phẩm trong cart
    @DeleteMapping("/items/{cartDetailId}")
    @ApiMessage("Remove product from cart successfully")
    public ResponseEntity<CartResponse> removeProduct(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable int cartDetailId) {
        CartResponse updated = cartService.removeProductFromCart(userDetails, cartDetailId);
        return ResponseEntity.ok(updated);
    }

    // 4. Cập nhật số lượng sản phẩm trong cart
    @PutMapping("/items")
    @ApiMessage("Update product quantity in cart successfully")
    public ResponseEntity<CartResponse> updateProductQuantity(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody UpdateCartDetailRequest req) {
        CartResponse updated = cartService.updateProductQuantity(userDetails, req);
        return ResponseEntity.ok(updated);
    }
}
