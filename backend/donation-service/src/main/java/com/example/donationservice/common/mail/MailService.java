package com.example.donationservice.common.mail;

public interface MailService {
    void sendDonationGoalReachedMail(String toEmail, String postTitle, Long currentAmount);
}
