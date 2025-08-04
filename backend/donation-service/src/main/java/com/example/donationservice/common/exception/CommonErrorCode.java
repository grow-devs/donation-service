package com.example.donationservice.common.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum CommonErrorCode implements ErrorCode{

    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "유저를 조회할 수 없습니다."),
    RANKING_NOT_FOUND(HttpStatus.NOT_FOUND, "랭킹를 조회할 수 없습니다."),
    USER_ID_ALREADY_EXISTS(HttpStatus.BAD_REQUEST, "이미 존재하는 아이디입니다."),
    TEAM_ALREADY_EXISTS(HttpStatus.BAD_REQUEST, "이미 후원 단체가 존재합니다."),
    TEAM_NOT_FOUND(HttpStatus.NOT_FOUND, "후원 단체를 찾을 수 없습니다."),
    // 로그인 인증 실패 에러
    LOGIN_FAILED(HttpStatus.UNAUTHORIZED, "로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요."),
    FAIL_UPLOAD_IMAGE(HttpStatus.INTERNAL_SERVER_ERROR, "이미지 업로드에 실패하였습니다.") ,// 이미지 업로드 에러 추가
    POST_NOT_FOUND(HttpStatus.NOT_FOUND, "게시글을 찾을 수 없습니다."),
    POST_LIKE_ALREADY_EXISTS(HttpStatus.BAD_REQUEST, "이미 게시글을 좋아요 했습니다."),
    COMMENT_NOT_FOUND(HttpStatus.NOT_FOUND, "댓글을 찾을 수 없습니다."),
    DONATION_NOT_FOUND(HttpStatus.NOT_FOUND, "도네이션을 찾을 수 없습니다.");

    private final HttpStatus status;
    private final String message;

    CommonErrorCode(HttpStatus status, String message) {
        this.status = status;
        this.message = message;
    }
}
