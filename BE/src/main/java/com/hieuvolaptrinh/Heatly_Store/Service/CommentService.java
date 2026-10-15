package com.hieuvolaptrinh.Heatly_Store.Service;

import com.hieuvolaptrinh.Heatly_Store.Model.*;
import com.hieuvolaptrinh.Heatly_Store.Repository.*;
import com.hieuvolaptrinh.Heatly_Store.Response.CommentResponse;
import com.hieuvolaptrinh.Heatly_Store.Util.Enum.OrderStatusEnum;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
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

        /** 1. Tạo comment mới */
        public List<CommentResponse> createComment(int userId, int productId, int orderDetailId,
                        String content, Integer rating) {
                User u = userRepo.findById(userId)
                                .orElseThrow(() -> new ResponseStatusException(
                                                HttpStatus.NOT_FOUND, "User không tồn tại: " + userId));

                Product p = productRepo.findById(productId)
                                .orElseThrow(() -> new ResponseStatusException(
                                                HttpStatus.NOT_FOUND, "Product không tồn tại: " + productId));

                OrderDetail od = orderDetailRepo.findById(orderDetailId)
                                .orElseThrow(() -> new ResponseStatusException(
                                                HttpStatus.NOT_FOUND,
                                                "Bạn chỉ có thể bình luận cho sản phẩm đã mua trong đơn hàng của mình, không tồn tại đơn hàng: "
                                                                + orderDetailId));

                Order order = orderRepository.findById(od.getOrder().getOrderId())
                                .orElseThrow(() -> new ResponseStatusException(
                                                HttpStatus.NOT_FOUND,
                                                "Không tìm thấy đơn hàng theo"));

                if (order.getStatus() != OrderStatusEnum.DELIVERED) {
                        throw new ResponseStatusException(
                                        HttpStatus.BAD_REQUEST,
                                        "Chỉ được bình luận khi đơn hàng đã được giao hoặc hoàn thành.");
                }

                Comment c = new Comment();
                c.setUser(u);
                c.setProduct(p);
                c.setOrderDetail(od);
                c.setContent(content);
                c.setRating(rating);
                c.setCreatedAt(LocalDateTime.now());
                c.setUpdatedAt(LocalDateTime.now());

                commentRepo.save(c);
                return commentRepo.findByProduct_ProductId(productId)
                                .stream()
                                .map(this::toDto)
                                .collect(Collectors.toList());
        }

        /** 2. Lấy comment theo id */
        public CommentResponse getComment(int commentId) {
                Comment c = commentRepo.findById(commentId)
                                .orElseThrow(() -> new ResponseStatusException(
                                                HttpStatus.NOT_FOUND, "Comment không tồn tại: " + commentId));
                return toDto(c);
        }

        /** 3. Cập nhật nội dung / rating của comment */
        public List<CommentResponse> updateComment(int commentId, String newContent, Integer newRating) {
                Comment c = commentRepo.findById(commentId)
                                .orElseThrow(() -> new ResponseStatusException(
                                                HttpStatus.NOT_FOUND, "Comment không tồn tại: " + commentId));
                if (!newContent.isEmpty()) {
                        c.setContent(newContent);
                }

                if (newRating == null) {
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

        /** 4. Xóa comment */
        public List<CommentResponse> deleteComment(int commentId) {
                Comment c = commentRepo.findById(commentId)
                                .orElseThrow(() -> new ResponseStatusException(
                                                HttpStatus.NOT_FOUND, "Comment không tồn tại: " + commentId));
                int productId = c.getProduct().getProductId();
                if (!commentRepo.existsById(commentId)) {
                        throw new ResponseStatusException(
                                        HttpStatus.NOT_FOUND, "Comment không tồn tại: " + commentId);
                }
                commentRepo.deleteById(commentId);
                return commentRepo.findByProduct_ProductId(productId)
                                .stream()
                                .map(this::toDto)
                                .collect(Collectors.toList());
        }

        /** 5. Lấy tất cả comment của 1 user */
        public List<CommentResponse> getByUser(int userId) {
                return commentRepo.findByUser_UserId(userId).stream()
                                .map(this::toDto)
                                .collect(Collectors.toList());
        }

        /** 6. Lấy tất cả comment của 1 product */
        public List<CommentResponse> getByProduct(int productId) {
                return commentRepo.findByProduct_ProductId(productId)
                                .stream()
                                .map(this::toDto)
                                .collect(Collectors.toList());
        }

        private CommentResponse toDto(Comment c) {
                CommentResponse dto = new CommentResponse();
                dto.setCommentId(c.getCommentId());
                dto.setUserId(c.getUser().getUserId());
                dto.setUserName(c.getUser().getFullName());
                dto.setProductId(c.getProduct().getProductId());
                dto.setProductName(c.getProduct().getProductName());
                dto.setOrderDetailId(c.getOrderDetail().getOrderDetailId());
                dto.setContent(c.getContent());
                dto.setRating(c.getRating());
                dto.setCreatedAt(c.getCreatedAt());
                dto.setUpdatedAt(c.getUpdatedAt());
                return dto;
        }

}