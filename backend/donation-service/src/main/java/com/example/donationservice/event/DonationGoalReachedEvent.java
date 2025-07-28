package com.example.donationservice.event;

import lombok.Getter;

import java.util.List;

@Getter
public class DonationGoalReachedEvent {

    private final Long postId;
    private final String postTitle;
    private final Long currentAmount;
    private final List<String> donorUserEmails;

    public DonationGoalReachedEvent(Long postId, String postTitle, Long currentAmount, List<String> donorUserEmails) {
        this.postId = postId;
        this.postTitle = postTitle;
        this.currentAmount = currentAmount;
        this.donorUserEmails = donorUserEmails;
    }
}
