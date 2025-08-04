package com.example.donationservice.event;

import com.example.donationservice.common.mail.MailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionalEventListener;
import org.springframework.transaction.event.TransactionPhase;

@Component
@RequiredArgsConstructor
@Slf4j
public class DonationGoalReachedMailListener {

    private final MailService mailService;

    @Async("mailTaskExecutor")
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
//    @EventListener
    public void handle(DonationGoalReachedMailEvent event) {
        for(String email : event.getDonorUserEmails()) {
            try{
                mailService.sendDonationGoalReachedMail(email, event.getPostTitle(), event.getCurrentAmount());
            } catch (Exception e) {
                log.error("메일 전송 실패 - postId: {}, email: {}, error: {}",
                        event.getPostId(), email, e.getMessage(), e);
                // TODO: 실패한 메일 기록하거나 재시도 큐에 등록
            }
        }
    }
}
