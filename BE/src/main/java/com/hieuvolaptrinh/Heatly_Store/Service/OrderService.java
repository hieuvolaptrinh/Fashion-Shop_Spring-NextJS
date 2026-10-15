package com.hieuvolaptrinh.Heatly_Store.Service;

import com.hieuvolaptrinh.Heatly_Store.Model.*;
import com.hieuvolaptrinh.Heatly_Store.Repository.*;
import com.hieuvolaptrinh.Heatly_Store.Request.OrderRequest;
import com.hieuvolaptrinh.Heatly_Store.Request.Filter.OrderFilterRequest;
import com.hieuvolaptrinh.Heatly_Store.Response.*;
import com.hieuvolaptrinh.Heatly_Store.Service.Sepcification.OrderSpecification;
import com.hieuvolaptrinh.Heatly_Store.Util.Enum.OrderStatusEnum;

import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class OrderService {
    private final OrderRepository orderRepo;
    private final UserRepository userRepo;
    private final AddressRepository addressRepo;
    private final CartDetailRepository cartDetailRepo;
    private final ProductRepository productRepo;
    private final ProductService productService;

    public OrderService(OrderRepository orderRepo,
                        UserRepository userRepo,
                        AddressRepository addressRepo,
                        CartDetailRepository cartDetailRepo,
                        ProductRepository productRepo,
                        ProductService productService) {
        this.orderRepo = orderRepo;
        this.userRepo = userRepo;
        this.addressRepo = addressRepo;
        this.cartDetailRepo = cartDetailRepo;
        this.productRepo = productRepo;
        this.productService = productService;
    }

    public OrderResponse createOrder(UserDetails userDetails, OrderRequest orderRequest) {

        int userId = Integer.parseInt(userDetails.getUsername());
        User user = userRepo.findByUserId(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found: " + userId));

        if (user.getPhoneNumber() == null || user.getPhoneNumber().isEmpty()) {
            user.setPhoneNumber(orderRequest.getPhoneNumber());
            userRepo.save(user);
        }

        List<CartDetail> selectedCartDetails = cartDetailRepo.findByCartDetailIdIn(orderRequest.getSelectedIds());
        if (selectedCartDetails.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No cart items found for the selected IDs");
        }

        for (CartDetail cartDetail : selectedCartDetails) {
            Product product = cartDetail.getProduct();
            if (product.getQuantity() < cartDetail.getQuantity()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Insufficient stock for product: " + product.getProductName() +
                                ". Available: " + product.getQuantity() + ", Required: " + cartDetail.getQuantity());
            }

        }

        // dưới này e code là ko cần trigger
        double totalPrice = selectedCartDetails.stream()
                .mapToDouble(cd -> cd.getPrice() * cd.getQuantity())
                .sum() + 30000; // thêm phí ship cố định 30k

        Order order = new Order();
        order.setUser(user);
        // order.setShippingAddress(shippingAddress);
        order.setShippingAddress(orderRequest.getShippingAddress());

        order.setStatus(OrderStatusEnum.PENDING);
        order.setTotalPrice(totalPrice);
        order.setPhoneNumber(orderRequest.getPhoneNumber());
        order.setPay(false);
        List<OrderDetail> orderDetails = selectedCartDetails.stream().map(cd -> {
            OrderDetail od = new OrderDetail();
            od.setOrder(order);
            od.setProduct(cd.getProduct());
            od.setQuantity(cd.getQuantity());
            od.setPrice(cd.getPrice());
            od.setCombo(cd.getCombo());
            return od;
        }).collect(Collectors.toList());

        order.setOrderDetails(orderDetails);

        Order savedOrder = orderRepo.save(order);

        for (CartDetail cartDetail : selectedCartDetails) {
            Product product = cartDetail.getProduct();
            if(cartDetail.getCombo()!= null) {
                Combo combo = cartDetail.getCombo();
                product.setQuantity(product.getQuantity()- combo.getQuantityInCombo()* cartDetail.getQuantity());
            }else{
                product.setQuantity(product.getQuantity() - cartDetail.getQuantity());

            }
            productRepo.save(product);
        }

        cartDetailRepo.deleteAll(selectedCartDetails);

        return convertToOrderResponse(savedOrder);
    }

    public OrderResponse getOrder(UserDetails userDetails) {
        int userId = Integer.parseInt(userDetails.getUsername());
        User user = userRepo.findByUserId(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found: " + userId));

        List<Order> orders = orderRepo.findByUserOrderByCreateAtDesc(user);

        if (orders.isEmpty()) {
            OrderResponse response = new OrderResponse();
            response.setUserId(userId);
            response.setItems(new ArrayList<>());
            return response;
        }
        return convertToOrderResponse(orders.get(0));
    }

    public List<OrderResponse> getAllOrdersByUser(UserDetails userDetails) {
        int userId = Integer.parseInt(userDetails.getUsername());
        User user = userRepo.findByUserId(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found: " + userId));

        List<Order> orders = orderRepo.findByUserOrderByCreateAtDesc(user);

        return orders.stream()
                .map(this::convertToOrderResponse)
                .collect(Collectors.toList());
    }

    public void cancelOrder(int orderId) {
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found: " + orderId));

        if (order.getStatus() == OrderStatusEnum.DELIVERED || order.getStatus() == OrderStatusEnum.CANCELLED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Cannot cancel order with status: " + order.getStatus());
        }

        // tăng số lượng sản phẩm trong kho
        for (OrderDetail orderDetail : order.getOrderDetails()) {
            Product product = orderDetail.getProduct();
            product.setQuantity(product.getQuantity() + orderDetail.getQuantity());
            productRepo.save(product);
        }

        order.setStatus(OrderStatusEnum.CANCELLED);
        orderRepo.save(order);
    }

    /**
     * Cập nhật trạng thái đơn hàng (dành cho admin)
     */
    public String updateOrderStatus(int orderId, String status) {
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found: " + orderId));

        try {
            OrderStatusEnum newStatus = OrderStatusEnum.valueOf(status.toUpperCase());
            order.setStatus(newStatus);
            orderRepo.save(order);
            return "Order status updated successfully to: " + newStatus;
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid status: " + status);
        }
    }

    public PageResponse<OrderResponse> getAllOrders(int page, int size, OrderFilterRequest filter) {
        Sort sort = Sort.by(
                Sort.Order.desc("createAt"),
                Sort.Order.desc("orderId"));
        Pageable pageable = PageRequest.of(page, size, sort);
        Specification<Order> spec = OrderSpecification.filterOrders(filter);
        Page<Order> orderPage = orderRepo.findAll(spec, pageable);

        List<OrderResponse> responses = orderPage.getContent().stream()
                .map(this::convertToOrderResponse)
                .collect(Collectors.toList());

        return new PageResponse<>(
                responses,
                orderPage.getNumber(),
                orderPage.getTotalElements(),
                orderPage.getTotalPages());
    }

    private OrderResponse convertToOrderResponse(Order order) {
        OrderResponse response = new OrderResponse();
        response.setOrderId(order.getOrderId());
        response.setCreateAt(order.getCreateAt());
        response.setStatus(order.getStatus());
        response.setTotalPrice(order.getTotalPrice());
        response.setPay(order.isPay());
        response.setUserId(order.getUser().getUserId());
        response.setShippingAddress(order.getShippingAddress());
        response.setPhoneNumber(order.getPhoneNumber());
        response.setBill(order.isBill());
        // Convert OrderDetails với đầy đủ thông tin sản phẩm
        List<OrderDetailResponse> orderDetailResponses = order.getOrderDetails().stream()
                .map(this::convertToOrderDetailResponse)
                .collect(Collectors.toList());

        response.setItems(orderDetailResponses);
        return response;
    }

    private OrderDetailResponse convertToOrderDetailResponse(OrderDetail orderDetail) {
        OrderDetailResponse response = new OrderDetailResponse();
        response.setOrderDetailId(orderDetail.getOrderDetailId());
        response.setQuantity(orderDetail.getQuantity());
        response.setPrice(orderDetail.getPrice());


        Product p = orderDetail.getProduct();
        ProductResponse pdto = productService.convertToProductResponse(p);
        Combo combo = orderDetail.getCombo();
        if (combo != null) {
            pdto.setProductName(combo.getComboDescription() != null && !combo.getComboDescription().isEmpty()
                    ? combo.getComboDescription()
                    : "Combo " + orderDetail.getQuantity() + " " + pdto.getProductName());
        }

        response.setProduct(pdto);


        return response;
    }
}
