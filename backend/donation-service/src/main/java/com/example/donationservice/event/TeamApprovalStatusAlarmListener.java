package com.example.donationservice.event;

import com.example.donationservice.domain.alarm.AlarmService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@RequiredArgsConstructor
@Slf4j
public class TeamApprovalStatusAlarmListener {

    private final AlarmService alarmService;

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handle(TeamApprovalStatusAlarmEvent event) {
        try {
            alarmService.saveApprovalStatusChangedAlarm(
                    event.getStatus(),
                    event.getTeamName(),
                    event.getUser()
            );
        } catch (Exception e) {
            log.error("알람 저장 실패: teamName={}, userId={}", event.getTeamName(), event.getUser().getId(), e);
        }
    }
}
