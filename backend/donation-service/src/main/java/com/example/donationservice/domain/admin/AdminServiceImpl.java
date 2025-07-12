package com.example.donationservice.domain.admin;

import com.example.donationservice.domain.sponsor.Team;
import com.example.donationservice.domain.sponsor.TeamRepository;
import com.example.donationservice.domain.sponsor.dto.TeamDto;
import com.example.donationservice.domain.user.ApprovalStatus;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService{

    private final TeamRepository teamRepository;

    @Override
    @Transactional
    public List<TeamDto.response> getTeamList() {
        List<Team> teamList = teamRepository.findAllByOrderByCreatedAtDesc();

        return teamList.stream()
                .map(team -> TeamDto.response.builder()
                        .teamId(team.getId())
                        .name(team.getName())
                        .address(team.getAddress())
                        .description(team.getDescription())
                        .createdAt(team.getCreatedAt())
                        .approvalStatus(team.getApprovalStatus().name())
                        .build())
                .toList();
    }

    @Override
    @Transactional
    public void updateTeamApprovalStatus(Long teamId, ApprovalStatus approvalStatus) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new IllegalArgumentException("팀을 찾을 수 없습니다."));

        // 팀 승인 상태를 APPROVED로 변경
        team.updateTeamApprovalStatus(approvalStatus);
        teamRepository.save(team);
    }
}
