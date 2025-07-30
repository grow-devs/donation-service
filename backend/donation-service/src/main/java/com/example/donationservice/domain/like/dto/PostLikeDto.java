package com.example.donationservice.domain.like.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

public class PostLikeDto {

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PostLikeToggleResponse {
        private int currentLikesCount; // 현재 게시글의 총 좋아요 수
    }
}
