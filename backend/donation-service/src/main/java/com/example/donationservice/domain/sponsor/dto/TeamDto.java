package com.example.donationservice.domain.sponsor.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

public class TeamDto {

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateTeamRequest {
        private String name;
        private String address;
        private String description;
    }

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class response {
        private Long teamId;
        private String name;
        private String address;
        private String description;
        private LocalDateTime createdAt;
        private String approvalStatus;
    }

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ApprovalStatusResponse {
        private String approvalStatus; // 승인 상태 (예: "APPROVED", "REJECTED", "PENDING")
    }
}
