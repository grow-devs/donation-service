package com.example.donationservice.domain.sponsor;

import org.springframework.data.jpa.repository.JpaRepository;

public interface TeamRepository extends JpaRepository<Team, Long> {

    // 팀 이름 중복 체크를 위한 메서드
    boolean existsByName(String teamName);
}
