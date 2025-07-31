package com.example.donationservice.config.auth.jwt;

import com.example.donationservice.domain.user.CustomUserDetail;
import com.example.donationservice.domain.user.UserRole;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class JwtService {

    //todo
    // 암호화 키 generator 사이트를 통해 키를 생성해서 가져온다.
    // application-properties에 등록해서 사용하면 좋다.

    private static final String SECRET_KEY = "eab9b35e9fbb63ab41be29a22767ee186ff2ca319fa6c9657f02e025de6b3e95";

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }
    /**
     *
     * @param userDetails
     * @return
     */
    public String generateToken(
            CustomUserDetail userDetails
    ) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("email", userDetails.getUsername()); // ✅ 'email'이라는 이름으로 이메일 추가
        claims.put("role", userDetails.getUserRole().name());       // 'role' 클레임 추가

        // 만료 시간을 상수로 정의하여 관리하는 것이 좋습니다. (예: application.properties)
        // 여기서는 예시를 위해 직접 계산합니다.
        long expirationMillis = System.currentTimeMillis() + 1000 * 60 * 60 * 2; // 2시간

        return Jwts.builder()
                .setClaims(claims)           // 클레임 설정 (userEmail,role)
                .setSubject(String.valueOf(userDetails.getUserId()))         // subject에 userId (String으로 변환)
                .setIssuedAt(new Date(System.currentTimeMillis())) // 발행 시점
                .setExpiration(new Date(expirationMillis))         // 만료 시점
                .signWith(getSignInKey(), SignatureAlgorithm.HS256) // 서명
                .compact();
    }

    private Claims extractAllClaims(String token) {
        return Jwts
                .parserBuilder()
                // 256-bit의 key를 사용해야한다.
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token) // ExpiredJwtException
                .getBody();
    }

    //jwt를 검증하는 method
    public boolean isTokenValid(String token) {
        return !isTokenExpired(token);
    }

    //jwt가 만료되었는지 확인하는 method
    public boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    //현재 헤더에서 넘어온 jwt의 expriation을 추출하는 method
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // ✅ JWT에서 userId (subject) 추출
    public Long getUserIdFromJwtToken(String token) {
        return Long.parseLong(extractClaim(token, Claims::getSubject));
    }

    // ✅ JWT에서 userEmail (custom claim) 추출
    public String getUserEmailFromJwtToken(String token) {
        return extractClaim(token, claims -> (String) claims.get("email"));
    }
    // ✅ JWT에서 역할(role) 추출 (수정된 generateToken에 맞춰)
    public String getRoleFromJwtToken(String token) {
        return extractClaim(token, claims -> (String)claims.get("role")); // 역할이 없는 경우 빈 리스트 반환
    }


    // 리프레시 토큰 생성
    public String generateRefreshToken(String subject) {
        return Jwts.builder()
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000L * 60 * 60 * 24 * 7)) // 7일
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

}
