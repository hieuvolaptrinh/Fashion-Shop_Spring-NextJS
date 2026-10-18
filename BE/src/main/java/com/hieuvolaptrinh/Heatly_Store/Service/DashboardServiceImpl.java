package com.hieuvolaptrinh.Heatly_Store.Service;

import com.hieuvolaptrinh.Heatly_Store.Model.Order;
import com.hieuvolaptrinh.Heatly_Store.Repository.OrderRepository;
import com.hieuvolaptrinh.Heatly_Store.Repository.ProductRepository;
import com.hieuvolaptrinh.Heatly_Store.Repository.UserRepository;
import com.hieuvolaptrinh.Heatly_Store.Response.Dashboard.DashboardOrderItemResponse;
import com.hieuvolaptrinh.Heatly_Store.Response.Dashboard.DashboardSummaryResponse;
import com.hieuvolaptrinh.Heatly_Store.Response.Dashboard.OrderStatusStatResponse;
import com.hieuvolaptrinh.Heatly_Store.Response.Dashboard.RevenueStatResponse;
import com.hieuvolaptrinh.Heatly_Store.Util.Enum.OrderStatusEnum;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Date;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class DashboardServiceImpl implements DashboardService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public DashboardServiceImpl(
            OrderRepository orderRepository,
            ProductRepository productRepository,
            UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @Override
    public DashboardSummaryResponse getDashboardSummary(int months) {
        if (months <= 0) {
            months = 6;
        }

        // 1. KPI Counts
        int totalOrders = (int) orderRepository.count();
        long totalProducts = productRepository.count();
        long totalCustomers = userRepository.count();

        LocalDate today = LocalDate.now();
        int ordersToday = (int) orderRepository.countOrdersCreatedToday(Date.valueOf(today));

        // 2. Tình trạng đơn hàng (Order status distribution)
        int pendingCount = (int) orderRepository.countByStatus(OrderStatusEnum.PENDING);
        int shippingCount = (int) orderRepository.countByStatus(OrderStatusEnum.SHIPPING);
        int deliveredCount = (int) orderRepository.countByStatus(OrderStatusEnum.DELIVERED);
        int cancelledCount = (int) orderRepository.countByStatus(OrderStatusEnum.CANCELLED);

        List<OrderStatusStatResponse> orderStatusData = List.of(
                new OrderStatusStatResponse("Chờ duyệt", pendingCount, "#f59e0b"),
                new OrderStatusStatResponse("Đang giao", shippingCount, "#0284c7"),
                new OrderStatusStatResponse("Đã giao", deliveredCount, "#10b981"),
                new OrderStatusStatResponse("Đã hủy", cancelledCount, "#ef4444")
        );

        // 3. Doanh thu hợp lệ toàn thời gian (Tính trực tiếp trên Database qua hàm aggregate, không kéo Entity vào heap)
        double totalRevenue = orderRepository.sumTotalPriceExcludingStatus(OrderStatusEnum.CANCELLED);

        // 4. Biến động doanh thu theo tháng (Rolling N months)
        // Chỉ tải các đơn hàng trong phạm vi N tháng gần nhất phục vụ biểu đồ và so sánh tăng trưởng
        int monthsToFetch = Math.max(months - 1, 1);
        LocalDate earliestDate = today.minusMonths(monthsToFetch).withDayOfMonth(1);
        List<Order> recentValidOrders = orderRepository.findOrdersFromDateExcludingStatus(Date.valueOf(earliestDate), OrderStatusEnum.CANCELLED);

        LocalDate startMonthDate = today.minusMonths(months - 1).withDayOfMonth(1);
        List<YearMonth> targetMonths = new ArrayList<>();
        YearMonth currentYm = YearMonth.from(startMonthDate);
        YearMonth endYm = YearMonth.from(today);
        while (!currentYm.isAfter(endYm)) {
            targetMonths.add(currentYm);
            currentYm = currentYm.plusMonths(1);
        }

        // Gom nhóm đơn hàng theo YearMonth
        Map<YearMonth, List<Order>> ordersByMonth = recentValidOrders.stream()
                .filter(o -> o.getCreateAt() != null)
                .collect(Collectors.groupingBy(o -> {
                    LocalDate orderDate = new java.sql.Date(o.getCreateAt().getTime()).toLocalDate();
                    return YearMonth.from(orderDate);
                }));

        List<RevenueStatResponse> revenueData = new ArrayList<>();
        for (YearMonth ym : targetMonths) {
            List<Order> monthOrders = ordersByMonth.getOrDefault(ym, Collections.emptyList());
            double monthRevenue = monthOrders.stream().mapToDouble(Order::getTotalPrice).sum();
            revenueData.add(new RevenueStatResponse(
                    "Tháng " + ym.getMonthValue(),
                    monthRevenue,
                    monthOrders.size()
            ));
        }

        // 5. Tỷ lệ tăng trưởng doanh thu so với tháng trước (%)
        YearMonth currentMonth = YearMonth.from(today);
        YearMonth prevMonth = currentMonth.minusMonths(1);

        double revThisMonth = ordersByMonth.getOrDefault(currentMonth, Collections.emptyList())
                .stream().mapToDouble(Order::getTotalPrice).sum();
        double revLastMonth = ordersByMonth.getOrDefault(prevMonth, Collections.emptyList())
                .stream().mapToDouble(Order::getTotalPrice).sum();

        Double revenueGrowth = null;
        if (revLastMonth > 0) {
            revenueGrowth = Math.round(((revThisMonth - revLastMonth) / revLastMonth) * 1000.0) / 10.0;
        }

        // 6. 5 đơn hàng gần đây nhất
        List<Order> top5Orders = orderRepository.findTop5ByOrderByOrderIdDesc();
        List<DashboardOrderItemResponse> recentOrders = top5Orders.stream().map(o -> {
            String customerName = "Khách hàng";
            if (o.getUser() != null && o.getUser().getFullName() != null && !o.getUser().getFullName().isBlank()) {
                customerName = o.getUser().getFullName();
            }
            return new DashboardOrderItemResponse(
                    o.getOrderId(),
                    o.getTotalPrice(),
                    o.getStatus() != null ? o.getStatus().name() : OrderStatusEnum.PENDING.name(),
                    customerName,
                    o.getPhoneNumber(),
                    o.getCreateAt()
            );
        }).collect(Collectors.toList());

        return new DashboardSummaryResponse(
                totalRevenue,
                totalOrders,
                totalProducts,
                totalCustomers,
                revenueGrowth,
                ordersToday,
                revenueData,
                orderStatusData,
                recentOrders
        );
    }
}
