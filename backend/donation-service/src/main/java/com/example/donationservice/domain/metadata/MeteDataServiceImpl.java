package com.example.donationservice.domain.metadata;

import com.example.donationservice.domain.metadata.dto.MetaDataDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class MeteDataServiceImpl implements MeteDataService{
    private final MetaDataRepository metaDataRepository;
    private final RedisTemplate<String,String> redisTemplate;

    @Override
    public MetaDataDto.TotalAmountResponse getTotalAmount() {
        return metaDataRepository.findById(1L).map(MetaDataDto.TotalAmountResponse::new)
                .orElse(null);
    }

    @Override
    public MetaDataDto.TotalDonorsResponse getTotalDonors() {
        String redisData = redisTemplate.opsForValue().get("totalDonors");
        if(redisData==null)return null;

        Long totalDonors = Long.valueOf(redisData);
        return MetaDataDto.TotalDonorsResponse.builder()
                .totalDonors(totalDonors)
                .build();
    }

    @Override
    public MetaDataDto.FirstDonationResponse getfirstDonation() {
        String nickName =(String)redisTemplate.opsForHash().get("first_donation:","nickName");
        LocalDateTime createdAt =LocalDateTime.parse((String)redisTemplate.opsForHash().get("first_donation:","createdAt"));
        if(nickName==null||createdAt==null)return null;
        return MetaDataDto.FirstDonationResponse.builder()
                .nickName(nickName)
                .createdAt(createdAt)
                .build();
    }

}
