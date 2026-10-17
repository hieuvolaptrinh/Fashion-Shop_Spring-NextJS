package com.hieuvolaptrinh.Heatly_Store.Service.AI;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Component quản lý danh sách API Key của Gemini (Key Pool)
 * và phân phối theo thuật toán Round-Robin để giải quyết bài toán Rate Limit (15 RPM).
 */
@Component
public class GeminiKeyRotator {

    private static final Logger log = LoggerFactory.getLogger(GeminiKeyRotator.class);

    private final List<String> apiKeys;
    private final AtomicInteger currentIndex = new AtomicInteger(0);

    public GeminiKeyRotator(@Value("${gemini.api.keys:}") String keysProperty) {
        if (keysProperty != null && !keysProperty.isBlank()) {
            this.apiKeys = Arrays.stream(keysProperty.split(","))
                    .map(String::trim)
                    .filter(key -> !key.isEmpty())
                    .toList();
        } else {
            this.apiKeys = List.of();
        }
        log.info("GeminiKeyRotator khởi tạo thành công với {} API Key(s) trong Pool.", this.apiKeys.size());
    }

    /**
     * Lấy API Key tiếp theo trong pool theo cơ chế Round-Robin
     */
    public String getNextKey() {
        if (apiKeys.isEmpty()) {
            return null;
        }
        int index = Math.abs(currentIndex.getAndIncrement() % apiKeys.size());
        return apiKeys.get(index);
    }

    /**
     * Lấy tổng số lượng API Key hiện có trong pool
     */
    public int getKeyCount() {
        return apiKeys.size();
    }
}
