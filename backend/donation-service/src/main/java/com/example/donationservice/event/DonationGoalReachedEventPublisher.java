package com.example.donationservice.event;

import com.example.donationservice.domain.post.Post;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DonationGoalReachedEventPublisher {
    private final ApplicationEventPublisher eventPublisher;

    public void publish(Post post, List<String> donorUserEmails) {
        DonationGoalReachedEvent event = new DonationGoalReachedEvent(post.getId(), post.getTitle(), post.getCurrentAmount(), donorUserEmails);
        eventPublisher.publishEvent(event);
    }
}
