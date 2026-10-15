package com.hieuvolaptrinh.Heatly_Store.Repository;

import com.hieuvolaptrinh.Heatly_Store.Model.OrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetail, Integer> {
    List<OrderDetail> findByOrderOrderId(int orderId);

}
