package com.example.donationservice.domain.sponsor;

import com.example.donationservice.domain.sponsor.dto.TeamDto;
import com.example.donationservice.domain.user.ApprovalStatus;
import com.example.donationservice.domain.user.User;
import com.example.donationservice.domain.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TeamServiceImpl implements TeamService{

    private final TeamRepository teamRepository;
    private final UserRepository userRepository;

    // 후원 단체 생성
    public TeamDto.response createTeam(TeamDto.CreateTeamRequest createTeamRequest, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다. ID: " + userId));

        // 요청으로부터 Team 객체 생성
        Team team = Team.builder()
                .name(createTeamRequest.getName())
                .address(createTeamRequest.getAddress())
                .description(createTeamRequest.getDescription())
                .approvalStatus(ApprovalStatus.PENDING) // 기본 승인 상태는 PENDING
                .user(user)
                .build();

        // 팀 저장
        Team savedTeam = teamRepository.save(team);

        // 저장된 팀 정보를 DTO로 변환하여 반환
        return TeamDto.response.builder()
                .teamId(savedTeam.getId())
                .name(savedTeam.getName())
                .address(savedTeam.getAddress())
                .description(savedTeam.getDescription())
                .approvalStatus(savedTeam.getApprovalStatus().name()) // ApprovalStatus를 문자열로 변환
                .build();
    }

    // 팀 이름 중복 체크
    public boolean isTeamNameAvailable(String teamName) {
        // 팀 이름이 이미 존재하는지 확인
        return !teamRepository.existsByName(teamName);
    }
}
