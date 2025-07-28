package com.example.donationservice.event;

import com.example.donationservice.common.mail.MailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DonationGoalReachedEventListener {

    private final MailService mailService;

    @Async
    @EventListener
    public void handle(DonationGoalReachedEvent event) {
        for(String email : event.getDonorUserEmails()) {
            try{
                mailService.sendDonationGoalReachedMail(email, event.getPostId());
            } catch (Exception e) {
                log.error("메일 전송 실패 - postId: {}, email: {}, error: {}",
                        event.getPostId(), email, e.getMessage(), e);
                // TODO: 실패한 메일 기록하거나 재시도 큐에 등록
            }
        }
    }
}
