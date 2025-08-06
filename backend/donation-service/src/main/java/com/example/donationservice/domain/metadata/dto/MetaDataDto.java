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
    public static class Response{
        private Long totalAmount;
        private LocalDateTime updatedAt;

        public Response(MetaData metaData){
            this.totalAmount = metaData.getTotalAmount();
            this.updatedAt = metaData.getUpdatedAt();
        }
    }
}
