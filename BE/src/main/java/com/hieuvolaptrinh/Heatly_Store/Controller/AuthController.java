package com.hieuvolaptrinh.Heatly_Store.Controller;

import com.hieuvolaptrinh.Heatly_Store.Jwt.JwtUtil;
import com.hieuvolaptrinh.Heatly_Store.Model.User;
import com.hieuvolaptrinh.Heatly_Store.Repository.UserRepository;
import com.hieuvolaptrinh.Heatly_Store.Request.AuthRequest;
import com.hieuvolaptrinh.Heatly_Store.Request.RegisterRequest;
import com.hieuvolaptrinh.Heatly_Store.Response.AuthResponse;
import com.hieuvolaptrinh.Heatly_Store.Response.Notification;
import com.hieuvolaptrinh.Heatly_Store.Service.UserService;
import com.hieuvolaptrinh.Heatly_Store.Util.ApiMessage;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final JwtUtil jwtService;
    private final UserService userService;

    public AuthController(UserRepository userRepository,
            AuthenticationManager authenticationManager,
            JwtUtil jwtService,
            UserService userService) {
        this.jwtService = jwtService;
        this.userService = userService;
    }

    @PostMapping("/login")
    @ApiMessage("Login successfully")
    public ResponseEntity<?> login(@Valid @RequestBody AuthRequest authRequest) throws Exception {

        // Tìm user để kiểm tra tồn tại
        User user = this.userService.fetchUserLogin(authRequest.getPhoneNumber());
        if (user == null || !user.isActive()) {
            return ResponseEntity.badRequest()
                    .body("Người dùng không tồn tại");
        }

        List<String> roles = user.getListRoles().stream()
                .map(role -> role.getRoleName())
                .collect(Collectors.toList());

        // Tạo JWT token
        String jwt = jwtService.generateToken(user.getUserId(), roles);

        AuthResponse authResponse = new AuthResponse(user.getUserId(), jwt, user.getFullName(), roles);
        System.out.println("UserId: " + user.getUserId());
        System.out.println("JWT: " + jwt);
        System.out.println("Fullname: " + user.getFullName());
        System.out.println("Roles: " + roles);
        return ResponseEntity.ok(authResponse);

    }

    // {
    // "phoneNumber": "0987654321",
    // "fullName": "Nguyễn Văn An",
    // "addressRequest": {
    // "addressName": "123 Đường ABC",
    // "districtName": "Quận 1",
    // "provinceName": "Thành phố Hồ Chí Minh"
    // }
    // }
    @PostMapping("/register")
    @ApiMessage("Register successfully")
    public ResponseEntity<Notification> register(@Valid @RequestBody RegisterRequest registerRequest) throws Exception {
        String message = userService.registerUser(registerRequest);
        Notification notification = new Notification(message);
        return ResponseEntity.ok(notification);

    }

}