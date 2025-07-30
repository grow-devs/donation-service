package com.example.donationservice.domain.alarm;

import com.example.donationservice.common.entity.BaseTimeEntity;
import com.example.donationservice.domain.user.User;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Alarm extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private AlarmType type;

    private String message;

    private Long postId; // 게시글로 이동하기 위해서

    @JsonProperty("isRead")
    private boolean isRead;// 알림 읽기 상태 구분

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

}
