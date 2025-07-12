package com.example.donationservice.domain.alarm;

import com.example.donationservice.common.entity.BaseTimeEntity;
import com.example.donationservice.domain.user.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
public class Alarm extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private AlarmType type;

    private String message;

    private Long postId; // 게시글로 이동하기 위해서

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

}
