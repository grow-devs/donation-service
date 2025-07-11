package com.example.donationservice.domain.admin;

import com.example.donationservice.domain.sponsor.dto.TeamDto;

import java.util.List;

public interface AdminService {
    List<TeamDto.response> getTeamList();
}
