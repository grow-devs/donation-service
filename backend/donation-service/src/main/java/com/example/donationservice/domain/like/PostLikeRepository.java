package com.example.donationservice.domain.like;

import com.example.donationservice.domain.post.Post;
import com.example.donationservice.domain.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PostLikeRepository extends JpaRepository<PostLike, Long> {
//    Optional<PostLike> findByUserIdAndPostId(Long userId, Long postId);
    Optional<PostLike> findByUserAndPost(User user, Post post);
}
