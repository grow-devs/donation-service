package com.example.donationservice.domain.user.dto;

import com.example.donationservice.domain.user.ApprovalStatus;
import com.example.donationservice.domain.user.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

public class UserDto {

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class signupRequest{
        private String email;
        private String password;
        private String userName;
        private UserRole userRole;
        private String nickName;
    }

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class loginRequest{
        private String email;
        private String password;
    }

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class loginResponse{
        private String accessToken;
        private UserRole userRole;
        private String nickName;
    }

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class userInfoResponse{
        private Long userId;
        private String email;
        private String userName;
        private String nickName;
        private String profileImageUrl; // 프로필 이미지 URL
        private UserRole userRole;
        private Long points; // 사용자의 현재 포인트 잔액
        private String teamName;
        private ApprovalStatus approvalStatus; // 팀 승인 상태
        private Long totalDonationAmount; // 기부한 총 금액
        private Long totalDonationCount; // 기부한 총 횟수
    }

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PointRequest{
        private Long points;
    }

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class teamRequest{
        private String teamName;
        private String description;
    }


}
