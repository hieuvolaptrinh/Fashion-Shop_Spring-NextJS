package com.hieuvolaptrinh.Heatly_Store.Repository;

import com.hieuvolaptrinh.Heatly_Store.Model.Order;
import com.hieuvolaptrinh.Heatly_Store.Model.User;
import com.hieuvolaptrinh.Heatly_Store.Util.Enum.OrderStatusEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer>, JpaSpecificationExecutor<Order> {
    List<Order> findByUserUserId(int userId);

    // Find orders by user ordered by creation date descending
    List<Order> findByUserOrderByCreateAtDesc(User user);

    List<Order> findByStatus(OrderStatusEnum status);
}
