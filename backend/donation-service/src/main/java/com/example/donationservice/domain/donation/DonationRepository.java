package com.example.donationservice.domain.donation;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DonationRepository extends JpaRepository<Donation, Long> {

    Page<Donation> findByPostIdOrderByCreatedAtDesc(Long postId, Pageable pageable);
}
