package com.example.donationservice.event;

import com.example.donationservice.domain.user.ApprovalStatus;
import com.example.donationservice.domain.user.User;
import lombok.Getter;

@Getter
public class ApprovalStatusPostAlarmEvent {
    private final ApprovalStatus status;
    private final Long postId;
    private final String postTitle;
    private final User user;

    public ApprovalStatusPostAlarmEvent(ApprovalStatus status, Long postId, String postTitle, User user) {
        this.status = status;
        this.postId = postId;
        this.postTitle = postTitle;
        this.user = user;
    }
}
