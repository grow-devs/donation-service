package com.example.donationservice.event;

import lombok.Getter;

import java.util.List;

@Getter
public class DonationGoalReachedEvent {

    private final Long postId;
    private final List<String> donorUserEmails;

    public DonationGoalReachedEvent(Long postId, List<String> donorUserEmails) {
        this.postId = postId;
        this.donorUserEmails = donorUserEmails;
    }
}
