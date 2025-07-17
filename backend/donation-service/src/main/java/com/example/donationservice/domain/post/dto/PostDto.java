package com.example.donationservice.domain.post.dto;

import com.example.donationservice.domain.post.Post;
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
        private Long currentAmount; //필터링을 테스트하기 위해 임시로 생성
        private Long participants; //필터링을 테스트하기 위해 임시로 생성
    }

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PostResponse {
        private Long id;
        private String title;
        private String content;
        private LocalDateTime createdAt; // 최신순 정렬을 위한 만들어진 시간 응답
        private LocalDateTime updatedAt;
        private Long currentAmount;
        private Long targetAmount;
        private LocalDateTime deadline;
        private String imageUrl;
        private ApprovalStatus approvalStatus;
        private Long teamId;
        private String teamName;
        private Long categoryId;
        private String categoryName;
        private Long participants;
    }

    public static PostResponse from(Post post) {
        return PostResponse.builder()
                .id(post.getId())
                .title(post.getTitle())
                .content(post.getContent())
                .createdAt(post.getCreatedAt())
                .currentAmount(post.getCurrentAmount())
                .targetAmount(post.getTargetAmount())
                .deadline(post.getDeadline())
                .imageUrl(post.getImageUrl())
                .approvalStatus(post.getApprovalStatus())
                .teamId(post.getTeam() != null ? post.getTeam().getId() : null)
                .categoryId(post.getCategory() != null ? post.getCategory().getId() : null)
                .participants(post.getParticipants())
                .build();

    }

}
