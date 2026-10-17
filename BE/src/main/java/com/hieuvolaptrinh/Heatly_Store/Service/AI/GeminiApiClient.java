package com.hieuvolaptrinh.Heatly_Store.Service.AI;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.hieuvolaptrinh.Heatly_Store.Request.ChatHistoryItem;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.List;

/**
 * Client kết nối trực tiếp với Google Gemini REST API (v1beta)
 * Hỗ trợ System Instructions, Multi-turn Chat History, và Function Calling (Tool Calling).
 */
@Component
public class GeminiApiClient {

    private static final Logger log = LoggerFactory.getLogger(GeminiApiClient.class);

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final GeminiKeyRotator keyRotator;

    @Value("${gemini.api.model:gemini-1.5-flash}")
    private String modelName;

    @Value("${gemini.api.url:https://generativelanguage.googleapis.com/v1beta/models}")
    private String baseUrl;

    @Value("${gemini.api.max-output-tokens:1024}")
    private int maxOutputTokens;

    @Value("${gemini.api.temperature:0.7}")
    private double temperature;

    public static final String SYSTEM_INSTRUCTION = """
            Bạn là "Lan Fashion Assistant" - Chuyên viên tư vấn thời trang cao cấp và chăm sóc khách hàng của cửa hàng Fashion Shop.
            
            QUY TẮC CỐT LÕI:
            1. Phong cách: Thân thiện, lịch sự, am hiểu phong cách phối đồ thời trang, sử dụng xưng hô "em" hoặc "shop" và gọi khách là "bạn" hoặc "quý khách".
            2. Tra cứu sản phẩm: BẤT KỲ KHI NÀO khách hàng hỏi về việc tìm kiếm, hỏi mua, giá cả hoặc gợi ý sản phẩm, bạn BẮT BUỘC phải gọi function `search_products` để lấy dữ liệu thực tế từ hệ thống. TUYỆT ĐỐI KHÔNG tự bịa ra sản phẩm hoặc giá cả không có thật.
            3. Nếu không tìm thấy sản phẩm phù hợp: Khéo léo xin lỗi khách và gợi ý các danh mục sản phẩm tương tự đang có bán tại shop.
            4. Phạm vi tư vấn: Chỉ tập trung tư vấn về sản phẩm, size, cách phối đồ, cách bảo quản trang phục, chính sách giao hàng và đổi trả của shop. Nếu khách hỏi những chủ đề không liên quan (chính trị, lập trình, toán học...), hãy từ chối lịch sự và hướng khách quay lại chủ đề thời trang.
            5. Ngắn gọn, súc tích: Câu trả lời nên rõ ràng, tươi tắn, không dài dòng lê thê, khuyến khích khách xem thẻ sản phẩm đính kèm.
            """;

    public GeminiApiClient(GeminiKeyRotator keyRotator, ObjectMapper objectMapper) {
        this.keyRotator = keyRotator;
        this.objectMapper = objectMapper;
        this.restTemplate = new RestTemplate();
    }

    /**
     * Gửi hội thoại sang Gemini để nhận phản hồi (hoặc yêu cầu Function Call)
     */
    public JsonNode generateContent(String userMessage, List<ChatHistoryItem> history, JsonNode functionResponseNode) {
        String apiKey = keyRotator.getNextKey();
        if (apiKey == null || apiKey.isBlank() || apiKey.contains("placeholder")) {
            log.warn("Gemini API Key chưa được cấu hình hoặc là placeholder.");
            return null;
        }

        String requestUrl = String.format("%s/%s:generateContent?key=%s", baseUrl, modelName, apiKey);

        try {
            ObjectNode root = objectMapper.createObjectNode();

            // 1. System Instruction
            ObjectNode systemInstructionNode = root.putObject("system_instruction");
            ArrayNode sysParts = systemInstructionNode.putArray("parts");
            sysParts.addObject().put("text", SYSTEM_INSTRUCTION);

            // 2. Contents (History + Current Message)
            ArrayNode contentsArray = root.putArray("contents");

            if (history != null) {
                for (ChatHistoryItem item : history) {
                    if (item.getText() != null && !item.getText().isBlank()) {
                        ObjectNode historyTurn = contentsArray.addObject();
                        historyTurn.put("role", "user".equalsIgnoreCase(item.getRole()) ? "user" : "model");
                        ArrayNode turnParts = historyTurn.putArray("parts");
                        turnParts.addObject().put("text", item.getText());
                    }
                }
            }

            // Tin nhắn hiện tại của người dùng
            ObjectNode currentTurn = contentsArray.addObject();
            currentTurn.put("role", "user");
            ArrayNode currentParts = currentTurn.putArray("parts");
            currentParts.addObject().put("text", userMessage);

            // Nếu có kết quả functionResponse trả về từ vòng gọi trước
            if (functionResponseNode != null) {
                contentsArray.add(functionResponseNode);
            }

            // 3. Khai báo Tools (Function Calling)
            ArrayNode toolsArray = root.putArray("tools");
            ObjectNode toolObject = toolsArray.addObject();
            ArrayNode funcDecls = toolObject.putArray("function_declarations");

            ObjectNode searchTool = funcDecls.addObject();
            searchTool.put("name", "search_products");
            searchTool.put("description", "Tìm kiếm sản phẩm thời trang trong cửa hàng theo tên, từ khóa hoặc khoảng giá");
            
            ObjectNode params = searchTool.putObject("parameters");
            params.put("type", "OBJECT");
            ObjectNode properties = params.putObject("properties");

            properties.putObject("keyword")
                    .put("type", "STRING")
                    .put("description", "Tên hoặc đặc điểm sản phẩm (ví dụ: áo thun, polo, sơ mi, đầm, váy, quần)");
            
            properties.putObject("minPrice")
                    .put("type", "NUMBER")
                    .put("description", "Khoảng giá tối thiểu (VNĐ)");

            properties.putObject("maxPrice")
                    .put("type", "NUMBER")
                    .put("description", "Khoảng giá tối đa (VNĐ)");

            // 4. Generation Config
            ObjectNode genConfig = root.putObject("generationConfig");
            genConfig.put("temperature", temperature);
            genConfig.put("maxOutputTokens", maxOutputTokens);

            // Gửi HTTP POST
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<String> entity = new HttpEntity<>(objectMapper.writeValueAsString(root), headers);

            ResponseEntity<String> response = restTemplate.postForEntity(requestUrl, entity, String.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return objectMapper.readTree(response.getBody());
            }

        } catch (Exception e) {
            log.error("Lỗi khi kết nối Google Gemini API: {}", e.getMessage());
        }

        return null;
    }
}
