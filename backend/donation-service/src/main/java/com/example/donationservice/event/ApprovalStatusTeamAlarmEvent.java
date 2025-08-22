package com.example.donationservice.event;

import com.example.donationservice.domain.user.ApprovalStatus;
import com.example.donationservice.domain.user.User;
import lombok.Getter;

@Getter
public class ApprovalStatusTeamAlarmEvent {
    private final ApprovalStatus status;
    private final String message;
    private final String teamName;
    private final User user;

    public ApprovalStatusTeamAlarmEvent(ApprovalStatus status, String message, String teamName, User user) {
        this.status = status;
        this.message = message;
        this.teamName = teamName;
        this.user = user;
    }
}
