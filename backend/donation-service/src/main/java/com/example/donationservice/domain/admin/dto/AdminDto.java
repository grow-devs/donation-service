package com.example.donationservice.domain.admin.dto;

import com.example.donationservice.domain.user.ApprovalStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

public class AdminDto {

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ApprovalStatusReq {
        ApprovalStatus approvalStatus;
        String message;
    }
}
