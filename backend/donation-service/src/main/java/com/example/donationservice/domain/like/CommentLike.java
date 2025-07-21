package com.example.donationservice.domain.like;

import com.example.donationservice.common.entity.BaseTimeEntity;
import com.example.donationservice.domain.comment.Comment;
import com.example.donationservice.domain.user.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Table(
        name = "comment_like",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "comment_id"})
)
public class CommentLike extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "comment_id")
    private Comment comment;
}
