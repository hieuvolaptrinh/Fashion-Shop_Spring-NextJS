package com.hieuvolaptrinh.Heatly_Store.Repository;

import com.hieuvolaptrinh.Heatly_Store.Model.OrderDetail;
import com.hieuvolaptrinh.Heatly_Store.Util.Enum.OrderStatusEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetail, Integer> {
    List<OrderDetail> findByOrderOrderId(int orderId);

    @Query("SELECT od FROM OrderDetail od WHERE od.order.user.userId = :userId AND od.product.productId = :productId AND od.order.status = :status")
    List<OrderDetail> findDeliveredOrderDetails(
            @Param("userId") int userId,
            @Param("productId") int productId,
            @Param("status") OrderStatusEnum status);
}

