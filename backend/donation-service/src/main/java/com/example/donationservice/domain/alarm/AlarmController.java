package com.example.donationservice.domain.alarm;

import com.example.donationservice.common.dto.Result;
import com.example.donationservice.domain.user.CustomUserDetail;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/alarm")
public class AlarmController {
    private final AlarmService alarmService;

    /**
     * 알림 조회 api
     * Slice로 응답(페이지의 총 갯수는 필요없음)
     * @param userDetail
     * @param pageable
     * @return
     */
    @GetMapping
    public ResponseEntity<Result> getAlarmsByUserId(
            @AuthenticationPrincipal CustomUserDetail userDetail,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Long userId = userDetail.getUserId();

        return ResponseEntity.ok(
                Result.builder()
                        .message("알림 조회 성공")
                        .data(alarmService.getAlarmsByUserId(userId, pageable))
                        .build()
        );
    }

    /**
     * 클릭한 알림 상태 (읽음)으로 변경 api
     * @param alarmId
     * @return
     */
    @PatchMapping("/{alarmId}")
    public ResponseEntity<Result> readAlarms(
            @PathVariable Long alarmId
    ) {
        alarmService.readAlarm(alarmId);

        return ResponseEntity.ok(
                Result.builder()
                        .message("알림 읽기 성공")
                        .data(null)
                        .build()
        );
    }
    /**
     * 클릭한 알림 상태 (읽음)으로 변경 api
     * @param alarmId
     * @return
     */
    @PatchMapping("/read-all")
    public ResponseEntity<Result> readAllAlarms(
            @AuthenticationPrincipal CustomUserDetail userDetail
    ) {
        alarmService.readAllAlarm(userDetail.getUserId());

        return ResponseEntity.ok(
                Result.builder()
                        .message("알림 읽기 성공")
                        .data(null)
                        .build()
        );
    }

    /**
     * 읽지 않은 알림 count api
     * Slice로 응답(페이지의 총 갯수는 필요없음)
     * @param alarmId
     * @return
     */
    @GetMapping("/unread-count")
    public ResponseEntity<Result> countUnreadAlarms(
            @AuthenticationPrincipal CustomUserDetail userDetail
    ) {
        Long userId = userDetail.getUserId();
        return ResponseEntity.ok(
                Result.builder()
                        .message("알림 읽기 성공")
                        .data(alarmService.countUnreadAlarms(userId))
                        .build()
        );
    }
}
