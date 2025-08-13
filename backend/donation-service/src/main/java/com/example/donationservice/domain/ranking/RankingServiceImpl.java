package com.example.donationservice.domain.ranking;

import com.example.donationservice.common.exception.CommonErrorCode;
import com.example.donationservice.common.exception.RestApiException;
import com.example.donationservice.domain.donation.DonationRepository;
import com.example.donationservice.domain.metadata.dto.MetaDataDto;
import com.example.donationservice.domain.ranking.dto.RankingDto;
import com.example.donationservice.domain.user.User;
import com.example.donationservice.domain.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.stereotype.Service;

import javax.swing.text.html.Option;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RankingServiceImpl implements RankingService {

    private final RedisTemplate<String, Object> redisTemplate;  // Redis 데이터 조작용
    private final DonationRepository donationRepository;        // 기부 데이터 DB 조회용
    private final UserRepository userRepository;                // 사용자 정보 DB 조회용

    /**
     * 기간별 Redis 키 생성
     * 각 타입(오늘의랭킹,최근30일 랭킹,명예의 전당) 별로 고유한 키를 생성하여 랭킹 데이터를 분리 저장
     *
     * @param type 랭킹 타입 (TODAY, LAST_30_DAYS,HALL_OF_FAME)
     * @param date 기준 날짜 -> TODAY를 위한 날짜
     * @return Redis에서 사용할 키 문자열
     * <p>
     * 예시:
     * - 2025년 8월 02일 일간: "daily:ranking:20250802" // date에 따른 동적 키
     * - ranking30days // 고정키
     * - ranking:halloffame // 고정키
     */
    private String getRankingKey(RankingType type, LocalDate date) {
        DateTimeFormatter dailyFormatter = DateTimeFormatter.ofPattern("yyyyMMdd");
        return switch (type) {
            // 오늘의 랭킹: 날짜가 포함된 동적 키 사용
            case TODAY -> "ranking:daily:" + date.format(dailyFormatter);
            // 최근 30일 랭킹: 매일 갱신되는 30일 랭킹이므로, 날짜가 없는 고정 키를 사용
            //    (매일 갱신 로직이 별도로 필요함)
            case LAST_30_DAYS -> "ranking:30days";
            // 30일 랭킹의 기록을 보관하고 싶다면 아래와 같이 날짜 범위를 키에 포함
            // LocalDate startDate = today.minusDays(29);
            // yield "ranking:30days:" + startDate.format(dailyFormatter) + "-" + today.format(dailyFormatter);
            // 명예의 전당: 자주 바뀌지 않는 고정된 랭킹이므로 고정 키를 사용
            case HALL_OF_FAME -> "ranking:halloffame";
        };
    }

    /**
     * 기부 발생시 모든 기간별 랭킹 업데이트
     * 하나의 기부가 일간/ 랭킹에 모두 반영되도록 처리
     *
     * @param userId 기부한 사용자 ID
     * @param amount 기부 금액
     */
    public void updateRanking(Long userId, Long amount) {
        LocalDate today = LocalDate.now();

        // 모든 타입별 랭킹에 점수 추가 (동일한 기부가 모든 기간에 누적)
        updateRankingForType(RankingType.TODAY, userId, amount, today); //오늘의 랭킹
//        updateRankingForType(RankingType.LAST_30_DAYS, userId, amount, today); //최근 30일 랭킹은 오늘의 랭킹데이터에서 30일치를 합산하여 새로운 키에 저장하는 방식 채택
        updateRankingForType(RankingType.HALL_OF_FAME, userId, amount, today); //명예의 전당 (역대 기부천사 top 100)
    }

    /**
     * 특정 기간의 랭킹 업데이트
     * Redis Zset의 incrementScore를 사용하여 기존 점수에 새로운 기부금액을 누적
     *
     * @param type   업데이트할 랭킹 기간
     * @param userId 사용자 ID
     * @param amount 기부 금액
     * @param date   기부 날짜
     */
    private void updateRankingForType(RankingType type, Long userId,
                                      Long amount, LocalDate date) {
        String key = getRankingKey(type, date);
        Boolean keyExists = redisTemplate.hasKey(key);
        System.out.println("key" + key + " keyExistes " + keyExists);
        // 새로운 기부 시에 "오늘 처음 기부한 기부자의 정보를 가져오기 위해 확인 후 저장
        // 하루마다 생성되는 TODAY 키가 없을 경우 처음 기부하는 기부자로 판단한다.
        if (type.equals(RankingType.TODAY) && Boolean.FALSE.equals(keyExists)) {
            System.out.println("updateFirstDonor");
            updateFirstDonor(userId);
        }

        // Redis Zset에서 사용자의 점수를 증가 (기존 점수 + 새로운 기부금액)
        redisTemplate.opsForZSet().incrementScore(key, userId.toString(), amount.doubleValue());

        // 개선된 로직: 키에 만료 시간이 설정되어 있지 않은 경우에만 expire()를 호출합니다.
        // getExpire()는 키가 없거나 만료 시간이 설정되지 않았을 때 -1 또는 -2를 반환합니다.
        if (redisTemplate.getExpire(key) < 0) {
            Duration ttl = getTTLForType(type);
            if (ttl != null && !ttl.isZero()) {
                redisTemplate.expire(key, ttl);
            }
        }
        if (type.equals(RankingType.HALL_OF_FAME)) {
            // 명예의 전당의 경우, Top 100 유지
            redisTemplate.opsForZSet().removeRange(key, 0, -101);
        }

    }

    /**
     * 기간별 데이터 보관 기간 설정
     * 너무 오래된 랭킹 데이터는 자동 삭제하여 메모리 효율성 확보
     *
     * @param type 랭킹 기간
     * @return 해당 기간 데이터의 TTL (Time To Live)
     */
    private Duration getTTLForType(RankingType type) {
        return switch (type) {
            case TODAY -> Duration.ofDays(31);    // 일간 랭킹: 31일 보관 (약 1개월)
            case LAST_30_DAYS -> null;   // 최근 30일 랭킹: 이 키는 스케줄러로 관리되므로 TTL을 설정하지 않는다.
            case HALL_OF_FAME -> Duration.ofDays(1095);   // 모든 랭킹: 1095일 보관 (3년)
        };
    }

    /**
     * 랭킹페이지용 기간별 랭킹 조회 (페이징 지원)
     * 특정 기간의 랭킹을 페이지 단위로 조회하여 무한스크롤이나 페이지네이션 구현 지원
     *
     * @param type     조회할 랭킹 기간
     * @param date     기준 날짜
     * @param pageable 페이지 번호 (0부터 시작), 페이지 크기 (한 페이지당 표시할 랭킹 수)
     * @return 해당 페이지의 랭킹 목록
     */
    @Override
    public RankingDto.Response getRanking(RankingType type, LocalDate date,
                                          Pageable pageable) {
        int page = pageable.getPageNumber();
        int size = pageable.getPageSize();
        String key = getRankingKey(type, date);
        int start = page * size;        // 시작 인덱스 계산
        int end = start + size - 1;     // 종료 인덱스 계산
        return getRankingList(key, start, end);
    }

    /**
     * Redis Zset에서 랭킹 데이터를 조회하고 사용자 정보와 조합하여 응답 생성
     *
     * @param key   Redis 키 (예: "daily:ranking:20240715")
     * @param start 조회 시작 인덱스 (0부터 시작)
     * @param end   조회 종료 인덱스 (포함)
     * @return 사용자 정보가 포함된 랭킹 목록
     */
    private RankingDto.Response getRankingList(String key, long start, long end) {
        // Redis Zset에서 점수와 함께 역순(높은 점수부터) 조회
        Set<ZSetOperations.TypedTuple<Object>> rankingSet =
                redisTemplate.opsForZSet().reverseRangeWithScores(key, start, end);

        // 랭킹 데이터가 없으면 빈 리스트 반환
        if (rankingSet == null || rankingSet.isEmpty()) {
            return null;
        }
        // todo refator: [1] 과 [2]는 DB에 접근하는데, 이는 랭킹 조회시에 유저의 nickname을 알기 위해서이다.
        //  만일 nickname이 unique하다면 nickname을 redis의 sortedSet의 key로 두어, db접근을 최소화할 수도 있다.
        //
        //[1]
        // Redis에서 조회한 사용자 ID 목록 추출
        List<Long> userIds = rankingSet.stream()
                .map(tuple -> Long.parseLong(tuple.getValue().toString()))
                .collect(Collectors.toList());
        //[2]
        // DB에서 사용자 정보를 일괄 조회하여 Map으로 변환 (N+1 문제 방지)
        Map<Long, User> userMap = userRepository.findByIdIn(userIds)
                .stream()
                .collect(Collectors.toMap(User::getId, user -> user));

        // 랭킹 응답 객체 생성
        List<RankingDto.ResponseForList> result = new ArrayList<>();

        // 랭킹 동률 처리를 위한 변수 추가
        long currentRank = start + 1; // 현재 순위를 나타내는 변수
        long previousScore = -1L; // 이전 사용자의 점수 (첫 번째 사용자와 비교하기 위해 -1로 초기화)
        long tieRank = start + 1; // 동률인 경우 사용할 순위
        // 동일 point를 가진다면 동률로 계산
        for (ZSetOperations.TypedTuple<Object> tuple : rankingSet) {
            Long userId = Long.parseLong(tuple.getValue().toString());
            User user = userMap.get(userId);
            Long currentScore = tuple.getScore() != null ? tuple.getScore().longValue() : 0L;
            // 현재 점수가 이전 점수와 다르면 (동률이 아니면)
            if (currentScore != previousScore) {
                tieRank = currentRank; // 현재 순위를 새로운 순위로 설정합니다.
            }
            // 사용자 정보가 존재하는 경우만 결과에 포함 (탈퇴한 사용자 제외)
            if (user != null) {
                result.add(RankingDto.ResponseForList.builder()
                        .rank(tieRank)
                        .userId(userId)
                        .nickName(user.getNickName())
                        .totalAmount(currentScore)
                        .profileImageUrl(user.getProfileImageUrl())// todo 유저 이미지 프로필 이미지
                        .build());
            }
            currentRank++;
            previousScore = currentScore;
        }
        //todo NPE 방지 추가 ( NPE 방지가 중요하므로 todo에 넣어 확인하기 위함)
        boolean hasNext = Optional.ofNullable(
                        redisTemplate.opsForZSet().reverseRange(key, end + 1, end + 1)
                )                               // null이면 Optional.empty()
                .orElse(Collections.emptySet()) // null이면 빈 Set 반환
                .isEmpty();                      // 비어있으면 true, 아니면 false


        return RankingDto.Response.builder()
                .rankings(result)
                .hasNext(hasNext)
                .build();

    }

    /**
     * 특정 사용자의 랭킹 정보 조회
     * 사용자 개인의 순위, 기부금액, 백분위 등 상세 정보 제공
     *
     * @param userId 조회할 사용자 ID
     * @param type   랭킹 타입 (모든 유저의 랭킹이 있는 HALLOFFAME type으로 넘긴다.)
     * @return 사용자의 랭킹 상세 정보
     * todo 8월 4일 -> 나의 랭킹은 전체 기부한 유저 중에서의 랭킹을 뽑아야하지만, 현재는 top100에서 찾기때문에
     *                 내 정보가 redis안에 없을 수 있다. redis에 현재까지 기부한 유저의 정보를 모두 넣기에는 메모리 사용량이 커질것이라 생각
     *                 그래서, DB에서 조회하도록 한다.
     *      변경사항 -> redis를 elastic Cache를 사용해서 다룸에 따라
     *                 전체 유저의 기부 랭킹을 redis안에 넣고, 해당 키에서 myranking을 찾아 실시간 나의 랭킹을 리턴한다.
     */
    // redis를 통한 내 랭킹 조회 (redis에 모든 유저의 랭킹이 있다면)
    public RankingDto.MyResponse getMyRanking(Long userId, RankingType type) {
        LocalDate date = LocalDate.now();
        String key = getRankingKey(type, date);

        //프로필 url을 위한 내 유저의 프로필url 조회 -> imgeUrl을 redis에 넣는 방안도 있다.
        String profileImageUrl = userRepository.findProfileImageUrlById(userId)
                .orElse("null");

        // Redis Zset에서 해당 사용자의 점수 조회
        Double myScore = redisTemplate.opsForZSet().score(key, userId.toString());
        if (myScore == null) {
            // 기부 내역이 없는 경우 기본값 반환
            return RankingDto.MyResponse.builder()
                    .rank(0L)
                    .percentile("0%")
                    .totalAmount(0L)
                    .profileImageUrl("")
                    .build();
        }

        // 사용자의 순위 조회 (Redis Zset은 0부터 시작하므로 +1)
        Long myRank = redisTemplate.opsForZSet().reverseRank(key, userId.toString());
        if (myRank == null) {
            myRank = 0L;
        } else {
            myRank += 1;  // 1위, 2위... 형태로 변환
        }

        // 해당 기간 전체 참여자 수 조회
        Long totalUsers = redisTemplate.opsForZSet().zCard(key);
        if (totalUsers == null) totalUsers = 0L;

        // 백분위 계산 (상위 몇 %인지)
        String percentile = totalUsers > 0 ?
                String.format("%.1f%%", (double) (myRank) / totalUsers * 100)
                : "0%";

        return RankingDto.MyResponse.builder()
                .rank(myRank)
                .percentile(percentile)
                .totalAmount(myScore.longValue())
                .profileImageUrl(profileImageUrl)
                .build();
    }

    // @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)를 통해
    // donationServiceImpl에서 기부를 save하고 난 시점이다.(기부데이터를 가져올 수 있다.
    // userId는 기부자의 id
    private void updateFirstDonor(Long userId) {
        //limit 1 을 위한 페이져블
        Pageable pageable = PageRequest.of(0, 1);
        // Pageable 객체로 첫 번째 결과를 요청
        List<MetaDataDto.FirstDonationResponse> firstDonations = donationRepository.findFirstDonation(userId, pageable);
        Optional<MetaDataDto.FirstDonationResponse> firstDonation = firstDonations.stream().findFirst();

        if (firstDonation.isPresent()) {
            System.out.println("In updateFirstDonor 닉네임 : " + firstDonation.get().getNickName());
            String nickName = firstDonation.get().getNickName();
            LocalDateTime createdAt = firstDonation.get().getCreatedAt();
            redisTemplate.opsForHash().put("first_donation:", "nickName", nickName);
            redisTemplate.opsForHash().put("first_donation:", "createdAt", createdAt.toString());
        }
    }

}


