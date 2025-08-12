package com.example.donationservice.domain.user;

import com.example.donationservice.common.entity.BaseTimeEntity;
import com.example.donationservice.common.exception.CommonErrorCode;
import com.example.donationservice.common.exception.RestApiException;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "\"user\"")
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    private String password;

    private String username;

    private String nickName;

    private UserRole userRole;

    private Long points; // 사용자의 현재 포인트 잔액

    // 사용자 points를 감소
    public void decreasePoints(Long amount) {
        if (amount < 0) {
            throw new RestApiException(CommonErrorCode.ZERO_POINTS);
        }
        if (this.points < amount) {
            throw new RestApiException(CommonErrorCode.INSUFFICIENT_POINTS);
        }
        this.points -= amount;
    }

    // 사용자 포인트 추가
    public void addPoints(Long amount) {
        this.points += amount;
    }
}


