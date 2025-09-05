package com.example.donationservice.scheduler;

import com.example.donationservice.domain.post.PostService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class PostScheduler {

    private final PostService postService;

    // 데드라인이 지난 게시물에게 알림을 보내는 스케줄러
    @Scheduled(cron = "0 15 23 * * ?") //
    @SchedulerLock(name = "sendDeadlinePassedNotificationsLock", lockAtMostFor = "10m", lockAtLeastFor = "3m")
//    @Scheduled(fixedRate = 600000)  // 테스트를 위한 10분 스케줄
    public void sendDeadlinePassedNotifications() {
        postService.sendDeadlinePassedNotifications();
        log.info("~~~~ sendDeadlinePassedNotifications 스케줄러 ~~~~");
    }
}
