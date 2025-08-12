package com.example.donationservice.event;

import com.example.donationservice.domain.user.ApprovalStatus;
import com.example.donationservice.domain.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class TeamApprovalStatusEventPublisher {
    private final ApplicationEventPublisher eventPublisher;

    public void publishTeamStatusAlarmEvent(ApprovalStatus status, String teamName, User user) {
        TeamApprovalStatusAlarmEvent event = new TeamApprovalStatusAlarmEvent(status, teamName, user);
        eventPublisher.publishEvent(event);
    }
}
