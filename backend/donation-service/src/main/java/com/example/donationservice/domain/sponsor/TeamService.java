package com.example.donationservice.domain.sponsor;

import com.example.donationservice.domain.sponsor.dto.TeamDto;

public interface TeamService {
    // 후원 단체 생성
    TeamDto.response createTeam(TeamDto.CreateTeamRequest createTeamRequest, Long userId);
    // 팀 이름 중복 체크
    boolean isTeamNameAvailable(String teamName);
}
