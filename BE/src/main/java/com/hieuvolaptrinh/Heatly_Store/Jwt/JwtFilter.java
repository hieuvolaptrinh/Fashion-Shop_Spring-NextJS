package com.hieuvolaptrinh.Heatly_Store.Jwt;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hieuvolaptrinh.Heatly_Store.Response.RestResponse;
import com.hieuvolaptrinh.Heatly_Store.Service.UserServiceImpl;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserServiceImpl userService;
    private final ObjectMapper objectMapper;

    public JwtFilter(JwtUtil jwtUtil, UserServiceImpl userService, ObjectMapper objectMapper) {
        this.jwtUtil = jwtUtil;
        this.userService = userService;
        this.objectMapper = objectMapper;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws IOException {
        try {
            String authHeader = request.getHeader("Authorization");
            String token = null;
            Integer userId = null;

            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                token = authHeader.substring(7);
                userId = jwtUtil.extractUserId(token);
            }
//
//            System.out.println("Request URI: " + request.getRequestURI());
//            System.out.println("Token: " + token);
//            System.out.println("UserId: " + userId);
//            System.out.println("AuthHeader: " + authHeader);

            if (userId != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = userService.loadUserById(userId);
//                System.out.println("UserDetails: " + userDetails);
//                System.out.println("UserDetails Authorities: " + userDetails.getAuthorities());

                if (jwtUtil.validateToken(token, userId)) {
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
//                    System.out.println("Authentication set in SecurityContext: "
//                            + SecurityContextHolder.getContext().getAuthentication());
                } else {
                    System.out.println("Token validation failed");
                }
            }
            filterChain.doFilter(request, response);
        } catch (ExpiredJwtException e) {
            handleJwtError(response, "JWT đã hết hạn", "Token đã hết hạn");
        } catch (MalformedJwtException e) {
            handleJwtError(response, "JWT không đúng định dạng", "Token không đúng định dạng");
        } catch (Exception e) {
            handleJwtError(response, e.getMessage(), "Lỗi xác thực token");
        }
    }

    private void handleJwtError(HttpServletResponse response, String error, String message) throws IOException {
        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        response.setContentType("application/json;charset=UTF-8");

        RestResponse<Object> res = new RestResponse<>();
        res.setStatus(HttpStatus.UNAUTHORIZED.value());
        res.setError(error);
        res.setMessage(message);
        response.getWriter().write(objectMapper.writeValueAsString(res));
    }
}
