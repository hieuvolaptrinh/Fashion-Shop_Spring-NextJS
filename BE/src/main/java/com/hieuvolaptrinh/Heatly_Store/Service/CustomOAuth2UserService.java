package com.hieuvolaptrinh.Heatly_Store.Service;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hieuvolaptrinh.Heatly_Store.Model.Role;
import com.hieuvolaptrinh.Heatly_Store.Model.User;
import com.hieuvolaptrinh.Heatly_Store.Repository.RoleRepository;
import com.hieuvolaptrinh.Heatly_Store.Repository.UserRepository;

import java.util.*;
import java.util.stream.Collectors;

// Step 1:
@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    public CustomOAuth2UserService(UserRepository userRepository, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        System.out.println("Start OAuth2 processing...");
        OAuth2User oAuth2User = super.loadUser(userRequest);
        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        System.out.println("OAuth2 Provider: " + registrationId);

        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String phoneNumber = null;
        String oauthProviderId;
        if ("google".equals(registrationId)) {
            oauthProviderId = oAuth2User.getAttribute("sub");
            // Google cung cấp phone_number nếu có scope 'phone' và user đã chia sẻ
            Object phoneAttr = oAuth2User.getAttribute("phone_number");
            if (phoneAttr != null) {
                String rawPhoneNumber = phoneAttr.toString();
                phoneNumber = normalizePhoneNumber(rawPhoneNumber);
                if (phoneNumber != null) {
                    System.out.println("Tìm thấy và chuẩn hóa số điện thoại từ Google: " + phoneNumber);
                } else {
                    System.out.println("Số điện thoại từ Google không hợp lệ: " + rawPhoneNumber);
                }
            } else {
                System.out.println("Không có số điện thoại từ Google (cần scope 'phone' và user phải chia sẻ)");
            }
        } else if ("facebook".equals(registrationId)) {
            oauthProviderId = oAuth2User.getAttribute("id");
            Object phoneAttr = oAuth2User.getAttribute("phone_number");
            if (phoneAttr != null) {
                String rawPhoneNumber = phoneAttr.toString();
                phoneNumber = normalizePhoneNumber(rawPhoneNumber);
                if (phoneNumber != null) {
                    System.out.println("Tìm thấy và chuẩn hóa số điện thoại từ Facebook: " + phoneNumber);
                } else {
                    System.out.println("Số điện thoại từ Facebook không hợp lệ: " + rawPhoneNumber);
                }
            } else {
                System.out.println(
                        "Facebook không cung cấp số điện thoại (scope user_phone không khả dụng hoặc chưa được approve)");
            }

            if (email == null || email.isEmpty()) {
                email = "facebook_user_" + oauthProviderId + "@facebook.local";
                System.out.println("Facebook không cung cấp email, sử dụng email tạm: " + email);
            }
        } else {
            throw new OAuth2AuthenticationException("Unsupported OAuth2 provider: " + registrationId);
        }

        User user = processUserDetails(email, name, phoneNumber, registrationId, oauthProviderId);
        System.out.println("Đã xử lý thông tin người dùng: " + user.getUserId());

        Set<SimpleGrantedAuthority> authorities = user.getListRoles().stream()
                .map(role -> new SimpleGrantedAuthority(role.getRoleName()))
                .collect(Collectors.toSet());

        Map<String, Object> attributes = new HashMap<>(oAuth2User.getAttributes());
        attributes.put("userId", user.getUserId());
        attributes.put("username", user.getPhoneNumber() != null ? user.getPhoneNumber() : email);
        attributes.put("email", email);
        attributes.put("provider", registrationId);
        attributes.put("oauthProviderId", oauthProviderId); 

        System.out.println("Hoàn tất xử lý thông tin người dùng, chuyển sang OAuth2SuccessHandler");
        return new DefaultOAuth2User(
                authorities,
                attributes,
                userRequest.getClientRegistration().getProviderDetails().getUserInfoEndpoint()
                        .getUserNameAttributeName());
    }

    private User processUserDetails(String email, String fullName, String phoneNumber, String provider,
            String oauthProviderId) {
        // OAuth Provider + Provider ID trước
        User user = userRepository.findByOauthProviderAndOauthProviderId(provider, oauthProviderId)
                .orElse(null);

        if (user == null) {
            System.out.println("Tạo mới người dùng OAuth2 - Provider: " + provider + ", ID: " + oauthProviderId);
            user = new User();
            user.setFullName(fullName);
            user.setPhoneNumber(phoneNumber); // Lưu số điện thoại từ OAuth2 provider
            user.setActive(true);
            user.setOauthProvider(provider);
            user.setOauthProviderId(oauthProviderId);

            Role userRole = roleRepository.findByRoleName("USER")
                    .orElseThrow(() -> new RuntimeException("Role USER not found"));

            List<Role> roles = new ArrayList<>();
            roles.add(userRole);
            user.setListRoles(roles);

            if (phoneNumber != null) {
                System.out.println("Đã lưu số điện thoại từ " + provider + ": " + phoneNumber);
            } else {
                System.out.println("Không có số điện thoại từ " + provider);
            }
        }

        return userRepository.save(user);
    }


    private String normalizePhoneNumber(String phoneNumber) {
        if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
            return null;
        }

        try {
            // Loại bỏ khoảng trắng, dấu gạch ngang, dấu ngoặc, dấu cộng
            String normalized = phoneNumber.trim()
                    .replaceAll("\\s+", "")
                    .replaceAll("-", "")
                    .replaceAll("\\(", "")
                    .replaceAll("\\)", "")
                    .replaceAll("\\+", "");
            if (!normalized.matches("\\d+")) {
                System.out.println("Số điện thoại từ OAuth2 chứa ký tự không phải số: " + phoneNumber);
                return null;
            }
            if (normalized.length() < 10 || normalized.length() > 15) {
                System.out.println("Số điện thoại từ OAuth2 có độ dài không hợp lệ: " + phoneNumber
                        + " (sau chuẩn hóa: " + normalized + ", độ dài: " + normalized.length() + ")");
                return null;
            }

            System.out.println("Chuẩn hóa số điện thoại thành công: " + phoneNumber + " -> " + normalized);
            return normalized;
        } catch (Exception e) {
            System.out.println(
                    "Lỗi khi chuẩn hóa số điện thoại từ OAuth2: " + phoneNumber + ", Error: " + e.getMessage());
            return null;
        }
    }
}