package com.example.donationservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.Executor;

@Configuration
@EnableAsync
public class AsyncConfig {

    @Bean(name = "mailTaskExecutor")
    public Executor mailTaskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        // 메일 전송은 외부 API(SMTP 서버)와의 통신이므로, 응답 지연이 발생할 가능성이 높다.
        // 따라서 너무 많은 스레드를 동시에 생성하면 오히려 시스템 자원을 비효율적으로 사용할 수 있다.
        executor.setCorePoolSize(5); // 기본 스레드 수
        executor.setMaxPoolSize(10); // 최대 스레드 수
        executor.setQueueCapacity(20); // 큐 용량
        executor.setThreadNamePrefix("Mail-Async-"); // 스레드 이름 접두사
        executor.initialize();
        return executor;
    }
}
