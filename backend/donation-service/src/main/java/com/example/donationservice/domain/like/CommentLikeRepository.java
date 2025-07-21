package com.example.donationservice.domain.like;

import com.example.donationservice.domain.comment.Comment;
import com.example.donationservice.domain.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface CommentLikeRepository extends JpaRepository<CommentLike, Long> {
    // User와 Comment를 기준으로 좋아요 기록을 조회하는 메소드
    Optional<CommentLike> findByUserAndComment(User user, Comment comment);
    boolean existsByUserIdAndCommentId(Long userId, Long commentId);

    // ✨ 추가: 특정 사용자가 특정 댓글 ID 목록에 좋아요를 눌렀는지 여부를 조회
    // 이 쿼리는 userId와 commentId 조합을 가진 CommentLike 엔티티의 commentId만 반환합니다.
    // 결과로 얻은 commentId Set을 통해 어떤 댓글들이 좋아요 되어있는지 빠르게 확인할 수 있습니다.
    @Query("SELECT cl.comment.id FROM CommentLike cl WHERE cl.user.id = :userId AND cl.comment.id IN :commentIds")
    Set<Long> findLikedCommentIdsByUserIdAndCommentIdsIn(@Param("userId") Long userId, @Param("commentIds") List<Long> commentIds);
}
