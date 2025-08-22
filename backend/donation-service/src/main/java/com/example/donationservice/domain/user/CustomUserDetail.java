package com.example.donationservice.domain.user;

import com.example.donationservice.domain.user.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;


public class CustomUserDetail implements UserDetails {

    private Long id;
    private String email;
    private String password; // JWT 인증에서는 사용하지 않지만 UserDetails 인터페이스 때문에 필요
    private String nickName; // UserDto.loginResponse를 위해 추가
    private UserRole userRole; // UserRole enum 필드 추가
    private String profileImageUrl; // UserRole enum 필드 추가

    // 생성자: 필요한 정보를 모두 받도록 합니다.
    public CustomUserDetail(Long id, String email, String password, String nickName, UserRole userRole,String profileImageUrl) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.nickName = nickName;
        this.userRole = userRole;
        this.profileImageUrl = profileImageUrl;
    }
    public String getProfileImageUrl(){return profileImageUrl;}

    public Long getUserId() {
        return id;
    }

    @Override
    public String getUsername() {
        return email; // Spring Security의 username을 email로 사용
    }

    @Override
    public String getPassword() {
        return password; // 패스워드는 여기서 사용되지 않음
    }

    public String getNickName() {
        return nickName;
    }

    public UserRole getUserRole() { // ✅ UserRole 필드에 대한 getter
        return userRole;
    }

    // Spring Security가 필요로 하는 권한 목록을 제공합니다.
    // userRole 필드를 기반으로 GrantedAuthority를 생성하여 반환합니다.
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(userRole.toGrantedAuthority()); // ✅ UserRole의 toGrantedAuthority() 사용
    }

}
