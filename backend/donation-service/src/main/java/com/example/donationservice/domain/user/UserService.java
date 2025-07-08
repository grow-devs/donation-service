package com.example.donationservice.domain.user;

import com.example.donationservice.domain.user.dto.UserDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;


public interface UserService {
    public Map<String, String > login(UserDto.loginRequest loginRequest);

    public void signup(UserDto.signupRequest signupRequest);

    // accessToken 재발급을 위한 refreshToken에서 이메일 추출
    public String extractEmailFromToken(String refreshToken);

    // refreshToken 유효성 검사 (Redis와 비교)
    public boolean isRefreshTokenValid(String email, String refreshToken);

    // 새 Access Token 생성
    public String generateAccessToken(String email);
}
