package com.example.donationservice.domain.ranking;

import com.example.donationservice.domain.ranking.dto.RankingDto;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;

public interface RankingService {
    //    List<RankingDto.Response> getTodayRanking(Pageable pageable);
    RankingDto.Response getRanking(RankingType type, LocalDate date, Pageable pageable);

    RankingDto.MyResponse getMyRanking(Long userId, RankingType type);
    void updateRanking(Long userId, Long amount);
}
