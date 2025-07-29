package com.example.donationservice.event;

import com.example.donationservice.domain.user.User;
import lombok.Getter;

import java.util.List;

@Getter
public class DonationGoalReachedAlarmEvent {
    private final Long postId;
    private final String postTitle;
    private final List<User> donorUsers ;

    public DonationGoalReachedAlarmEvent(Long postId, String postTitle, List<User> donorUsers) {
        this.postId = postId;
        this.postTitle = postTitle;
        this.donorUsers = donorUsers;
    }
}
