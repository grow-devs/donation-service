package com.example.donationservice.domain.healthcheck;

import com.example.donationservice.common.dto.Result;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/health-check")
public class HealthCheckController {

    @GetMapping
    public ResponseEntity<Result> healthCheck() {
        return ResponseEntity.ok(
                Result.builder()
                        .message("헬스 체크 서비스 정상 작동")
                        .data("ok")
                        .build()
        );
    }
}
