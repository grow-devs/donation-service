package com.example.donationservice.common.mail;

public interface MailService {
    void sendDonationGoalReachedMail(String toEmail, String postTitle, Long currentAmount);

    void sendDeadlinePassedMail(String toEmail, String postTitle, Long currentAmount);

    void sendVerificationEmail(String email);

    boolean verifyCode(String email, String code);
}
