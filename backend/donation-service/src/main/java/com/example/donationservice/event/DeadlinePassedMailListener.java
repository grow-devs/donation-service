package com.example.donationservice.event;

import com.example.donationservice.common.mail.MailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@RequiredArgsConstructor
@Slf4j
public class DeadlinePassedMailListener {

    private final MailService mailService;

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handle(DeadlinePassedMailEvent event) {
        for(String email : event.getDonorUserEmails()) {
            try {
                mailService.sendDeadlinePassedMail(email, event.getPostTitle(), event.getCurrentAmount());
            } catch (Exception e){
                log.error("메일 전송 실패 - postId: {}, email: {}, error: {}",
                        event.getPostId(), email, e.getMessage(), e);
            }
        }
    }
}
