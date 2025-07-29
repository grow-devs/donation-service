package com.example.donationservice.domain.alarm;

import com.example.donationservice.domain.user.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AlarmServiceImpl implements AlarmService {

    private final AlarmRepository alarmRepository;

    @Override
    @Transactional
    public void saveDonationGoalReachedAlarms(Long postId, String postTitle, List<User> donorUsers) {
        try{
            List<Alarm> alarmList = donorUsers.stream()
                    .map(user -> Alarm.builder()
                            .type(AlarmType.GOAL_REACHED)
                            .message("게시물 [" + postTitle + "]의 목표 금액이 달성되었습니다.")
                            .postId(postId)
                            .user(user)
                            .build())
                    .toList();

            alarmRepository.saveAll(alarmList);

            log.info("✅ 목표 금액 도달 알람 저장 완료: postId={}, donorCount={}", postId, donorUsers.size());
        } catch (Exception e) {
            log.error("❌ 목표 금액 도달 알람 저장 실패: postId={}, error={}", postId, e.getMessage(), e);
        }

    }
}
