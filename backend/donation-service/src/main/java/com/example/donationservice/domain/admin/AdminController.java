package com.example.donationservice.domain.admin;

import com.example.donationservice.common.dto.Result;
import com.example.donationservice.domain.user.ApprovalStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/team-list")
    public ResponseEntity<Result> getTeamList() {
        return ResponseEntity.ok(
                Result.builder()
                        .message("팀 목록 조회 성공")
                        .data(adminService.getTeamList())
                        .build()
        );
    }

    @PatchMapping("/team-approval/{teamId}")
    public ResponseEntity<Result> updateTeamApprovalStatus(
            @PathVariable Long teamId,
            @RequestBody ApprovalStatus approvalStatus) {
        adminService.updateTeamApprovalStatus(teamId, approvalStatus);
        return ResponseEntity.ok(
                Result.builder()
                        .message("팀 승인 상태 업데이트 성공")
                        .data("ok")
                        .build()
        );
    }

}
