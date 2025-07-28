package com.example.donationservice.event;

import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DonationGoalReachedEventPublisher {
    private final ApplicationEventPublisher eventPublisher;

    public void publish(Long postId, List<String> donorUserEmails) {
        DonationGoalReachedEvent event = new DonationGoalReachedEvent(postId, donorUserEmails);
        eventPublisher.publishEvent(event);
    }
}
