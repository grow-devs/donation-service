package com.example.donationservice.scheduler;

import com.example.donationservice.domain.donation.DonationRepository;
import com.example.donationservice.domain.ranking.RankingService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class RankingScheduler {

    private final RankingService rankingService;
    private final DonationRepository donationRepository;
    private final RedisTemplate<String, Object> redisTemplate;
    /**
     * 최근 30일간의 랭킹 데이터를 집계하여 Redis에 캐시
     * ZUNIONSTORE를 사용해 하루 단위 랭킹을 합산
     * RankingScheduler에서 해당 함수를 호출해야하기 때문에 public
     * todo scheduler안에 넣은 refactor 작업
     */
    /**
     * ##### daily 랭킹 30일치를 합쳐 최근 30일 랭킹을 만든다 #####
     * * cron = "0 0 1 * * ?" 의미:
     * * - 초: 0 (0초)
     * * - 분: 0 (0분)
     * * - 시: 1 (1시)
     * * - 일: * (매일)
     * * - 월: * (매월)
     * * - 요일: ? (상관없음)
     * <p>
     * 매일 새벽 1시에 스케줄링
     */
    @Scheduled(cron = "0 10 0 * * ?")  // 매일 1AM
//    @Scheduled(fixedRate =5000 )  // 스캐줄링 테스트를 위한 5초 간격 스케줄링
    public void recalculateLast30DaysRanking() {
        LocalDate today = LocalDate.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd");

        List<String> keys = new ArrayList<>();
        for (int i = 0; i < 30; i++) {
            LocalDate date = today.minusDays(i);
            keys.add("ranking:daily:" + date.format(formatter));
        }
        // "ranking:30days" -> getRankingKey을 public으로 만들어 호출해도 되지만
        // 그러면 rankingservice에 getRankingKey를 기입해야한다.
        String curKey = "ranking:30days";

        // Redis에 ZUNIONSTORE 수행
        redisTemplate.opsForZSet().unionAndStore(keys.get(0), keys.subList(1, keys.size()), curKey);

        // 캐시만료 2일
        // 하루에 한번씩 30일치의 랭킹이 새로 생긴다.
        redisTemplate.expire(curKey, Duration.ofDays(2));
    }

    /**
     * 전체 기부 랭킹(명에의 전당) 데이터 싱크(정합성 체크)
     */
    @Scheduled(cron = "0 12 0 * * ?")  // 매일 1AM
//    @Scheduled(fixedRate = 600000)  // 스캐줄링 테스트를 위한 5초 간격 스케줄링
    public void syncHallOfFameRanking() {
        try {
            //명예의 전당 key
            String key = "ranking:halloffame";

            // [1] donation테이블에서 유저의 정보와 해당 유저의 기부액이 높은 순으로 가져온다.
            // select d.user_id,sum(d.point) from donation d group by d.user_id
            List<Object[]> dbRanking = donationRepository.findDonors();
            // DB 데이터를 Map으로 변환 (userId -> totalAmount)
            Map<Long, Long> dbRankingMap = dbRanking.stream()
                    .collect(Collectors.toMap(row -> (Long) row[0], row -> (Long) row[1]));

            // [2] Redis에서 데이터를 가져온다.
            Set<ZSetOperations.TypedTuple<Object>> redisRanking = redisTemplate.opsForZSet().rangeWithScores(key, 0, -1);
            //  Redis의 데이터를 Map으로 변환
            if (redisRanking != null) {
                //데이터 비교 및 동기화
                int syncCount = 0;
                int addCount = 0;
                int updateCount = 0;

                Map<Long, Long> redisRankingMap = redisRanking.stream()
                        .collect(Collectors.toMap(tuple -> Long.parseLong(tuple.getValue().toString()), tuple -> tuple.getScore().longValue()));
                // 데이터 비교
                for (Map.Entry<Long, Long> dbEntry : dbRankingMap.entrySet()) {
                    Long userId = dbEntry.getKey();
                    Long dbAmount = dbEntry.getValue();
                    Long redisScore = redisRankingMap.get(userId);

                    if (redisScore == null) {
                        // Redis에 없는 데이터 추가
                        redisTemplate.opsForZSet().add(key, userId.toString(), dbAmount);
                        addCount++;
                        System.out.println("Redis 추가: userId=" + userId + ", amount=" + dbAmount);
                    } else if (redisScore < dbAmount) {
                        // 금액이 다른 경우 업데이트
                        redisTemplate.opsForZSet().add(key, userId.toString(), dbAmount);
                        updateCount++;
                        System.out.println("Redis 업데이트: userId=" + userId +
                                ", Redis=" + redisScore + " -> DB=" + dbAmount);
                    }
                }
                // Redis에만 있고 DB에 없는 데이터 제거
                int removeCount = 0;
                for (Long redisUserId : redisRankingMap.keySet()) {
                    if (!dbRankingMap.containsKey(redisUserId)) {
                        redisTemplate.opsForZSet().remove(key, redisUserId.toString());
                        removeCount++;
                        System.out.println("Redis 제거: userId=" + redisUserId);
                    }
                }
                System.out.println("=== 전체 기부 랭킹 동기화 완료 ===");
                System.out.println("DB 랭킹 사용자 수: " + dbRankingMap.size());
                System.out.println("Redis 랭킹 사용자 수: " + redisRankingMap.size());
                System.out.println("(추가 : " + addCount + ", 수정 :" + updateCount + ", 삭제 : " + removeCount + ")");

            } else throw new RuntimeException("redis에 데이터가 없습니다.");

        }
        catch(Exception e){
            System.err.println("전체 기부 랭킹 데이터 싱크 실패: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
