package com.example.donationservice.config.auth.jwt;

import com.example.donationservice.domain.user.CustomUserDetailService;
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

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final CustomUserDetailService customUserDetailService;
    private final RedisTemplate<String, Object> redisTemplate;
    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        final String authorizationHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        // 헤더에 토큰을 포함하고 있지 않으면 다음 필터로 넘기자
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }
        jwt = authorizationHeader.substring(7);
        userEmail = jwtService.getUserNameFromJwtToken(jwt); // 토큰이 만료되더라도 username은 가져오게 내부적으로 try catch

        // jwt의 userEmail과 인증객체의 userEmail이 있어야 로직 수행
        // 필터가 실행되었을 때, 현재 요청에 대해 이미 인증 정보가 존재하는지 확인하기 위함
        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = customUserDetailService.loadUserByUsername(userEmail);
            try{
                //jwt가 유효하면 security contextholder에 사용자를 저장한다.
                if(jwtService.isTokenValid(jwt,userDetails)){
                    setAuthentication(userDetails);
                }
            }
            catch (ExpiredJwtException e) {
                //Access Token이 만료된 경우 → Refresh Token 검증 로직 실행
                handleExpiredAccessToken(request, response, userDetails);
            } catch (JwtException e) {
                // todo 위조된 토큰 → 401 에러 응답 글로벌 에러 필요
                throw new RuntimeException();
            }
        }
        //jwtfilter를 거친 후 다음 필터로 향하게 한다. (UsernamePasswordAuthenticationfilter)
        filterChain.doFilter(request,response);
    }

    private void setAuthentication(UserDetails userDetails) {
        Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    private void handleExpiredAccessToken(HttpServletRequest request, HttpServletResponse response, UserDetails userDetails){
        String username = userDetails.getUsername();
        String refreshToken = (String) redisTemplate.opsForValue().get(username); // Redis에서 Refresh Token 가져오기
        System.out.println("refreshToken" +refreshToken);
        //등록된 refreshToken이 존재한다면 accesstoken을 재발급해야한다.
        if(refreshToken!=null){
            String newAccessToken = jwtService.generateToken(username);
            setAuthentication(userDetails);
            response.setHeader("Authorization", "Bearer " + newAccessToken);
        }
        //등록된 refreshToken이 없다면
        else{
            System.out.println("there is no refresh token");

            //TODO globalException 필요
            throw new RuntimeException();
        }
    }
}
