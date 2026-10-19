package com.hieuvolaptrinh.Heatly_Store.Model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private int userId;

    private String activationCode;

    private boolean isActive = false;

    @Column(unique = true)
    private String phoneNumber;

    private String password;

    @Column(columnDefinition = "NVARCHAR(256)")
    private String fullName;

    // OAuth2 Authentication Support
    @Column(name = "oauth_provider")
    private String oauthProvider; // "google", "facebook"
    @Column(name = "oauth_provider_id")
    private String oauthProviderId; // Provider-specific user ID

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "cart_id", unique = true)
    private Cart cart;

    @ManyToMany(fetch = FetchType.EAGER, cascade = {
            jakarta.persistence.CascadeType.PERSIST,
            jakarta.persistence.CascadeType.MERGE,
            jakarta.persistence.CascadeType.DETACH,
            jakarta.persistence.CascadeType.REFRESH
    })
    @JoinTable(name = "user_role", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "role_id"))
    private List<Role> listRoles;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Order> listOrders;

    // địa chỉ mặt định giao hàng
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Address> baseAddresses;

}