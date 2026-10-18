package com.hieuvolaptrinh.Heatly_Store.Repository;

import com.hieuvolaptrinh.Heatly_Store.Model.Order;
import com.hieuvolaptrinh.Heatly_Store.Model.User;
import com.hieuvolaptrinh.Heatly_Store.Util.Enum.OrderStatusEnum;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer>, JpaSpecificationExecutor<Order> {

    /**
     * Tối ưu hóa triệt để N+1 Query: Sử dụng EntityGraph để nạp user, orderDetails, product, combo trong 1 truy vấn JOIN
     */
    @Override
    @EntityGraph(attributePaths = {"user", "orderDetails", "orderDetails.product", "orderDetails.combo"})
    Page<Order> findAll(Specification<Order> spec, Pageable pageable);

    List<Order> findByUserUserId(int userId);

    // Find orders by user ordered by creation date descending
    List<Order> findByUserOrderByCreateAtDesc(User user);

    List<Order> findByStatus(OrderStatusEnum status);

    long countByStatus(OrderStatusEnum status);

    List<Order> findTop5ByOrderByOrderIdDesc();

    /**
     * Chỉ lấy danh sách orderId trực tiếp từ database, chống việc kéo toàn bộ Entity về RAM
     */
    @Query("SELECT o.orderId FROM Order o")
    List<Integer> findAllOrderIds();

    @Query("SELECT o.orderId FROM Order o WHERE o.status = :status")
    List<Integer> findOrderIdsByStatus(@Param("status") OrderStatusEnum status);

    @Query("SELECT o.orderId FROM Order o WHERE o.isBill = false OR o.isBill IS NULL")
    List<Integer> findUnprintedOrderIds();

    @Query("SELECT o FROM Order o WHERE o.createAt >= :startDate AND o.status <> :excludedStatus")
    List<Order> findOrdersFromDateExcludingStatus(
            @Param("startDate") Date startDate,
            @Param("excludedStatus") OrderStatusEnum excludedStatus
    );

    @Query("SELECT COUNT(o) FROM Order o WHERE o.createAt = :today")
    long countOrdersCreatedToday(@Param("today") Date today);

    @Query("SELECT COALESCE(SUM(o.totalPrice), 0.0) FROM Order o WHERE o.status <> :excludedStatus")
    double sumTotalPriceExcludingStatus(@Param("excludedStatus") OrderStatusEnum excludedStatus);
}

