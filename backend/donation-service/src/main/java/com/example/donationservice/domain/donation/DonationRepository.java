package com.example.donationservice.domain.donation;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface DonationRepository extends JpaRepository<Donation, Long> {

    Page<Donation> findByPostIdOrderByCreatedAtDesc(Long postId, Pageable pageable);

    // 특정 게시물에 기부한 유저들의 이메일을 추출 (중복 제거)
    @Query("SELECT DISTINCT d.user.email FROM Donation d WHERE d.post.id = :postId")
    List<String> findDistinctUserEmailsByPostId(Long postId);

    boolean existsByUserIdAndPostId(Long userId, Long postId);

    // Object를 반환받아 사용하는곳에서 DTO 맵핑
    // pageable을 사용하지 않고, limit를 사용하기위해 nativeQuery를 사용
    @Query(value = "SELECT d.user.id, SUM(d.point) FROM Donation d GROUP BY d.user.id")
    List<Object[]> findDonors();

}
