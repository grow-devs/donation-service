package com.example.donationservice.domain.post;

import com.example.donationservice.domain.category.Category;
import com.example.donationservice.domain.user.ApprovalStatus;
import com.example.donationservice.domain.sponsor.Team;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
public class Post {
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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id")
    private Team team;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

}
