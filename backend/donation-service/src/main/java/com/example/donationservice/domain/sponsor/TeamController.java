package com.example.donationservice.domain.sponsor;

import com.example.donationservice.common.dto.Result;
import com.example.donationservice.domain.sponsor.dto.TeamDto;
import com.example.donationservice.domain.user.CustomUserDetail;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/team")
@RequiredArgsConstructor
public class TeamController {

    private final TeamService teamService;

    // 팀 생성
    @PostMapping
    public ResponseEntity<Result> createTeam(@AuthenticationPrincipal CustomUserDetail customUserDetail,
                                             @RequestBody TeamDto.CreateTeamRequest createTeamRequest) {
        TeamDto.response response = teamService.createTeam(createTeamRequest, customUserDetail.getUserId());
        return ResponseEntity.status(201).body(
                Result.builder()
                        .message("팀 생성 성공")
                        .data(response)
                        .build()
        );
    }

    // 이름 중복 체크
    @GetMapping("/check-name")
    public ResponseEntity<Result> duplicateTeamNameCheck(@RequestParam String teamName) {
        boolean isAvailable = teamService.isTeamNameAvailable(teamName);
        return ResponseEntity.ok(
                Result.builder()
                        .message("팀 이름 중복 확인")
                        .data(isAvailable)
                        .build()
        );
    }

    @GetMapping("/approval-status")
    public ResponseEntity<Result> getApprovalStatus(@AuthenticationPrincipal CustomUserDetail customUserDetail) {
        TeamDto.ApprovalStatusResponse approvalStatusResponse = teamService.getApprovalStatus(customUserDetail.getUserId());
        return ResponseEntity.ok(
                Result.builder()
                        .message("팀 승인 상태 조회 성공")
                        .data(approvalStatusResponse)
                        .build()
        );
    }
}
