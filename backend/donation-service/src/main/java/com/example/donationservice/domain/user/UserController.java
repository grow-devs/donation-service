package com.example.donationservice.domain.user;

import com.example.donationservice.common.dto.Result;
import com.example.donationservice.common.mail.MailService;
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
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;


@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final MailService mailService;

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

    @PostMapping("/point")
    public ResponseEntity<Result> addPoints(@AuthenticationPrincipal CustomUserDetail userDetails, @RequestBody UserDto.PointRequest pointsRequest) {
        Long response = userService.addPoints(userDetails.getUserId(), pointsRequest);
        return ResponseEntity.ok(
                Result.builder()
                        .message("포인트 추가 성공")
                        .data(response)
                        .build()
        );
    }

    // 유저 프로필 이미지 업로드
    @PostMapping("/profile-image")
    public ResponseEntity<Result> uploadProfileImage(
            @AuthenticationPrincipal CustomUserDetail userDetails,
            @RequestParam("image") MultipartFile image) throws IOException {
        userService.uploadProfileImage(userDetails.getUserId(), image);
        return ResponseEntity.ok(
                Result.builder()
                        .message("프로필 이미지 업로드 성공")
                        .data("ok")
                        .build()
        );
    }

    //이메일 인증 코드 발송 api
    @PostMapping("/send-code")
    public String sendCode(@RequestBody UserDto.sendCodeRequest request) {
        try {
            mailService.sendVerificationEmail(request.getEmail());
            return "인증번호가 발송되었습니다.";
        } catch (Exception e) {
            e.printStackTrace();
            return "이메일 발송 실패: " + e.getMessage();
        }
    }
  
    //이메일 인증 코드 확인 api
    @PostMapping("/verify-code")
    public boolean verifyCode(@RequestBody UserDto.verifyCodeRequest request) {
        return mailService.verifyCode(request.getEmail(), request.getCode());
    }
  
    //닉네임 중복 체크 api
    @GetMapping("/check-nickname")
    public boolean checkNickName(@RequestParam String nickName) {
        System.out.println("nickName : "+nickName);
        return userService.checkNickName(nickName);
    }

}
