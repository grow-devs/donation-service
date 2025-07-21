package com.example.donationservice.domain.comment.dto;

import com.example.donationservice.domain.comment.Comment;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

public class CommentDto {

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateCommentRequest {
        private Long teamId; // todo: 필요 없을 수도 있다
        private Long postId;
        private String message;
    }

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CommentResponse {
        private Long id;
        private String message;
        private Long userId;
        private String nickname; // 댓글 작성자의 닉네임
        private LocalDateTime createdAt; // 댓글 작성 시간
        private Integer likesCount; // 댓글 좋아요 수
        private boolean isLikedByCurrentUser; // 현재 사용자가 좋아요를 눌렀는지 여부
    }

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PagedCommentResponse {
        private List<CommentResponse> comments;
        private int currentPage;
        private int totalPages;
        private long totalElements;
        private boolean hasNext;
    }
}
