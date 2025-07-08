package com.example.donationservice.domain.user;

import com.example.donationservice.config.auth.jwt.JwtService;
import com.example.donationservice.config.redis.RedisTokenService;
import com.example.donationservice.domain.user.dto.UserDto;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatusCode;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class userServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final RedisTokenService redisTokenService;

    // refreshToken에서 이메일 추출
    public String extractEmailFromToken(String refreshToken) {
        try {
            return jwtService.getUserNameFromJwtToken(refreshToken);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatusCode.valueOf(401), "유효하지 않은 토큰");
        }
    }

    // refreshToken 유효성 검사 (Redis와 비교)
    public boolean isRefreshTokenValid(String email, String refreshToken) {
        String savedRefreshToken = redisTokenService.getRefreshToken(email);
        return savedRefreshToken != null && savedRefreshToken.equals(refreshToken) && !jwtService.isTokenExpired(refreshToken);
    }

    // 새 Access Token 생성
    public String generateAccessToken(String email) {
        return jwtService.generateToken(email);
    }

    @Override
    @Transactional
    public Map<String, String> login(UserDto.loginRequest loginRequest) {
        Authentication authentication;
        try {
            System.out.println("call - > login in service");
            // 사용자 인증 시도
            authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));
        } catch (AuthenticationException e) {
            System.out.println("인증실패");

            //todo globalexception
            return null;
        }

        String email = loginRequest.getEmail();

        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

//        String jwt = jwtService.generateToken(userDetails.getUsername());
        String accessToken = jwtService.generateToken(email);

        // Refresh Token 생성 (예: 7일 유효기간)
        String refreshToken = jwtService.generateRefreshToken(email); // TODO : email을 UUID로 변경 필요

        // Redis에 Refresh Token 저장 (TTL 7일)
        redisTokenService.saveRefreshToken(email, refreshToken, 1000L * 60 * 60 * 24 * 7);

        Map<String, String> tokens = new HashMap<>();
        tokens.put("accessToken", accessToken);
        tokens.put("refreshToken", refreshToken);
        return tokens;

        // 인증 성공 시 JWT 생성
//        return jwt;
    }

    @Override
    @Transactional
    public void signup(UserDto.signupRequest signupRequest){

        if(userRepository.findByEmail(signupRequest.getEmail()).isPresent()){
            // todo GLobalException 있으면 에러발생
            throw new RuntimeException();
        }
        User user = User.builder()
                .email(signupRequest.getEmail())
                .password(passwordEncoder.encode(signupRequest.getPassword()))
                .username(signupRequest.getUserName())
                .userRole(signupRequest.getUserRole())
                .build();
        //객체 저장
        userRepository.save(user);
    }
}
