package com.example.donationservice.domain.admin;

import com.example.donationservice.domain.sponsor.Team;
import com.example.donationservice.domain.sponsor.TeamRepository;
import com.example.donationservice.domain.sponsor.dto.TeamDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService{

    private final TeamRepository teamRepository;

    @Override
    public List<TeamDto.response> getTeamList() {
        List<Team> teamList = teamRepository.findAll();

        return teamList.stream()
                .map(team -> TeamDto.response.builder()
                        .teamId(team.getId())
                        .name(team.getName())
                        .address(team.getAddress())
                        .description(team.getDescription())
                        .approvalStatus(team.getApprovalStatus().name())
                        .build())
                .toList();
    }
}
