package com.example.donationservice.event;

import com.example.donationservice.domain.ranking.RankingService;
import com.example.donationservice.domain.ranking.RankingServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@RequiredArgsConstructor
public class DonationUpdateRankingListener {
    private final RankingService rankingService;

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handle(DonationUpdateRankingEvent event){
        //기부 시에 비동기로 랭킹 업데이트
        rankingService.updateRanking(event.userId, event.amount);
    }
}
