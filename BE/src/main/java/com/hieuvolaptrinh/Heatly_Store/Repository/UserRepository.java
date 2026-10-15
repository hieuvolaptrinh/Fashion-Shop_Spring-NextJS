package com.hieuvolaptrinh.Heatly_Store.Repository;

import com.hieuvolaptrinh.Heatly_Store.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByPhoneNumber(String phoneNumber);

    Optional<User> findByUserId(Integer userId); // OAuth2 methods

    Optional<User> findByOauthProviderId(String oauthProviderId);

    Optional<User> findByOauthProviderAndOauthProviderId(String oauthProvider, String oauthProviderId);
}
