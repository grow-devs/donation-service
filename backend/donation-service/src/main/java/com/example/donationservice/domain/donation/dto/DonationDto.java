package com.example.donationservice.domain.donation.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;

public class DonationDto {

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class createRequest {
        private Long postId;
        private Long points;
        private String message; // 기부 메시지
    }

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class response {
        private Long id; // 기부 ID
        private Long postId; // 기부가 연결된 게시글 ID
        private Long userId; // 기부를 한 사용자 ID
        private String nickname; // 기부를 한 사용자의 닉네임
        private Long points; // 기부한 포인트 수
        private String message; // 기부 메시지
        private String createdAt; // 기부 생성 시간
    }
}
