package com.example.donationservice.domain.post;

import com.example.donationservice.common.entity.BaseTimeEntity;
import com.example.donationservice.domain.category.Category;
import com.example.donationservice.domain.user.ApprovalStatus;
import com.example.donationservice.domain.sponsor.Team;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Post extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String content;

    private Long currentAmount;

    private Long targetAmount;

    private LocalDateTime deadline;

    private String imageUrl;

    private ApprovalStatus approvalStatus;

    private Long participants;//Donation 발생 시 트랜잭션 내에서 이 필드를 업데이트하는 카운터 캐싱을 한다.

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id")
    private Team team;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;


}
