package com.example.donationservice.domain.ranking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

public class RankingDto {

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response{
        private List<ResponseForList> rankings;
        private boolean hasNext; // "더보기"를 위한 hasNext -> 서비스단에서의 로직으로 알아냄
    }
    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ResponseForList{
        private Long userId;                // 사용자 ID
        private String nickName;            // 사용자명 (화면에 표시용)
        private Long totalAmount;     // 해당 기간 총 기부 금액
        private Long rank;                  // 순위 (1위, 2위, ...)
        private String profileImageUrl;     // 프로필 이미지 URL
    }
    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MyResponse{
        private Long rank;                  // 내 순위
        private Long totalAmount;     // 내 총 기부 금액
        private String percentile;          // 상위 몇 퍼센트인지 (예: "상위 15.3%")
        private String profileImageUrl;     // 프로필 이미지 URL
    }
}
