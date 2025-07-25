package com.example.donationservice.domain.post;


import com.example.donationservice.domain.user.ApprovalStatus;
import jakarta.persistence.LockModeType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

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

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT p FROM Post p WHERE p.id = :postId")
    Optional<Post> findByIdWithLock(@Param("postId") Long postId);
}
