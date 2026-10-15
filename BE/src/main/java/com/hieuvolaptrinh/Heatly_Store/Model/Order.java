package com.hieuvolaptrinh.Heatly_Store.Model;

import com.hieuvolaptrinh.Heatly_Store.Util.Enum.OrderStatusEnum;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Date;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "orders")

public class Order {
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private int orderId;

    @CreationTimestamp
    private Date createAt;

    @Enumerated(EnumType.STRING)
    private OrderStatusEnum status;

    @Min(value = 0, message = "Tổng giá phải lớn hơn hoặc bằng 0")
    private double totalPrice;

    private boolean isPay = false;

    private boolean isBill = false;

    private LocalDateTime dateInBild;

    @ManyToOne(cascade = {
            jakarta.persistence.CascadeType.PERSIST,
            jakarta.persistence.CascadeType.MERGE,
            jakarta.persistence.CascadeType.DETACH,
            jakarta.persistence.CascadeType.REFRESH
    })
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // @ManyToOne(cascade = {
    // jakarta.persistence.CascadeType.PERSIST,
    // jakarta.persistence.CascadeType.MERGE,
    // jakarta.persistence.CascadeType.DETACH,
    // jakarta.persistence.CascadeType.REFRESH
    // })
    // @JoinColumn(name = "shipping_address_id", nullable = false)
    // private Address shippingAddress;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderDetail> orderDetails = new ArrayList<>();

    private String shippingAddress;

    @PrePersist
    public void beforePersist() {
        this.createAt = new Date(System.currentTimeMillis());
        if (status == null) {
            status = OrderStatusEnum.PENDING;
        }
    }


    @NotBlank(message = "Số điên thoại không được để trống")
    @Pattern(regexp = "^(\\+84|84|0)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-6|8|9]|9[0-9])[0-9]{7}$|^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$", message = "Email hoặc số điện thoại không đúng định dạng. Số điện thoại phải là số Việt Nam hợp lệ (10-11 số, bắt đầu bằng 0, +84 hoặc 84)")
    private String phoneNumber;

    // sử dụng trigger để cập nhật số lượng sản phẩm trong kho hoặc viết ở ây luôn
    // cx đcgọi là lifecycle method

    // anh viết trigger trong database cho
}
