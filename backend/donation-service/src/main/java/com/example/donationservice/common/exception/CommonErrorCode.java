package com.example.donationservice.common.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum CommonErrorCode implements ErrorCode{

    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "유저를 조회할 수 없습니다."),
    TEAM_ALREADY_EXISTS(HttpStatus.BAD_REQUEST, "이미 후원 단체가 존재합니다.");

    private final HttpStatus status;
    private final String message;

    CommonErrorCode(HttpStatus status, String message) {
        this.status = status;
        this.message = message;
    }
}
