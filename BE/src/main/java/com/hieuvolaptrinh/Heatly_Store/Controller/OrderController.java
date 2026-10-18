// src/main/java/com/hieuvolaptrinh/Heatly_Store/Controller/OrderController.java
package com.hieuvolaptrinh.Heatly_Store.Controller;

import com.hieuvolaptrinh.Heatly_Store.Request.*;
import com.hieuvolaptrinh.Heatly_Store.Request.Filter.OrderFilterRequest;
import com.hieuvolaptrinh.Heatly_Store.Response.*;
import com.hieuvolaptrinh.Heatly_Store.Service.OrderService;
import com.hieuvolaptrinh.Heatly_Store.Util.ApiMessage;
import com.hieuvolaptrinh.Heatly_Store.Util.Enum.OrderStatusEnum;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/orders")
public class OrderController {
    private final OrderService orderService;

    public OrderController(OrderService svc) {
        this.orderService = svc;
    }

    // Khách hàng đặt hàng
    @PostMapping
    @ApiMessage("Create order successfully")
    public ResponseEntity<OrderResponse> createOrder(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody OrderRequest req) {
        OrderResponse dto = orderService.createOrder(userDetails, req);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(dto);
    }

    // 5. Lấy danh sách đơn hàng theo người dùng
    @GetMapping()
    @ApiMessage("Get all orders by user successfully")
    public ResponseEntity<List<OrderResponse>> getAllOrdersByUser(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(orderService.getAllOrdersByUser(userDetails));
    }

    // Hủy đơn hàng (Kiểm tra quyền sở hữu hoặc quyền Admin)
    @PostMapping(value = {"/{orderId}", "/{orderId}/cancel"})
    @ApiMessage("Cancel order successfully")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void cancelOrder(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable int orderId) {
        orderService.cancelOrder(userDetails, orderId);
    }

    // cập nhật trạng thái đơn hàng
    @PutMapping("/admin")
    @ApiMessage("Confirm order status successfully")
    public ResponseEntity<String> confirmOrder(
            @RequestParam(name = "orderId") int orderId,
            @RequestParam(name = "status") String statusParam) {
        String message = orderService.updateOrderStatus(orderId, statusParam);
        return ResponseEntity.status(HttpStatus.OK).body(message);
    }

    // Cập nhật trạng thái hàng loạt đơn hàng
    @PutMapping("/admin/batch-status")
    @ApiMessage("Update batch order status successfully")
    public ResponseEntity<String> updateBatchOrderStatus(
            @RequestBody List<Integer> orderIds,
            @RequestParam(name = "status") String statusParam) {
        String message = orderService.updateBatchOrderStatus(orderIds, statusParam);
        return ResponseEntity.status(HttpStatus.OK).body(message);
    }

    /*
     * e có code phân trang với lọc theo khoảng tổng tiền, trạng thái đơn hàng, =>
     * cái này là lấy tất cả đơn hàng cho admin
     * userId, isPay
     * hoặc truyền về page, size, status, userId, isPay, minTotalPrice,
     * maxTotalPrice
     * Ví dụ: để lọc theo 7 điều kiện tùy truyền theo query path
     * /api/v1/orders/admin?page=0&size=10&status=CANCELLED
     * /api/v1/orders/admin?page=0&size=10&minTotalPrice=100&maxTotalPrice=500
     * /api/v1/orders/admin/filter?status=CANCELLED
     * /api/v1/orders/admin/filter?status=PENDING
     * /api/v1/orders/admin/filter?status=SHIPPING
     * /api/v1/orders/admin/filter?status=DELIVERED
     */
    @GetMapping("admin/filter")
    @ApiMessage("Get all orders with filter successfully")
    public ResponseEntity<PageResponse<OrderResponse>> getAllOrders(
            @RequestParam(name = "page", required = false, defaultValue = "0") int page,
            @RequestParam(name = "size", required = false, defaultValue = "10") int size,
            @RequestParam(name = "status", required = false) List<OrderStatusEnum> status,
            @RequestParam(name = "userId", required = false) Integer userId,
            @RequestParam(name = "isPay", required = false) Boolean isPay,
            @RequestParam(name = "isBill", required = false) Boolean isBill,
            @RequestParam(name = "minTotalPrice", required = false) Double minTotalPrice,
            @RequestParam(name = "maxTotalPrice", required = false) Double maxTotalPrice) {

        // Tạo OrderFilterRequest từ request parameters
        OrderFilterRequest filter = new OrderFilterRequest();
        filter.setStatus(status);
        filter.setUserId(userId);
        filter.setIsPay(isPay);
        filter.setIsBill(isBill);
        filter.setMinTotalPrice(minTotalPrice);
        filter.setMaxTotalPrice(maxTotalPrice);

        PageResponse<OrderResponse> response = orderService.getAllOrders(page, size, filter);
        return ResponseEntity.ok(response);
    }

}
