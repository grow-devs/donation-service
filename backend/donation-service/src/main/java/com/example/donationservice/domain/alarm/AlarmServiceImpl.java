package com.example.donationservice.domain.alarm;

import com.example.donationservice.domain.alarm.dto.AlarmDto;
import com.example.donationservice.domain.user.ApprovalStatus;
import com.example.donationservice.domain.user.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
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
                            .isRead(false)
                            .user(user)
                            .build())
                    .toList();

            alarmRepository.saveAll(alarmList);

            log.info("✅ 목표 금액 도달 알람 저장 완료: postId={}, donorCount={}", postId, donorUsers.size());
        } catch (Exception e) {
            log.error("❌ 목표 금액 도달 알람 저장 실패: postId={}, error={}", postId, e.getMessage(), e);
        }
    }

    @Override
    public void saveApprovalStatusChangedAlarm(ApprovalStatus approvalStatus, String teamName, User user) {
        try {
            Alarm alarm = Alarm.builder()
                    .type(AlarmType.TEAM_APPROVAL_STATUS)
                    .message("팀 [" + teamName + "]의 승인 상태가 " + approvalStatus + "로 변경되었습니다.")
                    .isRead(false)
                    .postId(null)
                    .isRead(false)
                    .user(user)
                    .build();

            alarmRepository.save(alarm);

            log.info("✅ 팀 승인 상태 변경 알람 저장 완료: userId={}, teamName={}, status={}", user.getId(), teamName, approvalStatus);
        } catch (Exception e) {
            log.error("❌ 팀 승인 상태 변경 알람 저장 실패: userId={}, teamName={}, error={}", user.getId(), teamName, e.getMessage(), e);
        }
    }

    @Override
    public Slice<AlarmDto.ResponseForList> getAlarmsByUserId(Long userId, Pageable pageable) {
        // 읽은 여부와 상관없이 해당 유저의 알림을 모두 보여준다.
        Slice<Alarm> alarms = alarmRepository.findByUserId(userId, pageable);

        // Slice<Alarm> -> Slice<AlarmDto.ResponseForList>로 맵핑
        return alarms.map(AlarmDto::from);
    }
    //클릭한 알람 읽기 처리
    @Override
    //update를 위한 transactional
    @Transactional
    public void readAlarm(Long alarmId) {
        // 직접 db update
        // alarm을 조회하고 set할 필요가 없다.
        alarmRepository.UpdateReadByAlarmId(alarmId);
    }
    //알람 모두 읽기 처리
    @Override
    //update를 위한 transactional
    @Transactional
    public void readAllAlarm(Long userId) {
        // 직접 db update
        // alarm을 조회하고 set할 필요가 없다.
        alarmRepository.UpdateReadByUserId(userId);
    }

    @Override
    public int countUnreadAlarms(Long userId) {
        //읽지 않은 알람 카운트 쿼리
        //todo 인덱스 사용 고려 (모든 유저의 알림을 가져오는거)
        return alarmRepository.countByUserIdAndIsReadFalse(userId);
    }

}
