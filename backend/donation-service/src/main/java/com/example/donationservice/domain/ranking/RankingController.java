package com.example.donationservice.domain.ranking;

import com.example.donationservice.common.dto.Result;
import com.example.donationservice.common.exception.CommonErrorCode;
import com.example.donationservice.common.exception.RestApiException;
import com.example.donationservice.domain.user.CustomUserDetail;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/ranking")
public class RankingController {
    private final RankingService rankingService;


    // 내 랭킹 조회
    @GetMapping("/my")
    public ResponseEntity<Result> getMyRanking(
            @AuthenticationPrincipal CustomUserDetail userDetails
    ) {
        return ResponseEntity.ok().body(Result.builder()
                .message("랭킹 조회 성공 (로그인 시에 내 랭킹도 보이게)")
                .data(rankingService.getMyRanking(userDetails.getUserId(), RankingType.HALL_OF_FAME))
                .build());
    }

    //오늘의 랭킹
    @GetMapping("/today")
    public ResponseEntity<Result> getTodayRanking(
            @AuthenticationPrincipal CustomUserDetail userDetails,
            @PageableDefault(size = 10) Pageable pageable
    ) {
        LocalDate today = LocalDate.now();
        return ResponseEntity.ok().body(Result.builder()
                .message("오늘의 랭킹 조회 성공")
                .data(rankingService.getRanking(RankingType.TODAY, today, pageable))
                .build());


    }

    //최근 30일 랭킹
    @GetMapping("/monthly")
    public ResponseEntity<Result> getMonthlyRanking(
            @AuthenticationPrincipal CustomUserDetail userDetails,
            @PageableDefault(size = 10) Pageable pageable
    ) {
        LocalDate today = LocalDate.now();
        return ResponseEntity.ok().body(Result.builder()
                .message("최근 30일 랭킹 조회 성공")
                .data(rankingService.getRanking(RankingType.LAST_30_DAYS, today, pageable))
                .build());


    }

    //명예의 전당 랭킹(전체 랭킹)
    @GetMapping("")
    public ResponseEntity<Result> getHallOfFameRanking(
            @PageableDefault(size = 10) Pageable pageable
    ) {
        LocalDate today = LocalDate.now();
        return ResponseEntity.ok().body(Result.builder()
                .message("랭킹 조회 성공 (로그인 시에 내 랭킹도 보이게)")
                .data(rankingService.getRanking(RankingType.HALL_OF_FAME, today, pageable))
                .build());
    }
}
