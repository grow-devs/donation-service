package com.example.donationservice.event;

import lombok.Getter;

@Getter
public class DonationUpdateRankingEvent {
    Long userId;
    Long amount;

    public DonationUpdateRankingEvent(Long userId, Long amount){
        this.userId = userId;
        this.amount = amount;
    }
}
