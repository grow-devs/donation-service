package com.example.donationservice.domain.user;

import com.example.donationservice.domain.user.dto.UserDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


public interface UserService {
    public String login(UserDto.loginRequest loginRequest);

    public void signup(UserDto.signupRequest signupRequest);
}
