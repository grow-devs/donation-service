package com.example.donationservice.common.mail;

public interface MailService {
    void sendDonationGoalReachedMail(String toEmail, Long postId);
}
