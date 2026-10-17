package com.hieuvolaptrinh.Heatly_Store.Config;

import com.hieuvolaptrinh.Heatly_Store.Jwt.JwtUtil;
import com.hieuvolaptrinh.Heatly_Store.Model.Role;
import com.hieuvolaptrinh.Heatly_Store.Model.User;
import com.hieuvolaptrinh.Heatly_Store.Repository.UserRepository;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private static final Logger logger = LoggerFactory.getLogger(OAuth2SuccessHandler.class);
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    @Value("${frontend.url:http://localhost:3000}")
    private String frontendUrl;

    public OAuth2SuccessHandler(JwtUtil jwtUtil, UserRepository userRepository) {
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
            Authentication authentication) throws IOException {
        System.out.println("OAuth2 login success, loading...");

        if (!(authentication.getPrincipal() instanceof DefaultOAuth2User)) {
            logger.error("Authentication principal is not DefaultOAuth2User");
            String errorRedirect = frontendUrl + "/oauth2/redirect?error=" +
                    URLEncoder.encode("Loại xác thực không hợp lệ (Invalid authentication type)", StandardCharsets.UTF_8.toString());
            getRedirectStrategy().sendRedirect(request, response, errorRedirect);
            return;
        }

        DefaultOAuth2User principal = (DefaultOAuth2User) authentication.getPrincipal();

        // Lấy thông tin từ attributes với null check
        Integer userId = principal.getAttribute("userId");
        String provider = principal.getAttribute("provider");
        String oauthProviderId = principal.getAttribute("oauthProviderId");

        System.out.println("OAuth2 User ID: " + userId);
        System.out.println("OAuth2 Provider: " + provider);
        System.out.println("OAuth2 Provider ID: " + oauthProviderId);

        // Validate required fields
        if (userId == null) {
            logger.error("User ID is null in OAuth2 attributes");
            String errorRedirect = frontendUrl + "/oauth2/redirect?error=" +
                    URLEncoder.encode("Không tìm thấy thông tin tài khoản sau khi xác thực OAuth2", StandardCharsets.UTF_8.toString());
            getRedirectStrategy().sendRedirect(request, response, errorRedirect);
            return;
        }

        if (provider == null || provider.trim().isEmpty()) {
            logger.error("Provider is null or empty in OAuth2 attributes");
            provider = "unknown"; // fallback
        }

        try {
            User user = userRepository.findByUserId(userId)
                    .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

            List<String> roles = user.getListRoles().stream()
                    .map(Role::getRoleName)
                    .collect(Collectors.toList());
            String token = jwtUtil.generateToken(user.getUserId(), roles);

            System.out.println("Provider: " + provider);
            System.out.println("fullName: " + user.getFullName());
            System.out.println("Token: " + token.substring(0, Math.min(20, token.length())) + "...");
            System.out.println("Roles: " + String.join(", ", roles));

            String rolesStr = String.join(",", roles);
            String fullName = user.getFullName() != null ? user.getFullName() : "Unknown User";

            String redirectUrl = frontendUrl + "/oauth2/redirect" +
                    "?fullName=" + URLEncoder.encode(fullName, StandardCharsets.UTF_8.toString()) +
                    "&token=" + URLEncoder.encode(token, StandardCharsets.UTF_8.toString()) +
                    "&roles=" + URLEncoder.encode(rolesStr, StandardCharsets.UTF_8.toString()) +
                    "&provider=" + URLEncoder.encode(provider, StandardCharsets.UTF_8.toString());

            getRedirectStrategy().sendRedirect(request, response, redirectUrl);
        } catch (Exception e) {
            logger.error("Error processing OAuth2 login: ", e);
            String errorRedirect = frontendUrl + "/oauth2/redirect?error=" +
                    URLEncoder.encode("Đã xảy ra lỗi trong quá trình xử lý đăng nhập " + provider + ": " + e.getMessage(),
                            StandardCharsets.UTF_8.toString());
            getRedirectStrategy().sendRedirect(request, response, errorRedirect);
        }
    }
}