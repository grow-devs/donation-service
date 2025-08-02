package com.example.donationservice.domain.donation;

import com.example.donationservice.domain.user.User;
import com.example.donationservice.domain.user.dto.UserDonationInfoProjection;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface DonationRepository extends JpaRepository<Donation, Long> {

    Page<Donation> findByPostIdOrderByCreatedAtDesc(Long postId, Pageable pageable);

    // 특정 게시물에 기부한 유저들의 이메일을 추출 (중복 제거)
    @Query("SELECT DISTINCT d.user.email FROM Donation d WHERE d.post.id = :postId")
    List<String> findDistinctUserEmailsByPostId(Long postId);

    boolean existsByUserIdAndPostId(Long userId, Long postId);

    Optional<Donation> findByUser(User user);

    // fetcj join으로
    @Query("select d from Donation d join fetch d.post where d.user.id = :userId")
    List<Donation> findAllByUserIdWithPost(@Param("userId") Long userId);

    @Query(value = """
        SELECT
            p.id AS postId,
            p.title AS postTitle,
            d.createdAt AS donationDate,
            d.point AS donationAmount
        FROM Donation d
        JOIN d.post p
        WHERE d.user.id = :userId
        """)
    Page<UserDonationInfoProjection> findUserDonationInfoByUserId(@Param("userId") Long userId, Pageable pageable);

}
