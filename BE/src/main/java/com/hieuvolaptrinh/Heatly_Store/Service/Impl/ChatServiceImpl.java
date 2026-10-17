package com.hieuvolaptrinh.Heatly_Store.Service.Impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.hieuvolaptrinh.Heatly_Store.Request.ChatMessageRequest;
import com.hieuvolaptrinh.Heatly_Store.Request.Filter.ProductFilterRequest;
import com.hieuvolaptrinh.Heatly_Store.Response.ChatResponse;
import com.hieuvolaptrinh.Heatly_Store.Response.PageResponse;
import com.hieuvolaptrinh.Heatly_Store.Response.ProductResponse;
import com.hieuvolaptrinh.Heatly_Store.Service.AI.GeminiApiClient;
import com.hieuvolaptrinh.Heatly_Store.Service.ChatService;
import com.hieuvolaptrinh.Heatly_Store.Service.ProductService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class ChatServiceImpl implements ChatService {

    private static final Logger log = LoggerFactory.getLogger(ChatServiceImpl.class);

    private final GeminiApiClient geminiApiClient;
    private final ProductService productService;
    private final ObjectMapper objectMapper;

    @Value("${chat.ratelimit.max-requests-per-minute:10}")
    private int maxRequestsPerMinute;

    // Cache đếm request theo IP để chống spam (Rate Limiting đơn giản, thread-safe)
    private final Map<String, RateLimitTracker> rateLimitMap = new ConcurrentHashMap<>();

    public ChatServiceImpl(GeminiApiClient geminiApiClient, ProductService productService, ObjectMapper objectMapper) {
        this.geminiApiClient = geminiApiClient;
        this.productService = productService;
        this.objectMapper = objectMapper;
    }

    @Override
    public ChatResponse processChat(ChatMessageRequest request, String clientIp) {
        // 1. Kiểm tra Rate Limiting theo IP
        if (isRateLimited(clientIp)) {
            return ChatResponse.builder()
                    .reply("Bạn đang gửi tin nhắn hơi nhanh. Vui lòng đợi trong giây lát rồi hỏi tiếp nhé!")
                    .products(Collections.emptyList())
                    .build();
        }

        String userMessage = request.getMessage().trim();

        // 2. Kiểm tra câu chào hỏi / FAQ nhanh để tiết kiệm quota LLM
        ChatResponse quickResponse = handleQuickFaq(userMessage);
        if (quickResponse != null) {
            return quickResponse;
        }

        // 3. Gọi Gemini API vòng 1
        try {
            JsonNode geminiResult = geminiApiClient.generateContent(userMessage, request.getHistory(), null);

            if (geminiResult != null && geminiResult.has("candidates") && !geminiResult.get("candidates").isEmpty()) {
                JsonNode candidate = geminiResult.get("candidates").get(0);
                JsonNode content = candidate.path("content");
                JsonNode parts = content.path("parts");

                if (parts.isArray() && !parts.isEmpty()) {
                    JsonNode firstPart = parts.get(0);

                    // A. Trường hợp Gemini yêu cầu gọi Function (Tool Calling: search_products)
                    if (firstPart.has("functionCall")) {
                        JsonNode functionCall = firstPart.get("functionCall");
                        String funcName = functionCall.path("name").asText();

                        if ("search_products".equalsIgnoreCase(funcName)) {
                            JsonNode args = functionCall.path("args");
                            String keyword = args.path("keyword").asText("");
                            Double minPrice = args.has("minPrice") ? args.path("minPrice").asDouble() : null;
                            Double maxPrice = args.has("maxPrice") ? args.path("maxPrice").asDouble() : null;

                            // Thực thi tìm kiếm sản phẩm trong MySQL
                            List<ProductResponse> foundProducts = searchProductsFromDb(keyword, minPrice, maxPrice);

                            // Tạo functionResponse để gửi lại cho Gemini tổng hợp câu trả lời tự nhiên
                            ObjectNode funcResponseNode = createFunctionResponseNode(funcName, foundProducts);
                            JsonNode secondTurnResult = geminiApiClient.generateContent(userMessage, request.getHistory(), funcResponseNode);

                            String finalReply = extractTextFromGemini(secondTurnResult);
                            if (finalReply == null || finalReply.isBlank()) {
                                finalReply = !foundProducts.isEmpty()
                                        ? "Dạ shop gửi bạn danh sách các sản phẩm phù hợp bên dưới nhé:"
                                        : "Dạ rất tiếc shop hiện chưa tìm thấy sản phẩm đúng như yêu cầu của bạn. Bạn tham khảo các mẫu thời trang hot khác bên dưới nha!";
                            }

                            return ChatResponse.builder()
                                    .reply(finalReply)
                                    .products(foundProducts)
                                    .build();
                        }
                    }

                    // B. Trường hợp Gemini trả lời văn bản thông thường (không cần tool)
                    if (firstPart.has("text")) {
                        String reply = firstPart.get("text").asText();
                        return ChatResponse.builder()
                                .reply(reply)
                                .products(Collections.emptyList())
                                .build();
                    }
                }
            }
        } catch (Exception e) {
            log.error("Lỗi khi xử lý hội thoại với Gemini: {}", e.getMessage(), e);
        }

        // 4. Fallback an toàn: nếu Gemini lỗi hoặc hết quota, tìm kiếm sản phẩm thông minh trực tiếp từ DB
        return handleFallback(userMessage);
    }

    /**
     * Tìm kiếm sản phẩm thực tế từ Database thông qua ProductService
     */
    private List<ProductResponse> searchProductsFromDb(String keyword, Double minPrice, Double maxPrice) {
        try {
            ProductFilterRequest filter = new ProductFilterRequest();
            if (keyword != null && !keyword.isBlank()) {
                filter.setProductName(keyword.trim());
            }
            if (minPrice != null && minPrice > 0) {
                filter.setMinSalePrice(minPrice);
            }
            if (maxPrice != null && maxPrice > 0) {
                filter.setMaxSalePrice(maxPrice);
            }

            PageResponse<ProductResponse> page = productService.getAllProducts(0, 4, filter);
            if (page != null && page.getContent() != null && !page.getContent().isEmpty()) {
                return page.getContent();
            }

            // Nếu không tìm thấy theo keyword cụ thể, lấy 4 sản phẩm mới nhất
            PageResponse<ProductResponse> fallbackPage = productService.getAllProducts(0, 4);
            return (fallbackPage != null && fallbackPage.getContent() != null)
                    ? fallbackPage.getContent()
                    : Collections.emptyList();

        } catch (Exception e) {
            log.error("Lỗi khi tìm kiếm sản phẩm từ Database: {}", e.getMessage());
            return Collections.emptyList();
        }
    }

    /**
     * Đóng gói kết quả tìm kiếm sản phẩm thành FunctionResponse Node theo chuẩn Gemini
     */
    private ObjectNode createFunctionResponseNode(String functionName, List<ProductResponse> products) {
        ObjectNode root = objectMapper.createObjectNode();
        root.put("role", "function");
        ArrayNode parts = root.putArray("parts");
        ObjectNode funcResp = parts.addObject().putObject("functionResponse");
        funcResp.put("name", functionName);

        ObjectNode responseData = funcResp.putObject("response");
        ArrayNode prodArray = responseData.putArray("products");

        for (ProductResponse p : products) {
            ObjectNode pNode = prodArray.addObject();
            pNode.put("id", p.getProductId());
            pNode.put("name", p.getProductName());
            pNode.put("price", p.getSalePrice() > 0 ? p.getSalePrice() : p.getOriginalPrice());
            pNode.put("description", p.getDescription() != null ? p.getDescription() : "");
        }
        return root;
    }

    private String extractTextFromGemini(JsonNode geminiResult) {
        if (geminiResult == null) return null;
        JsonNode parts = geminiResult.path("candidates").path(0).path("content").path("parts");
        if (parts.isArray() && !parts.isEmpty()) {
            return parts.get(0).path("text").asText(null);
        }
        return null;
    }

    /**
     * Xử lý các câu hỏi FAQ nhanh (không cần tốn quota AI)
     */
    private ChatResponse handleQuickFaq(String message) {
        String lower = message.toLowerCase();

        if (lower.equals("chào") || lower.equals("hi") || lower.equals("hello") || lower.contains("xin chào")) {
            return ChatResponse.builder()
                    .reply("Dạ em chào bạn! Em là Lan Fashion Assistant. Em có thể giúp bạn tìm mẫu quần áo, phối đồ hoặc tư vấn khuyến mãi nào hôm nay ạ?")
                    .products(Collections.emptyList())
                    .build();
        }

        if (lower.contains("đổi trả") || lower.contains("chính sách đổi")) {
            return ChatResponse.builder()
                    .reply("Dạ shop hỗ trợ đổi trả sản phẩm trong vòng 7 ngày kể từ ngày nhận hàng với điều kiện sản phẩm còn nguyên tem mác và chưa qua giặt ủi bạn nhé!")
                    .products(Collections.emptyList())
                    .build();
        }

        if (lower.contains("phí ship") || lower.contains("giao hàng") || lower.contains("vận chuyển")) {
            return ChatResponse.builder()
                    .reply("Dạ shop miễn phí vận chuyển cho tất cả đơn hàng từ 500.000 ₫ trở lên trên toàn quốc. Các đơn hàng dưới 500k phí ship đồng giá là 30.000 ₫ ạ!")
                    .products(Collections.emptyList())
                    .build();
        }

        return null;
    }

    /**
     * Fallback thông minh khi Gemini không khả dụng
     */
    private ChatResponse handleFallback(String message) {
        List<ProductResponse> products = searchProductsFromDb(message, null, null);
        String reply = !products.isEmpty()
                ? "Dạ em tìm thấy một số sản phẩm thời trang nổi bật tại shop cho bạn đây ạ:"
                : "Dạ xin lỗi bạn, hiện tại hệ thống tư vấn đang bận. Bạn có thể xem trực tiếp các bộ sưu tập mới nhất trên website hoặc nhắn tin cho shop nhé!";

        return ChatResponse.builder()
                .reply(reply)
                .products(products)
                .build();
    }

    /**
     * Kiểm tra Rate Limit theo địa chỉ IP
     */
    private boolean isRateLimited(String clientIp) {
        if (clientIp == null || clientIp.isBlank()) {
            clientIp = "unknown";
        }
        long now = System.currentTimeMillis();
        RateLimitTracker tracker = rateLimitMap.computeIfAbsent(clientIp, k -> new RateLimitTracker(now));

        synchronized (tracker) {
            if (now - tracker.windowStartTime > 60000) {
                // Reset cửa sổ 1 phút
                tracker.windowStartTime = now;
                tracker.requestCount = 1;
                return false;
            }
            tracker.requestCount++;
            return tracker.requestCount > maxRequestsPerMinute;
        }
    }

    private static class RateLimitTracker {
        long windowStartTime;
        int requestCount;

        RateLimitTracker(long windowStartTime) {
            this.windowStartTime = windowStartTime;
            this.requestCount = 1;
        }
    }
}
