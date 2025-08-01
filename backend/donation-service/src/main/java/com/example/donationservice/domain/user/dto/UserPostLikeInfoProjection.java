package com.example.donationservice.domain.user.dto;

import java.time.LocalDateTime;

public interface UserPostLikeInfoProjection {
    String getPostTitle(); // 게시물 제목
    String getThumnbnailImageUrl();
    Long getCurrentAmount();
    Long getTargetAmount();
    LocalDateTime getDeadline(); // 마감일
}
