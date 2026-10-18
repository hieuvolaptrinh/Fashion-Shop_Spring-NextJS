package com.hieuvolaptrinh.Heatly_Store.Config;

import com.hieuvolaptrinh.Heatly_Store.Jwt.JwtFilter;
import com.hieuvolaptrinh.Heatly_Store.Service.CustomOAuth2UserService;
import com.hieuvolaptrinh.Heatly_Store.Service.UserServiceImpl;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfigration {

    private final JwtFilter jwtAuthenticationFilter;
    private final UserServiceImpl userService;
    private final CustomOAuth2UserService customOAuth2UserService;
    private final OAuth2SuccessHandler oAuth2SuccessHandler;
    private final OAuth2FailureHandler oAuth2FailureHandler;

    public SecurityConfigration(@Lazy JwtFilter jwtAuthenticationFilter,
            @Lazy UserServiceImpl userService,
            @Lazy CustomOAuth2UserService customOAuth2UserService,
            @Lazy OAuth2SuccessHandler oAuth2SuccessHandler,
            @Lazy OAuth2FailureHandler oAuth2FailureHandler) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.userService = userService;
        this.customOAuth2UserService = customOAuth2UserService;
        this.oAuth2SuccessHandler = oAuth2SuccessHandler;
        this.oAuth2FailureHandler = oAuth2FailureHandler;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(Endpoint.PUBLIC_ENDPOINTS).permitAll()
                        .requestMatchers("/favicon.ico", "/static/**").permitAll() // Cho phép favicon và static files
                        .requestMatchers(HttpMethod.GET, "/api/v1/products/**", "/api/v1/types/**").permitAll()
                        .requestMatchers(HttpMethod.GET, Endpoint.USER_GET_ENDPOINTS)
                        .hasAnyAuthority("USER", "ADMIN")
                        .requestMatchers(HttpMethod.POST, Endpoint.USER_POST_ENDPOINTS)
                        .hasAnyAuthority("USER", "ADMIN")
                        .requestMatchers(HttpMethod.DELETE, Endpoint.USER_DELETE_ENDPOINTS)
                        .hasAnyAuthority("USER", "ADMIN")
                        .requestMatchers(HttpMethod.PUT, Endpoint.USER_PUT_ENDPOINTS)
                        .hasAnyAuthority("USER", "ADMIN")
                        .requestMatchers(Endpoint.ADMIN_ENDPOINTS).hasAuthority("ADMIN")
                        .anyRequest().authenticated())

                .cors(cors -> cors.configurationSource(request -> {
                    CorsConfiguration config = new CorsConfiguration();
                    config.setAllowedOriginPatterns(List.of("*")); // Cho phép tất cả FE
                    config.setAllowedMethods(List.of("*")); // Cho phép mọi method (GET, POST, PUT, DELETE, ...)
                    config.setAllowedHeaders(List.of("*")); // Cho phép mọi header
                    config.setAllowCredentials(true); // Nếu cần gửi cookie
                    return config;
                }))

                .oauth2Login(oauth2 -> oauth2
                        .userInfoEndpoint(userInfo -> userInfo
                                .userService(customOAuth2UserService))
                        .successHandler(oAuth2SuccessHandler)
                        .failureHandler(oAuth2FailureHandler))
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .headers(headers -> headers
                        .httpStrictTransportSecurity(hstsConfig -> hstsConfig
                                .maxAgeInSeconds(31536000)))
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration)
            throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    @SuppressWarnings("deprecation")
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
