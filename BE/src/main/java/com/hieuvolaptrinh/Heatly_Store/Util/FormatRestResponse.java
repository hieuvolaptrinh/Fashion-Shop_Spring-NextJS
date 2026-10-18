package com.hieuvolaptrinh.Heatly_Store.Util;

import com.hieuvolaptrinh.Heatly_Store.Response.Notification;
import com.hieuvolaptrinh.Heatly_Store.Response.RestResponse;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.MethodParameter;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpResponse;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;

@ControllerAdvice
public class FormatRestResponse implements ResponseBodyAdvice<Object> {
    @Override
    public boolean supports(MethodParameter returnType, Class<? extends HttpMessageConverter<?>> converterType) {
        return true;
    }

    @Override
    public Object beforeBodyWrite(Object body,
            MethodParameter returnType,
            MediaType selectedContentType,
            Class<? extends HttpMessageConverter<?>> selectedConverterType,
            ServerHttpRequest request, ServerHttpResponse response) {
        HttpServletResponse servletResponse = ((ServletServerHttpResponse) response).getServletResponse();
        int status = servletResponse.getStatus();

        if (body instanceof RestResponse || body instanceof String) {
            return body;
        }
        String path = request.getURI().getPath();
        if (path.startsWith("/v3/api-docs") || path.startsWith("/swagger-ui")) {
            return body;
        }

        RestResponse<Object> restResponse = new RestResponse<>();
        restResponse.setStatus(status);

        if (status >= 400) {
            if (body instanceof String) {
                restResponse.setError(new Notification((String) body));
            } else {
                restResponse.setError(body);
            }
            restResponse.setMessage("Error occurred");
            return restResponse;
        }

        restResponse.setData(body);
        restResponse.setMessage("Success");

        return restResponse;
    }
}
