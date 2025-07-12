package com.example.donationservice.domain.admin;

import com.example.donationservice.domain.sponsor.dto.TeamDto;
import com.example.donationservice.domain.user.ApprovalStatus;

import java.util.List;

public interface AdminService {
    List<TeamDto.response> getTeamList();

    // 유저가 요청한 팀 승인
    void updateTeamApprovalStatus(Long teamId, ApprovalStatus approvalStatus);
}
