package com.example.donationservice.common.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum CommonErrorCode implements ErrorCode{

    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "유저를 조회할 수 없습니다."),
    TEAM_ALREADY_EXISTS(HttpStatus.BAD_REQUEST, "이미 후원 단체가 존재합니다."),
    // 로그인 인증 실패 에러
    LOGIN_FAILED(HttpStatus.UNAUTHORIZED, "로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.");

    private final HttpStatus status;
    private final String message;

    CommonErrorCode(HttpStatus status, String message) {
        this.status = status;
        this.message = message;
    }
}
