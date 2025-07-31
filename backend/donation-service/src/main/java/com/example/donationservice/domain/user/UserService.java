package com.example.donationservice.domain.user;

import com.example.donationservice.domain.user.dto.UserDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;


public interface UserService {

    UserDto.loginResponse login(UserDto.loginRequest loginRequest);

    void signup(UserDto.signupRequest signupRequest);

    UserDto.userInfoResponse getUserInfo(Long userId);

}
