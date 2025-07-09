package com.example.donationservice.domain.sponsor.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

public class TeamDto {

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateTeamRequest {
        private String name;
        private String address;
        private String description;
    }

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class response {
        private Long teamId;
        private String name;
        private String address;
        private String description;
    }
}
