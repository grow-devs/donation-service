package com.example.donationservice.domain.sponsor;

import com.example.donationservice.common.exception.RestApiException;
import com.example.donationservice.domain.sponsor.dto.TeamDto;
import com.example.donationservice.domain.user.ApprovalStatus;
import com.example.donationservice.domain.user.User;
import com.example.donationservice.domain.user.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

import static com.example.donationservice.common.exception.CommonErrorCode.TEAM_ALREADY_EXISTS;
import static com.example.donationservice.common.exception.CommonErrorCode.USER_NOT_FOUND;

@Service
@RequiredArgsConstructor
public class TeamServiceImpl implements TeamService{

    private final TeamRepository teamRepository;
    private final UserRepository userRepository;

    // 후원 단체 생성
    @Override
    @Transactional
    public TeamDto.response createTeam(TeamDto.CreateTeamRequest createTeamRequest, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RestApiException(USER_NOT_FOUND));

        if(teamRepository.existsByUser(user)) {
            throw new RestApiException(TEAM_ALREADY_EXISTS);
        }

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
                .createdAt(savedTeam.getCreatedAt())
                .approvalStatus(savedTeam.getApprovalStatus().name()) // ApprovalStatus를 문자열로 변환
                .build();
    }

    // 팀 이름 중복 체크
    public boolean isTeamNameAvailable(String teamName) {
        // 팀 이름이 이미 존재하는지 확인
        return !teamRepository.existsByName(teamName);
    }

    @Override
    public TeamDto.ApprovalStatusResponse getApprovalStatus(Long userId) {
        Optional<ApprovalStatus> optionalStatus = teamRepository.findApprovalStatusByUserId(userId);

        if (optionalStatus.isEmpty()) {
            return TeamDto.ApprovalStatusResponse.builder()
                    .approvalStatus(null)
                    .build();
        }

        ApprovalStatus status = optionalStatus.get();

        return TeamDto.ApprovalStatusResponse.builder()
                .approvalStatus(status.name())
                .build();
    }

    // 팀이 존재하는지 체크
    @Override
    public boolean isExistTeam(Long userId) {
        return teamRepository.existsByUserId(userId);
    }
}
