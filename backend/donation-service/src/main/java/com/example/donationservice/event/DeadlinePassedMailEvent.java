package com.example.donationservice.event;

import com.example.donationservice.domain.user.User;
import lombok.Getter;

import java.util.List;

@Getter
public class DeadlinePassedMailEvent {
    private final Long postId;
    private final String postTitle;
    private final Long currentAmount;
    private final List<String> donorUserEmails;

    public DeadlinePassedMailEvent(Long postId, String postTitle, Long currentAmount, List<String> donorUserEmails) {
        this.postId = postId;
        this.postTitle = postTitle;
        this.currentAmount = currentAmount;
        this.donorUserEmails = donorUserEmails;
    }
}
