package com.hieuvolaptrinh.Heatly_Store.Service.Impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.hieuvolaptrinh.Heatly_Store.Model.Type;
import com.hieuvolaptrinh.Heatly_Store.Repository.TypeRepository;
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
    private final TypeRepository typeRepository;

    @Value("${chat.ratelimit.max-requests-per-minute:10}")
    private int maxRequestsPerMinute;

    // Cache đếm request theo IP để chống spam (Rate Limiting đơn giản, thread-safe)
    private final Map<String, RateLimitTracker> rateLimitMap = new ConcurrentHashMap<>();

    public ChatServiceImpl(GeminiApiClient geminiApiClient,
                           ProductService productService,
                           ObjectMapper objectMapper,
                           TypeRepository typeRepository) {
        this.geminiApiClient = geminiApiClient;
        this.productService = productService;
        this.objectMapper = objectMapper;
        this.typeRepository = typeRepository;
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

        // 3. Bộ lọc Guardrail chặn các chủ đề ngoài lề (Lập trình, toán, bài tập, chính trị, prompt injection)
        ChatResponse guardrailResponse = handleGuardrail(userMessage);
        if (guardrailResponse != null) {
            return guardrailResponse;
        }

        // 4. Gọi Gemini API vòng 1
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
                            String category = args.path("category").asText("");
                            Double minPrice = args.has("minPrice") ? args.path("minPrice").asDouble() : null;
                            Double maxPrice = args.has("maxPrice") ? args.path("maxPrice").asDouble() : null;

                            // Thực thi tìm kiếm sản phẩm trong MySQL với bộ lọc danh mục và từ khóa chính xác
                            List<ProductResponse> foundProducts = searchProductsFromDb(keyword, category, userMessage, minPrice, maxPrice);

                            // Tạo functionResponse để gửi lại cho Gemini tổng hợp câu trả lời tự nhiên
                            ObjectNode funcResponseNode = createFunctionResponseNode(funcName, foundProducts);
                            JsonNode secondTurnResult = geminiApiClient.generateContent(userMessage, request.getHistory(), funcResponseNode);

                            String finalReply = extractTextFromGemini(secondTurnResult);
                            if (finalReply == null || finalReply.isBlank()) {
                                finalReply = !foundProducts.isEmpty()
                                        ? "Dạ shop gửi bạn danh sách các sản phẩm phù hợp bên dưới nhé:"
                                        : "Dạ rất tiếc shop hiện chưa tìm thấy sản phẩm đúng như yêu cầu của bạn. Bạn tham khảo các mẫu thời trang khác của shop nha!";
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
    private List<ProductResponse> searchProductsFromDb(String keyword, String category, String contextMessage, Double minPrice, Double maxPrice) {
        try {
            ProductFilterRequest filter = new ProductFilterRequest();
            if (minPrice != null && minPrice > 0) {
                filter.setMinSalePrice(minPrice);
            }
            if (maxPrice != null && maxPrice > 0) {
                filter.setMaxSalePrice(maxPrice);
            }

            // 1. Nhận diện TypeId chính xác từ category hoặc từ khóa trong ngữ cảnh
            Integer matchedTypeId = detectTypeId(category, keyword, contextMessage);
            if (matchedTypeId != null) {
                filter.setTypeId(List.of(matchedTypeId));
            }

            // 2. Chuẩn hóa keyword tìm kiếm theo tên sản phẩm
            String cleanKeyword = cleanProductKeyword(keyword, contextMessage);
            if (cleanKeyword != null && !cleanKeyword.isBlank()) {
                filter.setProductName(cleanKeyword);
            }

            // Kiểm tra xem đây có phải là câu hỏi tìm kiếm chung chung không có tiêu chí nào
            boolean isGeneralQuery = (matchedTypeId == null)
                    && (cleanKeyword == null || cleanKeyword.isBlank())
                    && (minPrice == null || minPrice <= 0)
                    && (maxPrice == null || maxPrice <= 0);

            if (isGeneralQuery) {
                // Người dùng hỏi chung chung: "shop có món gì", "gợi ý vài mẫu" -> lấy 4 sản phẩm mới nhất
                PageResponse<ProductResponse> page = productService.getAllProducts(0, 4);
                return (page != null && page.getContent() != null) ? page.getContent() : Collections.emptyList();
            }

            // 3. Tìm kiếm theo bộ lọc chính xác
            PageResponse<ProductResponse> page = productService.getAllProducts(0, 4, filter);
            if (page != null && page.getContent() != null && !page.getContent().isEmpty()) {
                return page.getContent();
            }

            // 4. Nếu có cả cleanKeyword VÀ typeId nhưng không khớp tên chi tiết:
            // Nới lỏng tìm trong chính danh mục đó (typeId) để chỉ trả về sản phẩm ĐÚNG danh mục (ví dụ chỉ trả đồ nam)!
            if (matchedTypeId != null && cleanKeyword != null && !cleanKeyword.isBlank()) {
                ProductFilterRequest categoryOnlyFilter = new ProductFilterRequest();
                categoryOnlyFilter.setTypeId(List.of(matchedTypeId));
                if (minPrice != null && minPrice > 0) categoryOnlyFilter.setMinSalePrice(minPrice);
                if (maxPrice != null && maxPrice > 0) categoryOnlyFilter.setMaxSalePrice(maxPrice);
                PageResponse<ProductResponse> catPage = productService.getAllProducts(0, 4, categoryOnlyFilter);
                if (catPage != null && catPage.getContent() != null && !catPage.getContent().isEmpty()) {
                    return catPage.getContent();
                }
            }

            // TUYỆT ĐỐI KHÔNG FALLBACK RA SẢN PHẨM KHÁC LOẠI!
            // Nếu khách hỏi thời trang nam mà không tìm thấy, trả về rỗng để bot giải thích trung thực.
            return Collections.emptyList();

        } catch (Exception e) {
            log.error("Lỗi khi tìm kiếm sản phẩm từ Database: {}", e.getMessage(), e);
            return Collections.emptyList();
        }
    }

    private Integer detectTypeId(String category, String keyword, String context) {
        String combined = ((category != null ? category : "") + " "
                + (keyword != null ? keyword : "") + " "
                + (context != null ? context : "")).toLowerCase();

        // Kiểm tra Thời Trang Nam (chú ý: kiểm tra "nam" độc lập, tránh nhầm "việt nam")
        if (combined.contains("thời trang nam") || combined.contains("đồ nam")
                || combined.contains("quần áo nam") || combined.contains("cho nam")
                || combined.contains("dành cho nam") || combined.matches(".*\\bnam\\b.*")) {
            return findTypeIdByName("Thời Trang Nam", 1);
        }

        // Kiểm tra Thời Trang Nữ
        if (combined.contains("thời trang nữ") || combined.contains("đồ nữ")
                || combined.contains("quần áo nữ") || combined.contains("cho nữ")
                || combined.contains("dành cho nữ") || combined.contains("váy")
                || combined.contains("đầm") || combined.matches(".*\\bnữ\\b.*")) {
            return findTypeIdByName("Thời Trang Nữ", 2);
        }

        // Kiểm tra Phụ Kiện & Giày Dép
        if (combined.contains("phụ kiện") || combined.contains("giày")
                || combined.contains("dép") || combined.contains("túi xách")
                || combined.contains("balo") || combined.contains("sneaker")) {
            return findTypeIdByName("Phụ Kiện & Giày Dép", 3);
        }

        // Kiểm tra Sản Phẩm Sức Khỏe
        if (combined.contains("sức khỏe") || combined.contains("trà")
                || combined.contains("thảo mộc") || combined.contains("dưỡng nhan")) {
            return findTypeIdByName("Sản Phẩm Sức Khỏe", 4);
        }

        // Kiểm tra Mỹ Phẩm & Làm Đẹp
        if (combined.contains("mỹ phẩm") || combined.contains("làm đẹp")
                || combined.contains("skincare") || combined.contains("son môi")
                || combined.contains("kem dưỡng")) {
            return findTypeIdByName("Mỹ Phẩm & Làm Đẹp", 5);
        }

        // Kiểm tra Đồ Gia Dụng Tiện Ích
        if (combined.contains("gia dụng") || combined.contains("bình giữ nhiệt")
                || combined.contains("tiện ích") || combined.contains("đồ dùng")) {
            return findTypeIdByName("Đồ Gia Dụng Tiện Ích", 6);
        }

        return null;
    }

    private Integer findTypeIdByName(String name, int defaultId) {
        try {
            List<Type> types = typeRepository.findByTypeName(name);
            if (types != null && !types.isEmpty()) {
                return types.get(0).getTypeId();
            }
        } catch (Exception ignored) {
        }
        return defaultId;
    }

    private String cleanProductKeyword(String keyword, String context) {
        String text = (keyword != null && !keyword.isBlank()) ? keyword : context;
        if (text == null) return "";

        String clean = text.toLowerCase()
                .replaceAll("(?i)\\b(thời trang nam|thời trang nữ|đồ nam|đồ nữ|cho nam|cho nữ|dành cho nam|dành cho nữ|sản phẩm|các sản phẩm|mẫu|tìm|cho tôi xem|tôi muốn xem|tôi yêu cầu|yêu cầu|là|có|không|nhé|nha|ạ|em ơi|shop ơi)\\b", " ")
                .replaceAll("\\s+", " ")
                .trim();

        // Nếu chuỗi còn lại chỉ là từ chung chung hoặc quá ngắn
        if (clean.equalsIgnoreCase("nam") || clean.equalsIgnoreCase("nữ") || clean.length() < 2) {
            return "";
        }
        return clean;
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
     * Bộ lọc Guardrail chặn các câu hỏi ngoài phạm vi nghiệp vụ thời trang của shop.
     * Giúp tiết kiệm 100% quota AI và bảo vệ bot trước Prompt Injection/Jailbreak.
     */
    private ChatResponse handleGuardrail(String message) {
        String lower = message.toLowerCase();

        // 1. Chống Prompt Injection / Jailbreak / cố tình đổi vai trò bot
        if (lower.contains("ignore previous") || lower.contains("bỏ qua hướng dẫn")
                || lower.contains("quên các quy tắc") || lower.contains("system prompt")
                || lower.contains("jailbreak") || lower.contains("bạn là ai trước đây")
                || lower.contains("đóng vai một") || lower.contains("act as a")
                || lower.contains("đóng vai trợ lý khác") || lower.contains("quên vai trò")) {
            return ChatResponse.builder()
                    .reply("Dạ em là Lan Fashion Assistant - Trợ lý thời trang của shop ạ. Em chỉ có thể hỗ trợ quý khách về phối đồ, chọn size và mua sắm trang phục thôi ạ!")
                    .products(Collections.emptyList())
                    .build();
        }

        // 2. Chặn câu hỏi về Lập trình / Công nghệ thông tin
        if (lower.contains("viết code") || lower.contains("viết mã") || lower.contains("lập trình")
                || lower.contains("python") || lower.contains("javascript") || lower.contains("java ")
                || lower.contains("c++") || lower.contains("c#") || lower.contains("sql query")
                || lower.contains("thuật toán") || lower.contains("debug") || lower.contains("html/css")) {
            return ChatResponse.builder()
                    .reply("Dạ em chỉ là trợ lý tư vấn thời trang của cửa hàng, không hỗ trợ về lập trình hay công nghệ thông tin được ạ. Bạn có muốn em tư vấn mẫu áo, quần hay váy xinh nào không nè?")
                    .products(Collections.emptyList())
                    .build();
        }

        // 3. Chặn câu hỏi về Học tập / Giải toán / Làm văn
        if (lower.contains("giải phương trình") || lower.contains("tính đạo hàm") || lower.contains("tích phân")
                || lower.contains("viết bài văn") || lower.contains("làm bài tập") || lower.contains("bài toán")
                || lower.contains("công thức hóa học") || lower.contains("vật lý") || lower.contains("lịch sử thế giới")) {
            return ChatResponse.builder()
                    .reply("Dạ em không thể giải bài tập hoặc làm văn giúp bạn được ạ. Em chỉ rành về thời trang, phong cách phối đồ và các sản phẩm của shop thôi ạ!")
                    .products(Collections.emptyList())
                    .build();
        }

        // 4. Chặn các chủ đề nhạy cảm: Chính trị, tôn giáo, quân sự
        if (lower.contains("chính trị") || lower.contains("bầu cử") || lower.contains("chiến tranh")
                || lower.contains("đảng phái") || lower.contains("quân sự")) {
            return ChatResponse.builder()
                    .reply("Dạ em xin phép không trao đổi về các chủ đề chính trị, xã hội ạ. Em sẵn sàng tư vấn cho bạn những outfit thời trang đẹp nhất của shop nhé!")
                    .products(Collections.emptyList())
                    .build();
        }

        return null;
    }

    /**
     * Fallback thông minh khi Gemini không khả dụng
     */
    private ChatResponse handleFallback(String message) {
        List<ProductResponse> products = searchProductsFromDb(message, null, message, null, null);
        String reply;
        if (!products.isEmpty()) {
            reply = "Dạ em tìm thấy một số sản phẩm phù hợp tại shop cho bạn đây ạ:";
        } else {
            reply = "Dạ rất tiếc shop hiện chưa tìm thấy sản phẩm nào đúng theo yêu cầu \"" + message + "\" của bạn. Bạn có thể tham khảo các danh mục thời trang khác trên website nhé!";
        }

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
