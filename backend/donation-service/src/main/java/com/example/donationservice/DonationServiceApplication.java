package com.example.donationservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

@SpringBootApplication
@EnableJpaAuditing // 엔티티의 생성/수정 시점과 주체를 자동으로 추적하는 JPA Auditing 기능을 활성화
@EnableAsync // 비동기 메소드 실행을 활성화
@EnableScheduling // 스케줄링 활성화
public class DonationServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(DonationServiceApplication.class, args);
    }

}
