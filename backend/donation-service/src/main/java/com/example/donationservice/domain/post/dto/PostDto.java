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
    public static class PostResponse { // admin 요청하 게시물 목록조회 + 게시물 목록조회
        private Long id;
        private String title;
        private String content;
        private LocalDateTime createdAt; // 최신순 정렬을 위한 만들어진 시간 응답
        private LocalDateTime updatedAt; 
        private Long currentAmount;
        private Long targetAmount;
        private LocalDateTime deadline;
        private String imageUrl; // 썸네일 용 imageurl
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


    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PostDetailResponse { // admin 요청하 게시물 목록조회 + 게시물 목록조회
        private Long id;
        private String title;
        private String content; // html
        private LocalDateTime createdAt; // 최신순 정렬을 위한 만들어진 시간 응답
        private LocalDateTime updatedAt;
        private Long currentAmount;
        private Long targetAmount;
        private LocalDateTime deadline;
        private String displayImageUrl; // 대표 이미지 // todo : 이름 맞는지 확인
        private ApprovalStatus approvalStatus;
        private Long teamId;
        private String teamName;
        private Long categoryId;
        private String categoryName;
        private Integer likesCount; // 게시물 좋아요 수
        private Long participants;
    }

    // todo 게시물 상세 조회와 게시물 목록 조회에서 보이는 데이터가 다름에 따라 dto가 상세조회용과 목록조회용으로 다를 필요성
    public static PostResponse from(Post post) {
        return PostResponse.builder()
                .id(post.getId())
                .title(post.getTitle())
                .content(post.getContent())
                .createdAt(post.getCreatedAt())
                .currentAmount(post.getCurrentAmount())
                .targetAmount(post.getTargetAmount())
                .deadline(post.getDeadline())
                .imageUrl(post.getThumnbnailImageUrl()) // 썸네일용 imageurl
                .approvalStatus(post.getApprovalStatus())
                .teamId(post.getTeam() != null ? post.getTeam().getId() : null)
                .categoryId(post.getCategory() != null ? post.getCategory().getId() : null)
                .participants(post.getParticipants())
                .build();

    }

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TopDonationPostResponse {
        private Long id;
        private String title;
        private Long currentAmount;
        private Long targetAmount;
        private LocalDateTime deadline;
        private String imageUrl; // 썸네일 용 imageurl
        private ApprovalStatus approvalStatus;
        private Long teamId;
        private String teamName;
        private Long categoryId;
        private String categoryName;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private Long participants; // 참여자 수
        private Integer likesCount; // 게시물 좋아요 수
    }

}
