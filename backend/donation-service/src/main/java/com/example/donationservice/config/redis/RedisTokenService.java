package com.example.donationservice.config.redis;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
@RequiredArgsConstructor
public class RedisTokenService {

    private final RedisTemplate<String, Object> redisTemplate;

    // 저장
    public void saveRefreshToken(String email, String refreshToken, long expirationMillis) {
        redisTemplate.opsForValue().set(email, refreshToken, Duration.ofMillis(expirationMillis));
    }

    // 조회
    public String getRefreshToken(String email) {
        Object value = redisTemplate.opsForValue().get(email);
        return value != null ? value.toString() : null;
    }

    // 삭제
    public void deleteRefreshToken(String email) {
        redisTemplate.delete(email);
    }
}
