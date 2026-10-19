package com.hieuvolaptrinh.Heatly_Store;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class HealtyStoreApplication {

        public static void main(String[] args) {
                // Load environment variables before starting Spring Boot
                Dotenv dotenv = Dotenv.configure()
                                .directory("./")
                                .ignoreIfMissing()
                                .load();

                setEnvProperty(dotenv, "DB_USERNAME", "root");
                setEnvProperty(dotenv, "DB_PASSWORD", "");
                setEnvProperty(dotenv, "DB_URL", "jdbc:mysql://localhost:3306/healthy_store?useSSL=false&allowPublicKeyRetrieval=true&useUnicode=true&characterEncoding=UTF-8&serverTimezone=Asia/Ho_Chi_Minh");
                setEnvProperty(dotenv, "GOOGLE_CLIENT_ID", "");
                setEnvProperty(dotenv, "GOOGLE_CLIENT_SECRET", "");
                setEnvProperty(dotenv, "FACEBOOK_CLIENT_ID", "");
                setEnvProperty(dotenv, "FACEBOOK_CLIENT_SECRET", "");
                setEnvProperty(dotenv, "BASE_API", "http://localhost:8081");
                setEnvProperty(dotenv, "URL_FE", "http://localhost:3000");
                setEnvProperty(dotenv, "CLOUDINARY_API_KEY", "");
                setEnvProperty(dotenv, "CLOUDINARY_API_SECRET", "");
                setEnvProperty(dotenv, "CLOUDINARY_CLOUD_NAME", "");

                // Gemini AI Chatbot Key Pool
                String geminiKeys = getEnvValue(dotenv, "GEMINI_API_KEYS");
                if (geminiKeys == null || geminiKeys.isBlank()) {
                    String k1 = getEnvValue(dotenv, "GEMINI_KEY_1");
                    String k2 = getEnvValue(dotenv, "GEMINI_KEY_2");
                    java.util.List<String> list = new java.util.ArrayList<>();
                    if (k1 != null && !k1.isBlank()) list.add(k1.trim());
                    if (k2 != null && !k2.isBlank()) list.add(k2.trim());
                    if (!list.isEmpty()) {
                        geminiKeys = String.join(",", list);
                    }
                }
                if (geminiKeys != null && !geminiKeys.isBlank()) {
                    System.setProperty("GEMINI_API_KEYS", geminiKeys);
                }

                SpringApplication.run(HealtyStoreApplication.class, args);
        }

        private static String getEnvValue(Dotenv dotenv, String key) {
                String val = dotenv != null ? dotenv.get(key) : null;
                if (val == null || val.isBlank()) {
                        val = System.getenv(key);
                }
                return val;
        }

        private static void setEnvProperty(Dotenv dotenv, String key, String defaultValue) {
                String val = getEnvValue(dotenv, key);
                if (val == null || val.isBlank()) {
                        val = defaultValue;
                }
                if (val != null) {
                        System.setProperty(key, val);
                }
        }
}
