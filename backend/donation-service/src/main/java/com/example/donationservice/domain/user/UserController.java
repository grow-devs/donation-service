package com.example.donationservice.domain.user;

import com.example.donationservice.common.dto.Result;
import com.example.donationservice.domain.user.dto.UserDonationInfoProjection;
import com.example.donationservice.domain.user.dto.UserDto;
import com.example.donationservice.domain.user.dto.UserPostInfoProjection;
import com.example.donationservice.domain.user.dto.UserPostLikeInfoProjection;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<Result> login(@RequestBody UserDto.loginRequest loginRequest){

        return ResponseEntity.status(200).body(
                Result.builder()
                        .message("로그인 성공")
                        .data(userService.login(loginRequest))
                        .build()
        );
    }
    /*
        TODO. data안에 회피성 null이 있다. refactoring 필요.
     */
    @PostMapping("/signup")
    public ResponseEntity<Result> signup(@RequestBody UserDto.signupRequest signupRequest){
        userService.signup(signupRequest);
        return ResponseEntity.status(200).body(
                Result.builder()
                        .message("회원가입 성공")
                        .data(null)
                        .build()
        );
    }

    @GetMapping("/info")
    public ResponseEntity<Result> getUserInfo(@AuthenticationPrincipal CustomUserDetail userDetails) {
        UserDto.userInfoResponse userInfo = userService.getUserInfo(userDetails.getUserId());
        return ResponseEntity.ok(
                Result.builder()
                        .message("유저 정보 조회 성공")
                        .data(userInfo)
                        .build()
        );
    }

    // 내가 기부한 내역 목록 조회
    @GetMapping("/donation-list")
    public ResponseEntity<Result> getUserDonationInfo(
            @AuthenticationPrincipal CustomUserDetail userDetails,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC)Pageable pageable) {
        Page<UserDonationInfoProjection> userDonationInfo = userService.getUserDonationInfo(userDetails.getUserId(), pageable);
        return ResponseEntity.ok(
                Result.builder()
                        .message("유저 기부 내역 조회 성공")
                        .data(userDonationInfo)
                        .build()
        );
    }

    // 내가 좋아요 누른 게시글 목록 조회
    @GetMapping("/post-like-list")
    public ResponseEntity<Result> getUserPostLikeInfo(
            @AuthenticationPrincipal CustomUserDetail userDetails,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<UserPostLikeInfoProjection> userPostLikeInfo = userService.getUserPostLikeInfo(userDetails.getUserId(), pageable);
        return ResponseEntity.ok(
                Result.builder()
                        .message("유저 좋아요 게시글 조회 성공")
                        .data(userPostLikeInfo)
                        .build()
        );
    }

    // 내가 작성한 게시물 목록 조회
    @GetMapping("/my-posts")
    public ResponseEntity<Result> getMyPosts(
            @AuthenticationPrincipal CustomUserDetail userDetails,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<UserPostInfoProjection> myPosts = userService.getMyPosts(userDetails.getUserId(), pageable);
        return ResponseEntity.ok(
                Result.builder()
                        .message("내 게시물 목록 조회 성공")
                        .data(myPosts)
                        .build()
        );
    }

}
