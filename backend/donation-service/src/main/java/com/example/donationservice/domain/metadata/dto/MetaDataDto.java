package com.example.donationservice.domain.metadata.dto;

import com.example.donationservice.domain.metadata.MetaData;
import com.example.donationservice.domain.ranking.dto.RankingDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

public class MetaDataDto {

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TotalAmountResponse{
        private Long totalAmount;
        private LocalDateTime updatedAt;

        public TotalAmountResponse(MetaData metaData){
            this.totalAmount = metaData.getTotalAmount();
            this.updatedAt = metaData.getUpdatedAt();
        }
    }

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TotalDonorsResponse{
        private Long totalDonors;
    }

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FirstDonationResponse{
        private String nickName;
        private LocalDateTime createdAt;
    }
}
