package com.example.donationservice.domain.donation;

import com.example.donationservice.domain.donation.dto.DonationDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface DonationService {
    void createDonation(Long userId, DonationDto.createRequest request);
    Page<DonationDto.response> getDonationsByPostId(Long postId, Pageable pageable);
}
