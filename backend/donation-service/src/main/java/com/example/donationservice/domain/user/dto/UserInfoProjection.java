package com.example.donationservice.domain.user.dto;

import com.example.donationservice.domain.user.UserRole;

public interface UserInfoProjection {
    Long getUserId();
    String getEmail();
    String getUsername();
    String getNickName();
    String getProfileImageUrl(); // 프로필 이미지 URL
    UserRole getUserRole();
    Long getPoints();
    String getTeamName();
    Long getTotalDonationAmount();
    Long getDonationCount();
}
