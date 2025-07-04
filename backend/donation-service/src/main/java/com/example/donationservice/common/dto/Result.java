package com.example.donationservice.common.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

//Json 직렬화를 위한 어노테이션
@Data
@AllArgsConstructor
@Builder
public class Result<T> {
    private String message;
    private T data;

}