package com.example.donationservice.domain.refresh;

import com.example.donationservice.common.dto.Result;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/refresh")
public class RefreshTokenController {

    private final RefreshTokenService refreshTokenService;

    //  refreshToken을 통한 accessToken 재발급 api
    //  @CookieValue 어노테이션으로 "refreshToken"이라는 이름의 쿠키 값을 바로 받습니다.
    //  'String refreshToken' 변수에 쿠키 값이 자동으로 매핑됩니다.
    @GetMapping()
    public ResponseEntity<Result> refresh(@CookieValue("refreshToken") String refreshToken) {
        // 1. 서비스 계층을 호출하여 새로운 Access Token을 받습니다.
        String newAccessToken = refreshTokenService.refresh(refreshToken);

        // 2. HTTP 헤더에 Access Token을 직접 담습니다.
        //    'Authorization' 헤더에 'Bearer ' 접두사를 붙여야 합니다.
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.AUTHORIZATION, "Bearer " + newAccessToken);

        // 3. 바디에는 Access Token을 보내지 않고, 헤더와 함께 200 OK 응답을 보냅니다.
        //    바디에 정보를 담고 싶다면 JSON 응답으로 보내는 것이 더 유연합니다.
        return ResponseEntity.ok()
                .headers(headers)
                .body(Result.builder().message("Access Token Refreshed").build());
    }

}
