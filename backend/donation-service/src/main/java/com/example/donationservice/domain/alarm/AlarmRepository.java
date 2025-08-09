package com.example.donationservice.domain.alarm;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AlarmRepository extends JpaRepository<Alarm, Long> {
    Page<Alarm> findByUserId(Long userId, Pageable pageable);

    @Modifying
    @Query("update Alarm a SET a.isRead = true WHERE a.id = :alarmId")
    void UpdateReadByAlarmId(Long alarmId);

    @Modifying
    @Query("update Alarm a SET a.isRead = true WHERE a.user.id = :userId")
    void UpdateReadByUserId(Long userId);

    int countByUserIdAndIsReadFalse(Long userId);
}
