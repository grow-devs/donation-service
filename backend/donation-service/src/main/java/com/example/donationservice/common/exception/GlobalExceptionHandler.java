package com.example.donationservice.common.exception;

import com.example.donationservice.common.dto.Result;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RestApiException.class)
    public ResponseEntity<Result> handleRestApiException(RestApiException re) {
        return ResponseEntity.status(re.getErrorCode().getStatus()).body(Result.builder()
                .message(re.getErrorCode().getMessage())
                .build()
        );
    }
}
