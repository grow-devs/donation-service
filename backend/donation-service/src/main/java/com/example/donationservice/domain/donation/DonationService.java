package com.example.donationservice.domain.donation;

import com.example.donationservice.domain.donation.dto.DonationDto;
import com.example.donationservice.domain.user.CustomUserDetail;

public interface DonationService {
    void createDonation(Long userId, DonationDto.createRequest request);
}
