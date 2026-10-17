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

                SpringApplication.run(HealtyStoreApplication.class, args);
        }
}
