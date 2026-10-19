package com.hieuvolaptrinh.Heatly_Store.Service;

import com.hieuvolaptrinh.Heatly_Store.Model.*;
import com.hieuvolaptrinh.Heatly_Store.Repository.*;
import com.hieuvolaptrinh.Heatly_Store.Response.CommentResponse;
import com.hieuvolaptrinh.Heatly_Store.Util.Enum.OrderStatusEnum;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentService {

        private final CommentRepository commentRepo;
        private final UserRepository userRepo;
        private final ProductRepository productRepo;
        private final OrderDetailRepository orderDetailRepo;
        private final OrderRepository orderRepository;

        public CommentService(CommentRepository commentRepo,
                        UserRepository userRepo,
                        ProductRepository productRepo,
                        OrderDetailRepository orderDetailRepo,
                        OrderRepository orderRepository) {
                this.commentRepo = commentRepo;
                this.userRepo = userRepo;
                this.productRepo = productRepo;
                this.orderDetailRepo = orderDetailRepo;
                this.orderRepository = orderRepository;
        }

        /** 1. Tạo comment mới - Xác thực người dùng từ UserDetails, tự động kiểm tra đã mua hàng (DELIVERED) */
        @Transactional(rollbackFor = Exception.class)
        public List<CommentResponse> createComment(UserDetails userDetails, int productId, Integer orderDetailId,
                        String content, Integer rating) {
                int userId = Integer.parseInt(userDetails.getUsername());
                User u = userRepo.findById(userId)
                                .orElseThrow(() -> new ResponseStatusException(
                                                HttpStatus.NOT_FOUND, "User không tồn tại: " + userId));

                Product p = productRepo.findById(productId)
                                .orElseThrow(() -> new ResponseStatusException(
                                                HttpStatus.NOT_FOUND, "Product không tồn tại: " + productId));

                OrderDetail matchedOd = null;

                // Nếu client truyền orderDetailId, kiểm tra tính hợp lệ và quyền sở hữu
                if (orderDetailId != null && orderDetailId > 0) {
                        OrderDetail od = orderDetailRepo.findById(orderDetailId)
                                        .orElseThrow(() -> new ResponseStatusException(
                                                        HttpStatus.NOT_FOUND,
                                                        "Không tìm thấy chi tiết đơn hàng: " + orderDetailId));

                        Order order = od.getOrder();
                        if (order == null || order.getUser() == null || order.getUser().getUserId() != userId) {
                                throw new ResponseStatusException(
                                                HttpStatus.FORBIDDEN,
                                                "Bạn chỉ có thể đánh giá sản phẩm trong đơn hàng của chính mình.");
                        }

                        if (order.getStatus() != OrderStatusEnum.DELIVERED) {
                                throw new ResponseStatusException(
                                                HttpStatus.BAD_REQUEST,
                                                "Chỉ được gắn đánh giá cho đơn hàng đã được giao thành công.");
                        }
                        matchedOd = od;
                } else {
                        // Tự động kiểm tra xem user này đã từng mua và nhận hàng thành công (DELIVERED) sản phẩm này chưa
                        List<OrderDetail> deliveredDetails = orderDetailRepo.findDeliveredOrderDetails(
                                        userId, productId, OrderStatusEnum.DELIVERED);
                        if (deliveredDetails != null && !deliveredDetails.isEmpty()) {
                                matchedOd = deliveredDetails.get(0);
                        }
                }

                Comment c = new Comment();
                c.setUser(u);
                c.setProduct(p);
                c.setOrderDetail(matchedOd);
                c.setContent(content);
                c.setRating(rating != null ? rating : 5);
                c.setCreatedAt(LocalDateTime.now());
                c.setUpdatedAt(LocalDateTime.now());

                commentRepo.save(c);
                return commentRepo.findByProduct_ProductId(productId)
                                .stream()
                                .map(this::toDto)
                                .collect(Collectors.toList());
        }

        /** 2. Lấy comment theo id */
        @Transactional(readOnly = true)
        public CommentResponse getComment(int commentId) {
                Comment c = commentRepo.findById(commentId)
                                .orElseThrow(() -> new ResponseStatusException(
                                                HttpStatus.NOT_FOUND, "Comment không tồn tại: " + commentId));
                return toDto(c);
        }

        /** 3. Cập nhật nội dung / rating của comment - Kiểm tra quyền sở hữu IDOR */
        @Transactional(rollbackFor = Exception.class)
        public List<CommentResponse> updateComment(UserDetails userDetails, int commentId, String newContent, Integer newRating) {
                Comment c = commentRepo.findById(commentId)
                                .orElseThrow(() -> new ResponseStatusException(
                                                HttpStatus.NOT_FOUND, "Comment không tồn tại: " + commentId));

                int currentUserId = Integer.parseInt(userDetails.getUsername());
                boolean isAdmin = userDetails.getAuthorities().stream()
                                .anyMatch(a -> a.getAuthority().equals("ADMIN") || a.getAuthority().equals("ROLE_ADMIN"));

                if (c.getUser().getUserId() != currentUserId && !isAdmin) {
                        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Bạn không có quyền chỉnh sửa bình luận này");
                }

                if (newContent != null && !newContent.isEmpty()) {
                        c.setContent(newContent);
                }

                if (newRating != null) {
                        c.setRating(newRating);
                }
                c.setUpdatedAt(LocalDateTime.now());
                int productId = c.getProduct().getProductId();
                commentRepo.save(c);
                return commentRepo.findByProduct_ProductId(productId)
                                .stream()
                                .map(this::toDto)
                                .collect(Collectors.toList());
        }

        /** 4. Xóa comment - Kiểm tra quyền sở hữu IDOR */
        @Transactional(rollbackFor = Exception.class)
        public List<CommentResponse> deleteComment(UserDetails userDetails, int commentId) {
                Comment c = commentRepo.findById(commentId)
                                .orElseThrow(() -> new ResponseStatusException(
                                                HttpStatus.NOT_FOUND, "Comment không tồn tại: " + commentId));

                int currentUserId = Integer.parseInt(userDetails.getUsername());
                boolean isAdmin = userDetails.getAuthorities().stream()
                                .anyMatch(a -> a.getAuthority().equals("ADMIN") || a.getAuthority().equals("ROLE_ADMIN"));

                if (c.getUser().getUserId() != currentUserId && !isAdmin) {
                        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Bạn không có quyền xóa bình luận này");
                }

                int productId = c.getProduct().getProductId();
                commentRepo.delete(c);
                return commentRepo.findByProduct_ProductId(productId)
                                .stream()
                                .map(this::toDto)
                                .collect(Collectors.toList());
        }

        /** 5. Lấy tất cả comment của 1 user */
        @Transactional(readOnly = true)
        public List<CommentResponse> getByUser(int userId) {
                return commentRepo.findByUser_UserId(userId).stream()
                                .map(this::toDto)
                                .collect(Collectors.toList());
        }

        /** 6. Lấy tất cả comment của 1 product */
        @Transactional(readOnly = true)
        public List<CommentResponse> getByProduct(int productId) {
                return commentRepo.findByProduct_ProductId(productId)
                                .stream()
                                .map(this::toDto)
                                .collect(Collectors.toList());
        }

        private CommentResponse toDto(Comment c) {
                CommentResponse dto = new CommentResponse();
                dto.setCommentId(c.getCommentId());
                if (c.getUser() != null) {
                        dto.setUserId(c.getUser().getUserId());
                        String name = c.getUser().getFullName();
                        dto.setUserName(name != null && !name.isBlank() ? name : c.getUser().getPhoneNumber());
                }
                if (c.getProduct() != null) {
                        dto.setProductId(c.getProduct().getProductId());
                        dto.setProductName(c.getProduct().getProductName());
                }
                if (c.getOrderDetail() != null) {
                        dto.setOrderDetailId(c.getOrderDetail().getOrderDetailId());
                        dto.setPurchased(true);
                } else {
                        dto.setOrderDetailId(0);
                        dto.setPurchased(false);
                }
                dto.setContent(c.getContent());
                dto.setRating(c.getRating());
                dto.setCreatedAt(c.getCreatedAt());
                dto.setUpdatedAt(c.getUpdatedAt());
                return dto;
        }
}