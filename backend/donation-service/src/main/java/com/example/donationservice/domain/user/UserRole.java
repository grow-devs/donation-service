package com.example.donationservice.domain.user;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

public enum UserRole {
    USER("ROLE_USER"),
    ADMIN("ROLE_ADMIN");

    private final String springSecurityRole;

    UserRole(String springSecurityRole) {
        this.springSecurityRole = springSecurityRole;
    }

    public String getSpringSecurityRole() {
        return springSecurityRole;
    }

    // GrantedAuthority 객체를 직접 반환하는 메서드를 추가할 수도 있습니다.
    public GrantedAuthority toGrantedAuthority() {
        return new SimpleGrantedAuthority(springSecurityRole);
    }
}
