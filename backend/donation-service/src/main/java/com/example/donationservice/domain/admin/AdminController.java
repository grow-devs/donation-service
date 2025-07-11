package com.example.donationservice.domain.admin;

import com.example.donationservice.common.dto.Result;
import com.example.donationservice.domain.sponsor.dto.TeamDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

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

}
