package com.example.donationservice.domain.alarm;

import com.example.donationservice.domain.alarm.dto.AlarmDto;
import com.example.donationservice.domain.user.ApprovalStatus;
import com.example.donationservice.domain.user.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;

import java.util.List;

public interface AlarmService {
    void saveDonationGoalReachedAlarms(Long postId, String postTitle, List<User> donorUsers);

    void saveApprovalStatusChangedAlarm(ApprovalStatus approvalStatus, String teamName, User user);

    Slice<AlarmDto.ResponseForList> getAlarmsByUserId(Long userId, Pageable pageable);

    void readAlarm(Long alarmId);

    int countUnreadAlarms(Long userId);

    void readAllAlarm(Long userId);
}
