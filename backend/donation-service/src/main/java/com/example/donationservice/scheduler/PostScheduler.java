package com.example.donationservice.scheduler;

import com.example.donationservice.domain.post.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class PostScheduler {

    private final PostService postService;

    // 데드라인이 지난 게시물에게 알림을 보내는 스케줄러
    @Scheduled(cron = "0 13 16 * * *") //
    public void sendDeadlinePassedNotifications() {
        postService.sendDeadlinePassedNotifications();
    }
}
