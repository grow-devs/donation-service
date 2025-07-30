package com.example.donationservice.domain.alarm.dto;

import com.example.donationservice.domain.alarm.Alarm;
import com.example.donationservice.domain.alarm.AlarmType;
import com.example.donationservice.domain.comment.dto.CommentDto;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

public class AlarmDto {

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ResponseForList {
        private Long id;
        private String message;
        private AlarmType type;
        @JsonProperty("isRead")
        private boolean isRead;
        private Long postId;
        private LocalDateTime createdAt; // 댓글 작성 시간

    }

    public static ResponseForList from(Alarm alarm){
        return ResponseForList.builder()
                .message(alarm.getMessage())
                .createdAt(alarm.getCreatedAt())
                .postId(alarm.getPostId())
                .type(alarm.getType())
                .id(alarm.getId())
                .isRead(alarm.isRead())
                .build();
    }
}
