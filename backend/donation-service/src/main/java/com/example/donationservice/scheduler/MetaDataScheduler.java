package com.example.donationservice.scheduler;

import com.example.donationservice.domain.donation.DonationRepository;
import com.example.donationservice.domain.metadata.MetaData;
import com.example.donationservice.domain.metadata.MetaDataRepository;
import com.example.donationservice.domain.post.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class MetaDataScheduler {
    private final MetaDataRepository metaDataRepository;
    private final PostRepository postRepository;
    private final DonationRepository donationRepository;
    private final RedisTemplate<String,String> redisTemplate;

    // 총 모금액 계산 스케줄러
    @Scheduled(cron = "0 0 0 * * ?")  // 매일 2AM
//    @Scheduled(fixedRate = 600000)  // 테스트를 위한 5초 스케줄
    @Transactional
    public void updateTotalDonationAmount(){
        Long totalAmount = postRepository.sumAllDonationAmounts();//post에서 sum함으로써 계산량을 줄인다.
        // 2. Meta 엔티티를 조회 (데이터가 하나만 있다고 가정)
        // 하나의 데이터만 찾기
        Optional<MetaData> metaDataOptional = metaDataRepository.findById(1L);

        if(metaDataOptional.isPresent()){
            MetaData metaData = metaDataOptional.get();
            metaData.setTotalAmount(totalAmount);
        }else{
            metaDataRepository.save(new MetaData(totalAmount));
        }
    }
//    ########## 총 후원자수 저장 스캐줄러 ########
//    일일 통계처럼 매일 갱신되는 데이터의 경우,
//    Redis에 이미 저장된 키에 새로운 값으로 덮어쓰는 것이 가장 효율적인 방법
    @Scheduled(cron = "0 0 0 * * ?")  // 매일 00시 //todo 오늘에 관한 정보이다보니 언제 스케줄링을 돌릴지도 생각해야함
//    @Scheduled(fixedRate = 600000)  // 테스트를 위한 5초 스케줄
    @Transactional
    public void updateTotalDonors(){
        Long totalDonors = donationRepository.CountDistinctDonors();
        String key = "totalDonors";
        redisTemplate.opsForValue().set(key,String.valueOf(totalDonors));
    }

//    ########## 오늘의 첫 기부 데이터 key 삭제 스케줄러 ########
    // 키를 삭제하지 않으면 어제 혹은 그 이전에 기부했던 정보가 그대로 있게된다.
    @Scheduled(cron = "0 0 0 * * ?")  // 매일 23시 59분 //todo 오늘에 관한 정보이다보니 언제 스케줄링을 돌릴지도 생각해야함
//    @Scheduled(fixedRate = 600000)  // 테스트를 위한 5초 스케줄
    @Transactional
    public void DeleteFirstDonationKey(){
        String key = "first_donation:";
//        redisTemplate.opsForHash().delete(key,"nickName");
//        redisTemplate.opsForHash().delete(key,"createdAt");

        redisTemplate.delete(key);
        redisTemplate.delete("ranking:daily:20250901");

        System.out.println("redis의 오늘의 첫 기부데이터 key = first_donation: 삭제를 완료했습니다.");
    }

}
