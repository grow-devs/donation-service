package com.example.donationservice.domain.like.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

public class CommentLikeDto {

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CommentLikeToggleResponse {
        private int currentLikesCount; // 현재 댓글의 총 좋아요 수
        private boolean isLiked;
    }
}
