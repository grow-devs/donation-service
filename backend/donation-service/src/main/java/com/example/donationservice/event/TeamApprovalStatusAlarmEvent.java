package com.example.donationservice.event;

import com.example.donationservice.domain.user.ApprovalStatus;
import com.example.donationservice.domain.user.User;
import lombok.Getter;

@Getter
public class TeamApprovalStatusAlarmEvent {
    private final ApprovalStatus status;
    private final String teamName;
    private final User user;

    public TeamApprovalStatusAlarmEvent(ApprovalStatus status, String teamName, User user) {
        this.status = status;
        this.teamName = teamName;
        this.user = user;
    }
}
