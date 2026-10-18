package com.hieuvolaptrinh.Heatly_Store.Service;

import com.hieuvolaptrinh.Heatly_Store.Model.*;
import com.hieuvolaptrinh.Heatly_Store.Repository.*;
import com.hieuvolaptrinh.Heatly_Store.Response.UpdateCartDetailRequest;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.hieuvolaptrinh.Heatly_Store.Request.AddProductRequest;
import com.hieuvolaptrinh.Heatly_Store.Response.CartDetailResponse;
import com.hieuvolaptrinh.Heatly_Store.Response.CartResponse;
import com.hieuvolaptrinh.Heatly_Store.Response.ProductResponse;

import java.util.List;
import java.util.ArrayList;
import java.util.stream.Collectors;

@Service
public class CartService {
    private final CartRepository cartRepo;
    private final UserRepository userRepo;
    private final CartDetailRepository cartDetailRepo;
    private final ProductRepository productRepo;
    private final ProductService productService;
private final ComboRepository comboRepo;
    public CartService(CartRepository cartRepo,
            UserRepository userRepo,
            ProductRepository productRepo,
            CartDetailRepository cartDetailRepo,
            ProductService productService, ComboRepository comboRepo) {
        this.cartRepo = cartRepo;
        this.userRepo = userRepo;
        this.productRepo = productRepo;
        this.cartDetailRepo = cartDetailRepo;
        this.productService = productService;
        this.comboRepo = comboRepo;
    }

    // Thêm sản phẩm vào giỏ hàng
    @Transactional(rollbackFor = Exception.class)
    public CartResponse addProductToCart(UserDetails userDetails, AddProductRequest req) {
        int userId = Integer.parseInt(userDetails.getUsername());
        User user = userRepo.findByUserId(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found: " + userId));

        Cart cart = user.getCart();
        if (cart == null) {
            cart = new Cart();
            cart.setUser(user);
            cart.setListCartDetails(new ArrayList<>());
            cart = cartRepo.save(cart);
            user.setCart(cart);
            userRepo.save(user);
        }

        Product product = productRepo.findById(req.getProductId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Product không tồn tại: " + req.getProductId()));

        CartDetail existingDetail;
        if (req.getComboId() == 0) {
            // Sản phẩm đơn lẻ
            existingDetail = cart.getListCartDetails().stream()
                    .filter(detail -> detail.getProduct().getProductId() == req.getProductId() && detail.getCombo() == null)
                    .findFirst()
                    .orElse(null);
        } else {
            // Combo
            if (!comboRepo.existsById(req.getComboId())) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Combo not found: " + req.getComboId());
            }
            existingDetail = cart.getListCartDetails().stream()
                    .filter(detail -> detail.getCombo() != null && detail.getCombo().getComboId() == req.getComboId())
                    .findFirst()
                    .orElse(null);
        }

        if (existingDetail != null) {
            // Tăng số lượng nếu đã tồn tại
            existingDetail.setQuantity(existingDetail.getQuantity() + req.getQuantity());
            cartDetailRepo.save(existingDetail);
        } else {
            // Tạo mới CartDetail
            CartDetail detail = new CartDetail();
            detail.setProduct(product);
            detail.setQuantity(req.getQuantity());
            detail.setCart(cart);
            if (req.getComboId() == 0) {
                detail.setCombo(null);
                detail.setPrice(product.getSalePrice());
            } else {
                Combo combo = comboRepo.findById(req.getComboId()).orElseThrow();
                detail.setCombo(combo);
                detail.setPrice(combo.getComboPrice());
            }
            cart.getListCartDetails().add(detail);
            cartDetailRepo.save(detail);
        }

        return buildCartResponse(cart);
    }
    // Cập nhật số lượng sản phẩm trong giỏ hàng
    @Transactional(rollbackFor = Exception.class)
    public CartResponse updateProductQuantity(UserDetails userDetails, UpdateCartDetailRequest req) {
        int userId = Integer.parseInt(userDetails.getUsername());
        User user = userRepo.findByUserId(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found: " + userId));
        Cart cart = user.getCart();
        if (cart == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Cart not found for user: " + userId);
        }
        CartDetail detail = cart.getListCartDetails().stream()
                .filter(d -> d.getCartDetailId() == req.getCartDetailId())
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cart detail not found: " + req.getCartDetailId()));

        if (req.getQuantity() <= 0) {
            cart.getListCartDetails().remove(detail);
            cartDetailRepo.delete(detail);
        } else {
            detail.setQuantity(req.getQuantity());
            cartDetailRepo.save(detail);
        }

        return buildCartResponse(cart);
    }
    // Lấy cart theo user details
    @Transactional(rollbackFor = Exception.class)
    public CartResponse getCartByUserDetails(UserDetails userDetails) {
        int userId = Integer.parseInt(userDetails.getUsername());
        User user = userRepo.findByUserId(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found: " + userId));

        Cart cart = user.getCart();
        if (cart == null) {
            cart = cartRepo.findByUser_UserId(userId);
            if (cart == null) {
                cart = new Cart();
                cart.setUser(user);
                cart.setListCartDetails(new ArrayList<>());
                cart = cartRepo.save(cart);
            }
            user.setCart(cart);
            userRepo.save(user);
        }
        return buildCartResponse(cart);
    }

    // Xóa sản phẩm khỏi giỏ hàng
    @Transactional(rollbackFor = Exception.class)
    public CartResponse removeProductFromCart(UserDetails userDetails, int cartDetailId) {
        int userId = Integer.parseInt(userDetails.getUsername());
        User user = userRepo.findByUserId(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found: " + userId));
        Cart cart = user.getCart();
        if (cart == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Cart not found for user: " + userId);
        }
        CartDetail detail = cart.getListCartDetails().stream()
                .filter(d -> d.getCartDetailId() == cartDetailId)
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Item not in cart"));
        cart.getListCartDetails().remove(detail);
        cartDetailRepo.delete(detail);

        return buildCartResponse(cart);
    }

    // Xây dựng CartResponse từ Cart entity
    private CartResponse buildCartResponse(Cart cart) {
        CartResponse dto = new CartResponse();
        dto.setCartId(cart.getCartId());

        // Tính tổng tiền cho cart
        double totalPrices = 0;
        if (cart.getListCartDetails() != null && !cart.getListCartDetails().isEmpty()) {
            totalPrices = cart.getListCartDetails().stream()
                    .mapToDouble(detail -> detail.getPrice() * detail.getQuantity())
                    .sum();
        }

        List<CartDetailResponse> detailDtos = cart.getListCartDetails() != null ? cart.getListCartDetails().stream()
                .map(this::buildCartDetailResponse)
                .collect(Collectors.toList()) : new ArrayList<>();

        dto.setItems(detailDtos);
        dto.setTotalPrices(totalPrices);
        return dto;
    }

    private CartDetailResponse buildCartDetailResponse(CartDetail detail) {
        CartDetailResponse d = new CartDetailResponse();
        d.setCartDetailId(detail.getCartDetailId());
        d.setQuantity(detail.getQuantity());
        d.setPrice(detail.getPrice());

        Product p = detail.getProduct();
        if (p != null) {
            ProductResponse pdto = productService.convertToProductResponse(p);
            Combo combo = detail.getCombo();
            if (combo != null) {
                pdto.setProductName(combo.getComboDescription() != null && !combo.getComboDescription().isEmpty()
                        ? combo.getComboDescription()
                        : "Combo " + detail.getQuantity() + " " + pdto.getProductName());
            }

            d.setProduct(pdto);
        }

        return d;
    }
}
