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
                                .load();

                System.setProperty("DB_USERNAME", dotenv.get("DB_USERNAME"));
                System.setProperty("DB_PASSWORD", dotenv.get("DB_PASSWORD"));
                System.setProperty("GOOGLE_CLIENT_ID", dotenv.get("GOOGLE_CLIENT_ID"));
                System.setProperty("GOOGLE_CLIENT_SECRET",
                                dotenv.get("GOOGLE_CLIENT_SECRET"));

                System.setProperty("FACEBOOK_CLIENT_ID", dotenv.get("FACEBOOK_CLIENT_ID"));
                System.setProperty("FACEBOOK_CLIENT_SECRET",
                                dotenv.get("FACEBOOK_CLIENT_SECRET"));

                System.setProperty("BASE_API", dotenv.get("BASE_API"));
                String urlFe = dotenv.get("URL_FE");
                System.setProperty("URL_FE", urlFe != null ? urlFe : "http://localhost:3000");
                System.setProperty("CLOUDINARY_API_KEY", dotenv.get("CLOUDINARY_API_KEY"));
                System.setProperty("CLOUDINARY_API_SECRET",
                                dotenv.get("CLOUDINARY_API_SECRET"));
                System.setProperty("CLOUDINARY_CLOUD_NAME",
                                dotenv.get("CLOUDINARY_CLOUD_NAME"));

                // Gemini AI Chatbot Key Pool
                String geminiKeys = dotenv.get("GEMINI_API_KEYS");
                if (geminiKeys == null || geminiKeys.isBlank()) {
                    String k1 = dotenv.get("GEMINI_KEY_1");
                    String k2 = dotenv.get("GEMINI_KEY_2");
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
}
