package com.example.donationservice.domain.post.dto;

import com.example.donationservice.domain.user.ApprovalStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

public class PostDto {

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PostCreateRequest {
        private String title;
        private String content;
        private Long targetAmount;
        private LocalDateTime deadline;
        private String imageUrl;
        private Long teamId;         // team, category는 엔티티가므로 id만 받음
        private Long categoryId;
        private ApprovalStatus approvalStatus; // 생성 시 기본값이라면 여기서 안 받아도 됨
    }

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PostResponse {
        private Long id;
        private String title;
        private String content;
        private Long currentAmount;
        private Long targetAmount;
        private LocalDateTime deadline;
        private String imageUrl;
        private ApprovalStatus approvalStatus;
        private Long teamId;
        private String teamName;      // 필요에 따라 추가 가능
        private Long categoryId;
        private String categoryName;  // 필요에 따라 추가 가능
    }


}
