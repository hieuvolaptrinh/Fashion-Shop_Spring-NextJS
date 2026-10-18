package com.hieuvolaptrinh.Heatly_Store.Service;

import com.hieuvolaptrinh.Heatly_Store.Model.*;
import com.hieuvolaptrinh.Heatly_Store.Repository.*;
import com.hieuvolaptrinh.Heatly_Store.Request.OrderRequest;
import com.hieuvolaptrinh.Heatly_Store.Request.Filter.OrderFilterRequest;
import com.hieuvolaptrinh.Heatly_Store.Response.*;
import com.hieuvolaptrinh.Heatly_Store.Service.Sepcification.OrderSpecification;
import com.hieuvolaptrinh.Heatly_Store.Util.Enum.OrderStatusEnum;

import org.springframework.transaction.annotation.Transactional;
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
import java.util.Optional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class OrderService {
    public static final double FREE_SHIPPING_THRESHOLD = 500_000.0;
    public static final double STANDARD_SHIPPING_FEE = 30_000.0;

    private final OrderRepository orderRepo;
    private final UserRepository userRepo;
    private final CartDetailRepository cartDetailRepo;
    private final ProductRepository productRepo;
    private final ProductService productService;

    public OrderService(OrderRepository orderRepo,
                        UserRepository userRepo,
                        CartDetailRepository cartDetailRepo,
                        ProductRepository productRepo,
                        ProductService productService) {
        this.orderRepo = orderRepo;
        this.userRepo = userRepo;
        this.cartDetailRepo = cartDetailRepo;
        this.productRepo = productRepo;
        this.productService = productService;
    }

    public OrderResponse createOrder(UserDetails userDetails, OrderRequest orderRequest) {

        int userId = Integer.parseInt(userDetails.getUsername());
        User user = userRepo.findByUserId(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found: " + userId));

        if (user.getPhoneNumber() == null || user.getPhoneNumber().trim().isEmpty()) {
            String inputPhone = orderRequest.getPhoneNumber();
            if (inputPhone != null && !inputPhone.trim().isEmpty()) {
                String trimmedPhone = inputPhone.trim();
                Optional<User> existingUserWithPhone = userRepo.findByPhoneNumber(trimmedPhone);
                if (existingUserWithPhone.isEmpty()) {
                    user.setPhoneNumber(trimmedPhone);
                    userRepo.save(user);
                }
            }
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

        double subtotal = selectedCartDetails.stream()
                .mapToDouble(cd -> cd.getPrice() * cd.getQuantity())
                .sum();

        double shippingFee = (subtotal > FREE_SHIPPING_THRESHOLD || subtotal == 0) ? 0 : STANDARD_SHIPPING_FEE;
        double totalPrice = subtotal + shippingFee;

        Order order = new Order();
        order.setUser(user);
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

        List<Product> productsToUpdate = new ArrayList<>();
        for (CartDetail cartDetail : selectedCartDetails) {
            Product product = cartDetail.getProduct();
            if (cartDetail.getCombo() != null) {
                Combo combo = cartDetail.getCombo();
                product.setQuantity(product.getQuantity() - combo.getQuantityInCombo() * cartDetail.getQuantity());
            } else {
                product.setQuantity(product.getQuantity() - cartDetail.getQuantity());
            }
            productsToUpdate.add(product);
        }
        productRepo.saveAll(productsToUpdate);

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

    public void cancelOrder(UserDetails userDetails, int orderId) {
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy đơn hàng: " + orderId));

        // Kiểm tra quyền sở hữu đơn hàng (Ngăn chặn lỗ hổng BOLA/IDOR)
        boolean isAdmin = false;
        if (userDetails != null) {
            int currentUserId = Integer.parseInt(userDetails.getUsername());
            isAdmin = userDetails.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ADMIN"));
            if (!isAdmin && order.getUser().getUserId() != currentUserId) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Bạn không có quyền thao tác trên đơn hàng này!");
            }
        }

        // Khách hàng thông thường chỉ được phép tự hủy đơn khi trạng thái là PENDING
        if (!isAdmin && order.getStatus() != OrderStatusEnum.PENDING) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Bạn chỉ có thể tự hủy đơn hàng khi đơn còn ở trạng thái Chờ xử lý (PENDING). Đơn hàng hiện tại đang " +
                    (order.getStatus() != null ? order.getStatus().getLabel() : order.getStatus()) +
                    ", vui lòng liên hệ hotline cửa hàng để được hỗ trợ!");
        }

        doCancelOrder(order);
    }

    public void cancelOrder(int orderId) {
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy đơn hàng: " + orderId));
        doCancelOrder(order);
    }

    private void doCancelOrder(Order order) {
        if (order.getStatus() == OrderStatusEnum.DELIVERED || order.getStatus() == OrderStatusEnum.CANCELLED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Không thể hủy đơn hàng có trạng thái: " + (order.getStatus() != null ? order.getStatus().getLabel() : "DELIVERED/CANCELLED"));
        }

        for (OrderDetail orderDetail : order.getOrderDetails()) {
            Product product = orderDetail.getProduct();
            int restoredQuantity = orderDetail.getQuantity();

            if (orderDetail.getCombo() != null) {
                restoredQuantity = orderDetail.getCombo().getQuantityInCombo() * orderDetail.getQuantity();
            }

            product.setQuantity(product.getQuantity() + restoredQuantity);
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

    /**
     * Cập nhật trạng thái hàng loạt đơn hàng (dành cho admin)
     */
    @Transactional(rollbackFor = Exception.class)
    public String updateBatchOrderStatus(List<Integer> orderIds, String status) {
        if (orderIds == null || orderIds.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Danh sách mã đơn hàng không được để trống");
        }

        try {
            OrderStatusEnum newStatus = OrderStatusEnum.valueOf(status.toUpperCase());
            List<Order> orders = orderRepo.findAllById(orderIds);
            if (orders.isEmpty()) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy đơn hàng nào phù hợp");
            }

            for (Order order : orders) {
                order.setStatus(newStatus);
            }
            orderRepo.saveAll(orders);
            return "Cập nhật thành công trạng thái " + newStatus.getLabel() + " cho " + orders.size() + " đơn hàng";
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Trạng thái không hợp lệ: " + status);
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
