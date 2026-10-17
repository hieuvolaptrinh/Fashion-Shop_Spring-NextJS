package com.hieuvolaptrinh.Heatly_Store.Controller;

import com.hieuvolaptrinh.Heatly_Store.Request.CreateCommentRequest;
import com.hieuvolaptrinh.Heatly_Store.Request.UpdateCommentRequest;
import com.hieuvolaptrinh.Heatly_Store.Response.CommentResponse;
import com.hieuvolaptrinh.Heatly_Store.Service.CommentService;
import com.hieuvolaptrinh.Heatly_Store.Service.UserService;
import com.hieuvolaptrinh.Heatly_Store.Util.ApiMessage;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/comments")
public class CommentController {
    private final CommentService svc;
    // private final UserService userService;

    public CommentController(CommentService svc) {
        this.svc = svc;
    }

    // tạo bình luận
    @PostMapping
    @ApiMessage("Create a new comment successfully")
    public ResponseEntity<List<CommentResponse>> create(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CreateCommentRequest req) {
        List<CommentResponse> comments = svc.createComment(
                userDetails,
                req.getProductId(),
                req.getOrderDetailId(),
                req.getContent(),
                req.getRating());
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(comments);
    }

    // lấy bình luận theo id bình luận
    @GetMapping("/{id}")
    @ApiMessage("Get comment by ID successfully")
    public ResponseEntity<CommentResponse> get(@PathVariable int id) {
        return ResponseEntity.ok(svc.getComment(id));
    }

    // cập nhật bình luận
    @PutMapping()
    @ApiMessage("Update comment successfully")
    public ResponseEntity<List<CommentResponse>> update(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody UpdateCommentRequest req) {
        if (req.getContent() == null && req.getRating() == null) {
            return ResponseEntity
                    .badRequest()
                    .build();
        }

        List<CommentResponse> updatedComments = svc.updateComment(
                userDetails,
                req.getCommentId(),
                req.getContent(),
                req.getRating());

        return ResponseEntity
                .ok(updatedComments);
    }

    // xóa bình luận
    @DeleteMapping("/{id}")
    @ApiMessage("Delete comment successfully")
    public ResponseEntity<List<CommentResponse>> delete(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable int id) {
        List<CommentResponse> allOfProduct = svc.deleteComment(userDetails, id);
        return ResponseEntity.ok(allOfProduct);
    }

    // lấy tất cả bình luận của id người dùng
    @GetMapping("/by-user")
    @ApiMessage("Get comments by user successfully")
    public ResponseEntity<List<CommentResponse>> byUser(@AuthenticationPrincipal UserDetails userDetails) {
        int userId = userDetails.getUsername() != null ? Integer.parseInt(userDetails.getUsername()) : 0;
        return ResponseEntity.ok(svc.getByUser(userId));
    }

    // lấy tất cả bình luận của sản phẩm
    @GetMapping("/by-product/{productId}")
    @ApiMessage("Get comments by product successfully")
    public ResponseEntity<List<CommentResponse>> byProduct(@PathVariable int productId) {
        return ResponseEntity.ok(svc.getByProduct(productId));
    }
}
