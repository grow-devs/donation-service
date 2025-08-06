package com.example.donationservice.scheduler;

import com.example.donationservice.domain.donation.DonationRepository;
import com.example.donationservice.domain.metadata.MetaData;
import com.example.donationservice.domain.metadata.MetaDataRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class TotalAmountScheduler {
    private  final DonationRepository donationRepository;
    private  final MetaDataRepository metaDataRepository;

    @Scheduled(cron = "0 0 2 * * ?")  // 매일 2AM
//    @Scheduled(fixedRate = 5000)  // 테스트를 위한 5초 스케줄
    @Transactional
    public void updateTotalDonationAmount(){
        Long totalAmount = donationRepository.sumAllDonationAmounts();
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
}
