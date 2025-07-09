package com.example.donationservice.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
// security에서 수행함

//    @Override
//    public void addCorsMappings(CorsRegistry registry) {
//        registry.addMapping("/**")
//                .allowedOrigins("http://localhost:3000", "http://localhost:5173","http://localhost:8080")
//                .allowCredentials(true)
//                .allowedMethods("*")
//                .allowedHeaders("*")
//                .exposedHeaders("Authorization");// 클라이언트가 authorization header를 읽을 수 있게함
//    }
}
