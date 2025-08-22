package com.example.donationservice.event;

import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DonationUpdateRankingEventPublisher {
    private final ApplicationEventPublisher applicationEventPublisher;

    public void publish(Long userId, Long amount){
        DonationUpdateRankingEvent event = new DonationUpdateRankingEvent(userId,amount);
        applicationEventPublisher.publishEvent(event);
    }
}
