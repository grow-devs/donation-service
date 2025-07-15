package com.example.donationservice.domain.sponsor;

import com.example.donationservice.domain.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface TeamRepository extends JpaRepository<Team, Long> {

    Page<Team> findAllByOrderByCreatedAtDesc(Pageable pageable);

    // 팀 이름 중복 체크를 위한 메서드
    boolean existsByName(String teamName);

    boolean existsByUser(User user);

    Optional<Team> findByUserId(Long userId);
}
