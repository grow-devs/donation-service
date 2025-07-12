package com.example.donationservice.domain.sponsor;

import com.example.donationservice.common.entity.BaseTimeEntity;
import com.example.donationservice.domain.user.ApprovalStatus;
import com.example.donationservice.domain.user.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Team extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String address;

    private String description;

    private ApprovalStatus approvalStatus;

    // team이 user를 단방향으로 참조한다 (user에서는 참조안함)
    // 외래키는 team 테이블에서 user의 id를 참조한다.
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    public void updateTeamApprovalStatus(ApprovalStatus approvalStatus) {
        this.approvalStatus = approvalStatus;
    }
}
