package com.example.donationservice.domain.user;

import com.example.donationservice.domain.user.dto.UserDonationInfoProjection;
import com.example.donationservice.domain.user.dto.UserDto;
import com.example.donationservice.domain.user.dto.UserPostInfoProjection;
import com.example.donationservice.domain.user.dto.UserPostLikeInfoProjection;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


public interface UserService {

    UserDto.loginResponse login(UserDto.loginRequest loginRequest);

    void signup(UserDto.signupRequest signupRequest);

    UserDto.userInfoResponse getUserInfo(Long userId);

    Page<UserDonationInfoProjection> getUserDonationInfo(Long userId, Pageable pageable);

    Page<UserPostLikeInfoProjection> getUserPostLikeInfo(Long userId, Pageable pageable);

    Page<UserPostInfoProjection> getMyPosts(Long userId, Pageable pageable);

    Long addPoints(Long userId, UserDto.PointRequest pointRequest);
}
