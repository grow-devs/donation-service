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
    @Scheduled(cron = "0 0 0 * * *") //
//    @Scheduled(fixedRate = 600000)  // 테스트를 위한 10분 스케줄
    public void sendDeadlinePassedNotifications() {
        postService.sendDeadlinePassedNotifications();
    }
}
