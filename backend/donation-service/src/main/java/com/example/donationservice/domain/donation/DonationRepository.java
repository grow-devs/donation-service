package com.example.donationservice.domain.donation;

import com.example.donationservice.domain.metadata.dto.MetaDataDto;
import com.example.donationservice.domain.post.Post;
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

    // Object를 반환받아 사용하는곳에서 DTO 맵핑
    // pageable을 사용하지 않고, limit를 사용하기위해 nativeQuery를 사용
    @Query(value = "SELECT d.user.id, SUM(d.point) FROM Donation d GROUP BY d.user.id")
    List<Object[]> findDonors();

    //총 후원자 수 조회(distinct)
    @Query(value = "SELECT count(DISTINCT d.user.id) FROM Donation d")
    Long CountDistinctDonors();

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

    @Query("select sum(d.point) from Donation d ")
    Long sumAllDonationAmounts();

    //오늘 처음 기부한 기부자의 정보
    //해당 user의 기부가 가장 처음으로 기부되었기에 이 유저의 도네이션에서 가장 최근 도네이션을 찾는다.
        @Query(value = "SELECT " +
                " new com.example.donationservice.domain.metadata.dto.MetaDataDto$FirstDonationResponse(d.user.nickName,d.createdAt) " +
                "FROM Donation d " +
                "where d.user.id = :userId " +
                "ORDER BY createdAt DESC")
    List<MetaDataDto.FirstDonationResponse> findFirstDonation(Long userId,Pageable pageable);

    // 기부 참여자 조회
    @Query("SELECT DISTINCT d.user FROM Donation d WHERE d.post = :post")
    List<User> findDistinctUsersByPost(@Param("post") Post post);
}
