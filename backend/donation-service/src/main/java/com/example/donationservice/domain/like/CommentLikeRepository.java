package com.example.donationservice.domain.like;

import com.example.donationservice.domain.comment.Comment;
import com.example.donationservice.domain.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CommentLikeRepository extends JpaRepository<CommentLike, Long> {
    // User와 Comment를 기준으로 좋아요 기록을 조회하는 메소드
    Optional<CommentLike> findByUserAndComment(User user, Comment comment);

}
