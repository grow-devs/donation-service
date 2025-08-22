package com.example.donationservice.event;

import com.example.donationservice.common.mail.MailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionalEventListener;
import org.springframework.transaction.event.TransactionPhase;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DonationGoalReachedMailListener {
    private final MailService mailService;

    //corePoolSize 5개
    private final int CORE_POOL_SIZE = 5;

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
//    @EventListener
    public void handle(DonationGoalReachedMailEvent event) {

        //5개의 별도 쓰레드가 sendDonationGoalReachedMail를 수행
        List<String> userEmails = event.getDonorUserEmails();
        int size = userEmails.size();
        // 한 배치 크기
        // ex) 41개의 이메일이 있다면, 9 9 9 9 5 이런식이다.
        int batchSize = (int) Math.ceil((double) size / CORE_POOL_SIZE);

        for (int i = 0; i < CORE_POOL_SIZE; i++) {
            int fromIndex = i * batchSize;
            int toIndex = Math.min(fromIndex + batchSize, size); // 마지막 배치는 size를 넘지 않도록

            List<String> subEvent = userEmails.subList(fromIndex, toIndex);

            mailService.sendDonationGoalReachedMail(subEvent, event.getPostTitle(), event.getCurrentAmount());
        }
    }

//    //test용 메서드
//    //test 통과✔️
//    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
//    public void handleTest(DonationGoalReachedMailEvent event) {
//        //5개의 별도 쓰레드가 sendDonationGoalReachedMail를 수행
//        List<String> userEmails = new ArrayList<>();
//        for (int i = 1; i <= 123; i++) {
//            userEmails.add("user" + i + "@example.com");
//        }
//        int size = userEmails.size();
//        // 한 배치 크기
//        // ex) 41개의 이메일이 있다면, 9 9 9 9 5 이런식이다.
//        int batchSize = (int) Math.ceil((double) size / CORE_POOL_SIZE);
//
//        for (int i = 0; i < CORE_POOL_SIZE; i++) {
//            int fromIndex = i * batchSize;
//            int toIndex = Math.min(fromIndex + batchSize, size); // 마지막 배치는 size를 넘지 않도록
//
//            List<String> subEvent = userEmails.subList(fromIndex, toIndex);
//            mailService.sendMail(subEvent);
//        }
//    }

}
