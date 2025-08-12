package com.example.donationservice.event;

import com.example.donationservice.domain.user.ApprovalStatus;
import com.example.donationservice.domain.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ApprovalStatusEventPublisher {
    private final ApplicationEventPublisher eventPublisher;

    public void publishTeamStatusAlarmEvent(ApprovalStatus status, String message, String teamName, User user) {
        ApprovalStatusTeamAlarmEvent event = new ApprovalStatusTeamAlarmEvent(status, message, teamName, user);
        eventPublisher.publishEvent(event);
    }

    public void publishPostStatusAlarmEvent(ApprovalStatus status, String message, Long postId, String postTitle, User user) {
        ApprovalStatusPostAlarmEvent event = new ApprovalStatusPostAlarmEvent(status, message, postId, postTitle, user);
        eventPublisher.publishEvent(event);
    }
}
