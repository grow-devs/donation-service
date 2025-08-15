package com.example.donationservice.event;

import com.example.donationservice.domain.post.Post;
import com.example.donationservice.domain.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DeadlinePassedEventPublisher {
    private final ApplicationEventPublisher eventPublisher;

    public void publishMailEvent(Post post, List<String> donorUserEmails) {
        DeadlinePassedMailEvent event = new DeadlinePassedMailEvent(post.getId(), post.getTitle(), post.getCurrentAmount(), donorUserEmails);
        eventPublisher.publishEvent(event);
    }

    public void publishAlarmEvent(Post post, List<User> donorUsers) {
        DeadlinePassedAlarmEvent event = new DeadlinePassedAlarmEvent(post.getId(), post.getTitle(), donorUsers);
        eventPublisher.publishEvent(event);
    }
}
