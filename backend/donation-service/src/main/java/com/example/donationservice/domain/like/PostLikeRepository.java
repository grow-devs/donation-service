package com.example.donationservice.domain.like;

import com.example.donationservice.domain.post.Post;
import com.example.donationservice.domain.user.User;
import com.example.donationservice.domain.user.dto.UserPostLikeInfoProjection;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface PostLikeRepository extends JpaRepository<PostLike, Long> {
//    Optional<PostLike> findByUserIdAndPostId(Long userId, Long postId);
    Optional<PostLike> findByUserAndPost(User user, Post post);

    @Query("""
    SELECT 
        p.title AS postTitle,
        p.thumnbnailImageUrl AS thumnbnailImageUrl,
        p.currentAmount AS currentAmount,
        p.targetAmount AS targetAmount,
        p.deadline AS deadline
    FROM PostLike pl
    JOIN pl.post p
    WHERE pl.user.id = :userId
    """)
    Page<UserPostLikeInfoProjection> findLikedPostsByUserId(@Param("userId") Long userId, Pageable pageable);
}
