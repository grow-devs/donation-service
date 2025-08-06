package com.example.donationservice.domain.metadata;

import com.example.donationservice.domain.metadata.dto.MetaDataDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MeteDataServiceImpl implements MeteDataService{
    private final MetaDataRepository metaDataRepository;

    @Override
    public MetaDataDto.Response getTotalAmount() {
        return metaDataRepository.findById(1L).map(MetaDataDto.Response::new)
                .orElse(null);
    }

}
