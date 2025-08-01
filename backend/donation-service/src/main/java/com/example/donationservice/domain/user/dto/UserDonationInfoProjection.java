package com.example.donationservice.domain.user.dto;

import java.time.LocalDateTime;

public interface UserDonationInfoProjection {
    String getPostTitle(); // 게시물 제목
    LocalDateTime getDonationDate(); // 기부 날짜
    Long getDonationAmount(); // 기부 금액
}
