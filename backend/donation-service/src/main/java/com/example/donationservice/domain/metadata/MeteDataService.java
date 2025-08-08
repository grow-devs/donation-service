package com.example.donationservice.domain.metadata;

import com.example.donationservice.domain.metadata.dto.MetaDataDto;

public interface MeteDataService {

    MetaDataDto.TotalAmountResponse getTotalAmount();

    MetaDataDto.TotalDonorsResponse getTotalDonors();

    MetaDataDto.FirstDonationResponse getfirstDonation();
}
