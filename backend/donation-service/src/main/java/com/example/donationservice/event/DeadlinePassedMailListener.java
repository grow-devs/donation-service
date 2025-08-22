package com.example.donationservice.event;

import com.example.donationservice.common.mail.MailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DeadlinePassedMailListener {

    private final MailService mailService;

    private final int CORE_POOL_SIZE = 5;

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handle(DeadlinePassedMailEvent event) {
        List<String> donorUserEmails = event.getDonorUserEmails();
        int size = donorUserEmails.size();

        int batchSize = (int) Math.ceil((double) size / 5); // 5개의 쓰레드로 나누기

        for(int i = 0; i < CORE_POOL_SIZE; i++) {
            int fromIndex = i * batchSize;
            int toIndex = Math.min(fromIndex + batchSize, size); // 마지막 배치는 size를 넘지 않도록

            List<String> subEvent = donorUserEmails.subList(fromIndex, toIndex);

            mailService.sendDeadlinePassedMail(subEvent, event.getPostTitle(), event.getCurrentAmount());
        }

    }
}
