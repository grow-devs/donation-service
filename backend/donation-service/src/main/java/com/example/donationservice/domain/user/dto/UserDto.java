package com.example.donationservice.domain.user.dto;

import com.example.donationservice.domain.user.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

public class UserDto {

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class signupRequest{
        private String email;
        private String password;
        private String userName;
        private UserRole userRole;
    }

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class loginRequest{
        private String email;
        private String password;
    }

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class teamRequest{
        private String teamName;
        private String description;
    }
    ////////////////////////////////////
}
