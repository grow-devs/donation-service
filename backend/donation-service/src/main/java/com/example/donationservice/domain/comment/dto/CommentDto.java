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

        // 필요하다면 User 엔터티에서 사용자 닉네임 등을 가져와 추가할 수 있습니다.
        // private String username;
        public static CommentResponse from(Comment comment, String nickname) {
            return CommentResponse.builder()
                    .id(comment.getId())
                    .message(comment.getMessage())
                    .userId(comment.getUserId())
                    .nickname(nickname)
                    .createdAt(comment.getCreatedAt())
                    .build();
        }
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
