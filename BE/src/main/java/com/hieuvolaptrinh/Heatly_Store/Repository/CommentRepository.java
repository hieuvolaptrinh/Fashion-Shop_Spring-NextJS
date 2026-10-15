package com.hieuvolaptrinh.Heatly_Store.Repository;

import com.hieuvolaptrinh.Heatly_Store.Model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Integer> {
    List<Comment> findByUser_UserId(int userId);

    List<Comment> findByProduct_ProductId(int productId);

    List<Comment> findByOrderDetail_OrderDetailId(int orderDetailId);
}
