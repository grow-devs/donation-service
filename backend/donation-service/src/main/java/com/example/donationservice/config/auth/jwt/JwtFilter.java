package com.example.donationservice.config.auth.jwt;

import com.example.donationservice.common.exception.CommonErrorCode;
import com.example.donationservice.common.exception.RestApiException;
import com.example.donationservice.domain.user.CustomUserDetail;
import com.example.donationservice.domain.user.CustomUserDetailService;
import com.example.donationservice.domain.user.UserRole;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final RedisTemplate<String, Object> redisTemplate;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        final String authorizationHeader = request.getHeader("Authorization");
        final String jwt;
        Long userId = null;
        String userEmail = null;
        String userRole = null;
        UserDetails userDetails = null;
        // 헤더에 토큰을 포함하고 있지 않으면 다음 필터로 넘기자
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        jwt = authorizationHeader.substring(7);
        try {
            // if 문으로 userId가 있는지 확인
            userId = jwtService.getUserIdFromJwtToken(jwt);   // JWT에서 userId 추출
            userEmail = jwtService.getUserEmailFromJwtToken(jwt); // JWT에서 userEmail 추출
            userRole = jwtService.getRoleFromJwtToken(jwt); // 토큰에서 역할 추출
            //jwt에서 추출한 정보로 userDetail 객체 생성
            userDetails = new CustomUserDetail(userId, userEmail, null, null, UserRole.valueOf(userRole),null);
            // 이미 인증된 요청에 대해 다시 인증 과정을 거치는 것을 막기
            // JWT 파싱 중 예외가 발생하지 않았지만 유효한 정보가 추출되지 않은 경우를 대비
            // 필터 체인 내의 역할 명확화
            if (userId != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                //jwt가 유효하면 security contextholder에 사용자를 저장한다.
                if (jwtService.isTokenValid(jwt)) {
                    setAuthentication(userDetails);
                }
            }
        } catch (ExpiredJwtException e) {
            // Access Token이 만료된 경우 → Refresh Token 검증 로직 실행
            handleExpiredAccessToken(request, response,e.getClaims()); // ✅ handleExpiredAccessToken에서 userDetails 제거
        } catch (JwtException e) {
            // 위조된 토큰 또는 다른 JWT 관련 에러
            System.err.println("JWT Exception: " + e.getMessage());
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid JWT Token"); // 401 Unauthorized
            return; // 에러 응답 후 필터 체인 중단
        } catch (Exception e) {
            // 그 외 예상치 못한 예외 처리
            System.err.println("Unexpected error in JwtFilter: " + e.getMessage());
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "An internal error occurred"); // 500 Internal Server Error
            return; // 에러 응답 후 필터 체인 중단
        }


        //jwtfilter를 거친 후 다음 필터로 향하게 한다. (UsernamePasswordAuthenticationfilter)
        filterChain.doFilter(request, response);
    }

    private void setAuthentication(UserDetails userDetails) {
        Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }
    // ExpiredJwtException 에서 받아온 e.getClaims()를 파라미터로 받아서
    // 만료된 토큰에서 사용자의 정보를 가져올 수 있게 한다.
    private void handleExpiredAccessToken(HttpServletRequest request, HttpServletResponse response, Claims claims) {
        // 1. 만료된 Access Token 문자열 가져오기
        String expiredAccessToken = request.getHeader("Authorization").substring(7);
        // 2. 만료된 토큰에서 userId, userEmail, UserRole 등 필요한 정보를 '다시' 추출
        // JwtService의 getUserXFromJwtToken 메서드들은 ExpiredJwtException이 발생하더라도
        // 클레임 정보 자체는 파싱하여 반환할 수 있도록 설계
        Long userId = Long.valueOf(claims.getSubject());
        String email = claims.get("email").toString();
        String role = claims.get("role").toString();

        String refreshToken = (String) redisTemplate.opsForValue().get(email); // Redis에서 Refresh Token 가져오기

        System.out.println("refreshToken" + refreshToken);

        CustomUserDetail userDetails = new CustomUserDetail(userId, email, null, null, UserRole.valueOf(role),null);

        //등록된 refreshToken이 존재한다면 accesstoken을 재발급해야한다.
        if (refreshToken != null) {
            String newAccessToken = jwtService.generateToken(userDetails);
            setAuthentication(userDetails);
            response.setHeader("Authorization", "Bearer " + newAccessToken);
        }
        //등록된 refreshToken이 없다면
        else {
            System.out.println("there is no refresh token");

            //TODO globalException 필요
            throw new RuntimeException();
        }
    }
}
