package com.example.donationservice.domain.user;

import com.example.donationservice.aws.s3.S3UploadService;
import com.example.donationservice.common.exception.CommonErrorCode;
import com.example.donationservice.common.exception.RestApiException;
import com.example.donationservice.config.auth.jwt.JwtService;
import com.example.donationservice.config.redis.RedisTokenService;
import com.example.donationservice.domain.donation.DonationRepository;
import com.example.donationservice.domain.like.PostLikeRepository;
import com.example.donationservice.domain.post.PostRepository;
import com.example.donationservice.domain.user.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

import static com.example.donationservice.common.exception.CommonErrorCode.LOGIN_FAILED;
import static com.example.donationservice.common.exception.CommonErrorCode.USER_ID_ALREADY_EXISTS;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final DonationRepository donationRepository;
    private final PostLikeRepository postLikeRepository;
    private final PostRepository postRepository;
    private final S3UploadService s3UploadService;

    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final RedisTokenService redisTokenService;

    @Override
    @Transactional
    public UserDto.loginResponse login(UserDto.loginRequest loginRequest) {
        try {
            System.out.println("call -> login in service");
            Authentication authentication;
            // [1] 사용자가 입력한 email과 password로 인증 시도
            // UsernamePasswordAuthenticationToken: 인증 요청 객체 생성
            // authenticationManager.authenticate(...)가 내부적으로 UserDetailsService를 호출해 사용자 검증
            authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()
                    )
            );

            // [3] 인증 성공 후, Authentication 객체에서 CustomUserDetails 추출
            // authentication.getPrincipal()은 Object 타입이므로 CustomUserDetails로 캐스팅
            Object principal = authentication.getPrincipal();
            // 캐스팅 전에 null 체크 및 타입 확인
            if (!(principal instanceof CustomUserDetail customUserDetail)) {
                // CustomUserDetail 타입이 아닌 경우 (예: 인증 실패 후에도 이 코드가 실행되거나 다른 Principal 타입이 들어온 경우)
                throw new IllegalStateException("인증 객체가 CustomUserDetail타입이 아닙니다.");
            }
            // [4] JWT Access Token 생성 (email을 claim에 넣어 발급)
            String accessToken = jwtService.generateToken(customUserDetail);

            // [5] 랜덤 UUID로 Refresh Token 생성
            // -> Refresh Token 자체에는 사용자 정보 같은 payload를 담지 않음 (추적 불가한 순수 식별용)
            String refreshToken = UUID.randomUUID().toString();

            // [6] Refresh Token을 Redis에 저장 (key: refreshToken, value: email )
            redisTokenService.saveRefreshToken(refreshToken, customUserDetail.getUsername(), 1000L * 60 * 60 * 24 * 7); // 7일

            return UserDto.loginResponse.builder()
                    .accessToken(accessToken)
                    .nickName(customUserDetail.getNickName())
                    .userRole(customUserDetail.getUserRole())
                    .profileImageUrl(customUserDetail.getProfileImageUrl())
                    .refreshToken(refreshToken)
                    .build();

        } catch (AuthenticationException e) {
            System.out.println("인증실패");
            // [2] 인증 실패 시 예외를 잡아 처리
            throw new RestApiException(LOGIN_FAILED);
        } catch (IllegalArgumentException e) {
            // UserRole.valueOf(roleName)에서 발생할 수 있는 예외 (토큰에 유효하지 않은 역할이 있을 경우)
            System.out.println("유효하지 않은 역할 정보: " + e.getMessage());
            throw new RestApiException(LOGIN_FAILED);
        }
    }


    @Override
    @Transactional
    public void signup(UserDto.signupRequest signupRequest) {

        if (userRepository.findByEmail(signupRequest.getEmail()).isPresent()) {
            // todo GLobalException 있으면 에러발생
            throw new RestApiException(USER_ID_ALREADY_EXISTS);
        }
        User user = User.builder()
                .email(signupRequest.getEmail())
                .password(passwordEncoder.encode(signupRequest.getPassword()))
                .username(signupRequest.getUserName())
                .userRole(signupRequest.getUserRole())
                .nickName(signupRequest.getNickName())
                .points(10000L) // 회원가입 시 기본 포인트 10000L 부여
                .build();
        //객체 저장
        userRepository.save(user);
    }

    @Override
    @Transactional
    public UserDto.userInfoResponse getUserInfo(Long userId) {

        UserInfoProjection userInfo = userRepository.findUserInfoById(userId)
                .orElseThrow(() -> new RestApiException(CommonErrorCode.USER_NOT_FOUND));

        return UserDto.userInfoResponse.builder()
                .userId(userId)
                .email(userInfo.getEmail())
                .userName(userInfo.getUsername())
                .nickName(userInfo.getNickName())
                .profileImageUrl(userInfo.getProfileImageUrl())
                .userRole(userInfo.getUserRole())
                .points(userInfo.getPoints())
                .teamName(userInfo.getTeamName())
                .approvalStatus(userInfo.getApprovalStatus())
                .totalDonationAmount(userInfo.getTotalDonationAmount())
                .totalDonationCount(userInfo.getDonationCount())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UserDonationInfoProjection> getUserDonationInfo(Long userId, Pageable pageable) {

        return donationRepository.findUserDonationInfoByUserId(userId, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UserPostLikeInfoProjection> getUserPostLikeInfo(Long userId, Pageable pageable) {

        return postLikeRepository.findLikedPostsByUserId(userId, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UserPostInfoProjection> getMyPosts(Long userId, Pageable pageable) {

        return postRepository.findPostsByTeamUserId(userId, pageable);
    }

    @Override
    @Transactional
    public Long addPoints(Long userId, UserDto.PointRequest pointsRequest) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RestApiException(CommonErrorCode.USER_NOT_FOUND));
        user.addPoints(pointsRequest.getPoints());

        return user.getPoints();
    }

    @Override
    @Transactional
    public void uploadProfileImage(Long userId, MultipartFile imageFile) throws IOException {
        if (imageFile == null || imageFile.isEmpty()) {
            throw new RestApiException(CommonErrorCode.IMAGE_NOT_FOUND);
        }
        String userProfileImageUrl = s3UploadService.uploadProfileImage(imageFile);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RestApiException(CommonErrorCode.USER_NOT_FOUND));

        user.updateProfileImage(userProfileImageUrl);
        userRepository.save(user);
    }

    //닉네임 중복 확인 메서드
    @Override
    public boolean checkNickName(String nickName) {
        return userRepository.existsByNickName(nickName);
    }

}
