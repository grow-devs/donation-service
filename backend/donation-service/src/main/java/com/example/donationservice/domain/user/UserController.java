package com.example.donationservice.domain.user;

import com.example.donationservice.common.dto.Result;
import com.example.donationservice.domain.user.dto.UserDto;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<Result> login(@RequestBody UserDto.loginRequest loginRequest){

        return ResponseEntity.status(200).body(
                Result.builder()
                        .message("로그인 성공")
                        .data(userService.login(loginRequest))
                        .build()
        );
    }
    /*
        TODO. data안에 회피성 null이 있다. refactoring 필요.
     */
    @PostMapping("/signup")
    public ResponseEntity<Result> signup(@RequestBody UserDto.signupRequest signupRequest){
        userService.signup(signupRequest);
        return ResponseEntity.status(200).body(
                Result.builder()
                        .message("회원가입 성공")
                        .data(null)
                        .build()
        );
    }

    // accessToken 재발급
    @PostMapping("/reissue")
    public ResponseEntity<Result> reissue(HttpServletRequest request) {
        String refreshToken = request.getHeader("Authorization");
        if (refreshToken == null || !refreshToken.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body(Result.builder().message("RefreshToken 누락").build());
        }
        refreshToken = refreshToken.substring(7);

        String email;
        try {
            email = userService.extractEmailFromToken(refreshToken);
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Result.builder().message("유효하지 않은 토큰").build());
        }

        if (!userService.isRefreshTokenValid(email, refreshToken)) {
            return ResponseEntity.status(403).body(Result.builder().message("RefreshToken 불일치 또는 만료").build());
        }

        String newAccessToken = userService.generateAccessToken(email);
        return ResponseEntity.ok(Result.builder()
                .message("AccessToken 재발급 성공")
                .data(Collections.singletonMap("accessToken", newAccessToken))
                .build());
    }

    @PostMapping("/test")
    public ResponseEntity<Result> test(@AuthenticationPrincipal CustomUserDetail customUserDetail){
        System.out.println(customUserDetail.getUserId());
        System.out.println("---------------------------------------------");

        return ResponseEntity.status(200).body(
                Result.builder()
                        .message("로그인 성공")
                        .data(null)
                        .build()
        );
    }

    @GetMapping("/test")
    public ResponseEntity<Result> testAccessToken(Authentication authentication) {
        System.out.println("~~~~~~~ AccessToken 인증 테스트 ~~~~~~~~~");
        // 토큰 출력
        System.out.println("Authentication: " + authentication);

        // 인증이 성공하면 여기까지 들어오고,
        // Authentication 객체를 통해 유저 정보 확인 가능
        String username = authentication.getName(); // 이메일 (principal)
        return ResponseEntity.ok(
                Result.builder()
                        .message("AccessToken 인증 성공")
                        .data("로그인된 사용자: " + username)
                        .build()
        );
    }

}
