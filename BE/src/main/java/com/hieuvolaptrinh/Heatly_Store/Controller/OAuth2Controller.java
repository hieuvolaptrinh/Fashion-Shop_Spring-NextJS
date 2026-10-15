package com.hieuvolaptrinh.Heatly_Store.Controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hieuvolaptrinh.Heatly_Store.Util.ApiMessage;

import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@RestController
@RequestMapping("/api/v1/oauth2")
public class OAuth2Controller {

    @GetMapping("/google")
    public void redirectToGoogleAuth(HttpServletResponse response) throws IOException {
        System.out.println("Bắt đầu quá trình đăng nhập Google OAuth2");
        response.sendRedirect("/oauth2/authorization/google");
    }

    @ApiMessage("Error handling for OAuth2")
    @GetMapping("/error")
    public String handleOAuth2Error() {
        return "Đã xảy ra lỗi trong quá trình xác thực Google OAuth2. Vui lòng thử lại sau.";
    }

    @GetMapping("/facebook")
    public void redirectToFacebookAuth(HttpServletResponse response) throws IOException {
        System.out.println("Bắt đầu quá trình đăng nhập Facebook OAuth2");
        response.sendRedirect("/oauth2/authorization/facebook");
    }
}