package com.example.donationservice.domain.refresh;

import com.example.donationservice.common.exception.RestApiException;
import com.example.donationservice.config.auth.jwt.JwtService;
import com.example.donationservice.domain.user.CustomUserDetail;
import com.example.donationservice.domain.user.User;
import com.example.donationservice.domain.user.UserRepository;
import com.example.donationservice.domain.user.UserRole;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import static com.example.donationservice.common.exception.CommonErrorCode.USER_ID_ALREADY_EXISTS;
import static com.example.donationservice.common.exception.CommonErrorCode.USER_NOT_FOUND;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final RedisTemplate<String,String> redisTemplate;

    /**
     *
     * @param refreshToken
     * @return
     */
    public String refresh(String refreshToken) {
        // cookie에서 받아온 refreshToken이 redis에 존재하는지 확인
        String email = (String)redisTemplate.opsForValue().get(refreshToken);

        //등록된 refreshToken이 존재한다면 accesstoken을 재발급해야한다.
        if (email != null) {
            User user = userRepository.findByEmail(email).orElseThrow(
                    ()->  new RestApiException(USER_NOT_FOUND)
            );
            //AccessToken 재발급을 위한 userDetail 생성
            CustomUserDetail userDetails = new CustomUserDetail(user.getId(), email, null, null, user.getUserRole(),null);
            //AccessToken 재발급
            String newAccessToken = jwtService.generateToken(userDetails);

            return newAccessToken;
        }
        //등록된 refreshToken이 없다면
        else {
            System.out.println("there is no refresh token");
            //TODO globalException 필요
            throw new RuntimeException();
        }
    }

}
