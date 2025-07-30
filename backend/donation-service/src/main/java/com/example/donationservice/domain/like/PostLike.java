package com.example.donationservice.domain.like;

import com.example.donationservice.common.entity.BaseTimeEntity;
import com.example.donationservice.domain.post.Post;
import com.example.donationservice.domain.user.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Table(
        name = "post_like",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "post_id"})
)
public class PostLike {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id")
    private Post post;
}
