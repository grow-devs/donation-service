package com.example.donationservice.domain.user;

import com.example.donationservice.common.dto.Result;
import com.example.donationservice.domain.user.dto.UserDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

    @PostMapping("/test")
    public ResponseEntity<Result> test(@AuthenticationPrincipal CustomUserDetail customUserDetail){
        System.out.println(customUserDetail.getUserId());
        return ResponseEntity.status(200).body(
                Result.builder()
                        .message("로그인 성공")
                        .data(null)
                        .build()
        );
    }
}
