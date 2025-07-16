package com.example.donationservice.domain.post.dto;

import com.example.donationservice.domain.post.Post;
import com.example.donationservice.domain.user.ApprovalStatus;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

public class PostDto {

    @Getter
    @Setter//todo 개시물 생성시 데이터 바인딩 에러를 해결해보기 위해 setter 사용
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PostCreateRequest {
        private String title;
        private String content;
        private Long targetAmount;
        @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
        private LocalDateTime deadline;
//        private Long teamId;         // team, category는 엔티티가므로 id만 받음
        private Long categoryId;
//        private ApprovalStatus approvalStatus; //todo 생성 시 기본값이라면 여기서 안 받아도 됨
        private Long currentAmount; //todo 필터링을 테스트하기 위해 임시로 생성
        private Long participants; //todo 필터링을 테스트하기 위해 임시로 생성

        private MultipartFile imageFile;
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
        private LocalDateTime updatedAt; // 최신순 정렬을 위한 만들어진 시간 응답
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

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PostResponseWithTotalCount {
        private List<PostResponse> resultList;
        private long totalCount;
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
