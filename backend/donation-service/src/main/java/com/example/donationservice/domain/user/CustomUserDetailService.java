package com.example.donationservice.domain.user;

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
                        ()->new RuntimeException()
                );
        return new CustomUserDetail(userAccount);
    }
}
