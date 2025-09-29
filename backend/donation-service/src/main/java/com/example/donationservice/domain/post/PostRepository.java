package com.example.donationservice.domain.post;


import com.example.donationservice.domain.user.ApprovalStatus;
import com.example.donationservice.domain.user.dto.UserPostInfoProjection;
import jakarta.persistence.LockModeType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

// Querydsl이 제공하는 QuerydslPredicateExecutor를 상속받아 더 유연한 쿼리도 가능하지만,
// 현재는 PostRepositoryCustom을 상속받아 커스텀 메서드를 사용합니다.
public interface PostRepository extends JpaRepository<Post,Long>,PostRepositoryCustom {
    Long countByCategoryId(Long CategoryId);

    Page<Post> findAllByOrderByCreatedAtDesc(Pageable pageable);
    Page<Post> findByApprovalStatusOrderByCreatedAtDesc(Pageable pageable, ApprovalStatus approvalStatus);

    // db atomic update로 기부금액 업데이트
    @Modifying
    @Query("UPDATE Post p SET p.currentAmount = p.currentAmount + :cureentAmount WHERE p.id = :postId")
    void addDonationAmount(@Param("postId") Long postId, @Param("cureentAmount") Long cureentAmount);

    @Lock(LockModeType.PESSIMISTIC_READ)
    @Query("SELECT p FROM Post p WHERE p.id = :postId")
    Optional<Post> findByIdWithLock(@Param("postId") Long postId);

    // 특정 userId의 팀이 작성한 게시물 목록을 페이징하여 조회하는 쿼리 (내가 작성한 게시글 조회)
    @Query("""
    SELECT 
        p.id AS postId,
        p.title AS postTitle,
        p.thumnbnailImageUrl AS thumnbnailImageUrl,
        p.currentAmount AS currentAmount,
        p.targetAmount AS targetAmount,
        p.deadline AS deadline,
        p.id as id
    FROM Post p
    JOIN p.team t
    WHERE t.user.id = :userId
    """)
    Page<UserPostInfoProjection> findPostsByTeamUserId(@Param("userId") Long userId, Pageable pageable);

    List<Post> findTop3ByOrderByCurrentAmountDesc();

    Optional<Post> findFirstByDeadlineAfterOrderByDeadlineAsc(LocalDateTime now);

    @Query(value = """
    SELECT *
    FROM post
    WHERE target_amount > 0
      AND goal_reached = false
    ORDER BY (current_amount::float / target_amount) DESC
    LIMIT 1
    """, nativeQuery = true)
    Post findTopPostByDonationRate();

    @Query("select sum(p.currentAmount) from Post p")
    Long sumAllDonationAmounts();

    // 데드라인이 지났는지 여부를 판단하기 위한 쿼리
    @Query("SELECT p FROM Post p WHERE p.deadline < :now AND p.deadlinePassed = false")
    List<Post> findExpiredPostsDeadlinePassed(@Param("now") LocalDateTime now);

    Long countByApprovalStatus(ApprovalStatus approvalStatus);

    Long countByCategoryIdAndApprovalStatus(Long categoryId, ApprovalStatus approvalStatus);
}
