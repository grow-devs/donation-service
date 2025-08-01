package com.example.donationservice.domain.user;

import com.example.donationservice.common.dto.Result;
import com.example.donationservice.domain.user.dto.UserDonationInfoProjection;
import com.example.donationservice.domain.user.dto.UserDto;
import com.example.donationservice.domain.user.dto.UserPostLikeInfoProjection;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
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


    /**
     * TODO. 파라미터로 Authentication 대신 @AuthenticationPrincipal CustomUserDetail을 통해 인증된 객체를 바로 주입받는다.
     *       이를 통해 user의 정보를 간단하게 가져올 수 있다. (ex. userId)
     *
     * @param customUserDetail
     * @return
     */
    @PostMapping("/test")
    public ResponseEntity<Result> test(@AuthenticationPrincipal CustomUserDetail customUserDetail){
        System.out.println(customUserDetail.getUserId());
        System.out.println("---------------------------------------------");

        return ResponseEntity.status(200).body(
                Result.builder()
                        .message("로그인 성공")
                        .data(null)
                        .build()
        );
    }

    @GetMapping("/test")
    public ResponseEntity<Result> testAccessToken(Authentication authentication) {
        System.out.println("~~~~~~~ AccessToken 인증 테스트 ~~~~~~~~~");
        // 토큰 출력
        System.out.println("Authentication: " + authentication);

        // 인증이 성공하면 여기까지 들어오고,
        // Authentication 객체를 통해 유저 정보 확인 가능
        String username = authentication.getName(); // 이메일 (principal)
        return ResponseEntity.ok(
                Result.builder()
                        .message("AccessToken 인증 성공")
                        .data("로그인된 사용자: " + username)
                        .build()
        );
    }

}
