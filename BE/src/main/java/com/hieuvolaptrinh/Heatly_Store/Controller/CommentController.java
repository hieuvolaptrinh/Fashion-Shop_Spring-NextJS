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
            @Valid @RequestBody CreateCommentRequest req) {
        List<CommentResponse> comments = svc.createComment(
                req.getUserId(),
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
    public CommentResponse get(@PathVariable int id) {
        return svc.getComment(id);
    }

    // cập nhật bình luận
    @PutMapping()
    @ApiMessage("Update comment successfully")
    public ResponseEntity<List<CommentResponse>> update(
            @Valid @RequestBody UpdateCommentRequest req) {
        if (req.getContent() == null && req.getRating() == null) {
            return ResponseEntity
                    .badRequest()
                    .build();
        }

        List<CommentResponse> updatedComments = svc.updateComment(req.getCommentId(), req.getContent(),
                req.getRating());

        return ResponseEntity
                .ok(updatedComments);
    }

    // xóa bình luận
    @DeleteMapping("/{id}")
    @ApiMessage("Delete comment successfully")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public ResponseEntity<List<CommentResponse>> delete(@PathVariable int id) {
        List<CommentResponse> allOfProduct = svc.deleteComment(id);
        return ResponseEntity
                .status(HttpStatus.NO_CONTENT)
                .body(allOfProduct);
    }

    // lấy tất cả bình luận của id người dùng
    @GetMapping("/by-user")
    public List<CommentResponse> byUser(@AuthenticationPrincipal UserDetails userDetails) {
        int userId = userDetails.getUsername() != null ? Integer.parseInt(userDetails.getUsername()) : 0;
        return svc.getByUser(userId);
    }

    // lấy tất cả bình luận của sản phầm
    @GetMapping("/by-product/{productId}")
    public List<CommentResponse> byProduct(@PathVariable int productId) {
        return svc.getByProduct(productId);
    }
}
