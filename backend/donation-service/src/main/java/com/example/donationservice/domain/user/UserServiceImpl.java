package com.example.donationservice.domain.user;

import com.example.donationservice.common.exception.RestApiException;
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
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

import static com.example.donationservice.common.exception.CommonErrorCode.LOGIN_FAILED;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

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
    public String login(UserDto.loginRequest loginRequest) {
        try {
            System.out.println("call -> login in service");
            Authentication authentication;
            // [1] 사용자가 입력한 email과 password로 인증 시도
            // UsernamePasswordAuthenticationToken: 인증 요청 객체 생성
            // authenticationManager.authenticate(...)가 내부적으로 UserDetailsService를 호출해 사용자 검증
            authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()
                    )
            );

            // [3] 인증 성공 후, 인증 객체에서 검증된 사용자 email(또는 username) 가져오기
            // authentication.getName() 값은 UserDetailsService에서 반환한 UserDetails의 getUsername() 값과 동일
            String authenticatedEmail = authentication.getName();

            // [4] JWT Access Token 생성 (email을 claim에 넣어 발급)
            String accessToken = jwtService.generateToken(authenticatedEmail);

            // [5] 랜덤 UUID로 Refresh Token 생성
            // -> Refresh Token 자체에는 사용자 정보 같은 payload를 담지 않음 (추적 불가한 순수 식별용)
            String refreshToken = UUID.randomUUID().toString();
            // [6] Refresh Token을 Redis에 저장 (key: email, value: refreshToken)
            redisTokenService.saveRefreshToken(authenticatedEmail, refreshToken, 1000L * 60 * 60 * 24 * 10);

            // [7] 클라이언트에게 Access Token 반환
            return accessToken;

        } catch (AuthenticationException e) {
            System.out.println("인증실패");
            // [2] 인증 실패 시 예외를 잡아 처리
            throw new RestApiException(LOGIN_FAILED);
        }
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
