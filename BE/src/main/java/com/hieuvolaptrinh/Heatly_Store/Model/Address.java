package com.hieuvolaptrinh.Heatly_Store.Model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer addressId;

    @NotBlank(message = "Tên đường không được để trống")
    @Size(min = 2, max = 256, message = "Tên đường phải có độ dài từ 2 đến 256 ký tự")
    @Column(columnDefinition = "NVARCHAR(256)")
    private String streetName;

    @NotBlank(message = "Tên quận/huyện không được để trống")
    @Size(min = 2, max = 256, message = "Tên quận/huyện phải có độ dài từ 2 đến 256 ký tự")
    @Column(columnDefinition = "NVARCHAR(256)")
    private String districtName;

    @NotBlank(message = "Tên phường xã không được để trống")
    @Size(min = 2, max = 256, message = "Tên phường xã phải có độ dài từ 2 đến 256 ký tự")
    private String wardName;

    @Column(columnDefinition = "NVARCHAR(256)")
    private String provinceName;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // @OneToMany(mappedBy = "shippingAddress")
    // private List<Order> listOrders;

}
