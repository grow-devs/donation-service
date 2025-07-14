package com.example.donationservice.domain.admin;

import com.example.donationservice.common.dto.Result;
import com.example.donationservice.domain.user.ApprovalStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    /**
     * 팀 목록 조회
     * @return
     */
    @GetMapping("/team-list")
    public ResponseEntity<Result> getTeamList() {
        return ResponseEntity.ok(
                Result.builder()
                        .message("팀 목록 조회 성공")
                        .data(adminService.getTeamList())
                        .build()
        );
    }

    /**
     * 팀 승인 요청 상태 업데이트
     * @param teamId
     * @param approvalStatus
     * @return
     */
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

    /**
     * 요청한 게시글 목록 조회
     * @param pageable
     * @return
     */
    @GetMapping("/post-list")
    public ResponseEntity<Result> getPostList(
            @PageableDefault(size = 10, sort = "updatedAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return ResponseEntity.ok(
                Result.builder()
                        .message("게시글 목록 조회 성공")
                        .data(adminService.getPostList(pageable))
                        .build()
        );
    }

    /**
     * 게시물 승인 요청 상태 업데이트
     * @param postId
     * @param approvalStatus
     * @return
     */
    @PatchMapping("/post-approval/{postId}")
    public ResponseEntity<Result> updatePostApprovalStatus(
            @PathVariable Long postId,
            @RequestBody ApprovalStatus approvalStatus) {
        adminService.updatePostApprovalStatus(postId, approvalStatus);
        return ResponseEntity.ok(
                Result.builder()
                        .message("게시물 승인 상태 업데이트 성공")
                        .data("ok")
                        .build()
        );
    }

}
