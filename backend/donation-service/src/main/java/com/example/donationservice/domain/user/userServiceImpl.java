package com.example.donationservice.domain.user;

import com.example.donationservice.config.auth.jwt.JwtService;
import com.example.donationservice.domain.user.dto.UserDto;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatusCode;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class userServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Override
    @Transactional
    public String login(UserDto.loginRequest loginRequest) {
        String email = loginRequest.getEmail();
        String password = loginRequest.getPassword();
        Authentication authentication;
        try {
            System.out.println("call - > login in service");
            // 사용자 인증 시도
            authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));
        } catch (AuthenticationException e) {
            System.out.println("인증실패");

            //todo globalexception
            return null;
        }
        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String jwt = jwtService.generateToken(userDetails.getUsername());
        System.out.println(jwt);
        // 인증 성공 시 JWT 생성
        return jwt;
    }

    @Override
    @Transactional
    public void signup(UserDto.signupRequest signupRequest){

        if(userRepository.findByEmail(signupRequest.getEmail()).isPresent()){
            // todo GLobalException 있으면 에러발생
            throw new RuntimeException();
        }
        User user = User.builder()
                .email(signupRequest.getEmail())
                .password(passwordEncoder.encode(signupRequest.getPassword()))
                .username(signupRequest.getUserName())
                .userRole(signupRequest.getUserRole())
                .build();
        //객체 저장
        userRepository.save(user);
    }
}
