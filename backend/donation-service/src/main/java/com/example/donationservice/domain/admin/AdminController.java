package com.example.donationservice.domain.admin;

import com.example.donationservice.domain.sponsor.dto.TeamDto;
import lombok.RequiredArgsConstructor;
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
    public List<TeamDto.response> getTeamList() {
        return adminService.getTeamList();
    }

}
