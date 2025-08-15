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

    @Column(columnDefinition = "TEXT") // todo html컨텐츠를 저장하기위해 데이터 타입을 "TEXT"로 맵핑시킨다.
    private String content;

    private Long currentAmount;

    private Long targetAmount;

    private LocalDateTime deadline;

    private String thumnbnailImageUrl; //todo 게시물 목록 조회시 대표 이미지 썸네일용 imageurl 추가

    private String displayImageUrl; //todo 게시물 상세 조회시 대표이미지용  imageurl 추가

    private ApprovalStatus approvalStatus;

    private Integer likesCount; // 게시물 좋아요 수

    private Long participants; //Donation 발생 시 트랜잭션 내에서 이 필드를 업데이트하는 카운터 캐싱을 한다.

    private Boolean goalReached; // 목표 금액 도달 여부

    private Boolean deadlinePassed; // 데드라인이 지났는지 여부를 판단

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id")
    private Team team;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    // 요청한 게시물 수락 및 반려
    public void updateApprovalStatus(ApprovalStatus approvalStatus) {
        this.approvalStatus = approvalStatus;
    }

    // 현재 기부 금액 업데이트
    public void addCurrentAmount(Long amount) {
        this.currentAmount += amount;
    }

    // 목표 금액 도달 여부 업데이트
    public void updateGoalReached() {
        this.goalReached = true;
    }

    // 게시물의 참여자 수 증가
    public void incrementParticipants() {
        this.participants++;
    }

    // likesCount 증가
    public void incrementLikesCount() {
        if (this.likesCount == null) {
            this.likesCount = 0;
        }
        this.likesCount++;
    }
}
