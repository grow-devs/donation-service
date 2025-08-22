package com.example.donationservice.domain.user;

import com.example.donationservice.common.exception.CommonErrorCode;
import com.example.donationservice.common.exception.RestApiException;
import com.example.donationservice.domain.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/*

 */
@Service
@RequiredArgsConstructor
public class CustomUserDetailService implements UserDetailsService {
    private final UserRepository userRepository;


    @Override
    public UserDetails loadUserByUsername(String userEmail) throws UsernameNotFoundException {
        User userAccount = userRepository.findByEmail(userEmail)
                .orElseThrow(
                        //나중에 exception 추가하기
                        ()->new RestApiException(CommonErrorCode.USER_NOT_FOUND)
                );
        // 조회된 User 엔티티 정보를 바탕으로 CustomUserDetail 객체 생성
        return new CustomUserDetail(
                userAccount.getId(),
                userAccount.getEmail(),
                userAccount.getPassword(), // 실제 패스워드는 해시된 값
                userAccount.getNickName(), // ✅ User 엔티티에 닉네임 필드가 있다면 가져옴
                userAccount.getUserRole(), // ✅ User 엔티티에 UserRole enum 필드가 있다면 직접 가져옴
                userAccount.getProfileImageUrl()
        );
    }
}
