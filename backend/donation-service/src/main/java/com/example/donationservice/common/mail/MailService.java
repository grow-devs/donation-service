package com.example.donationservice.common.mail;

import java.util.List;

public interface MailService {
    void sendDonationGoalReachedMail(List<String> toEmail, String postTitle, Long currentAmount);

    void sendDeadlinePassedMail(List<String> toEmails, String postTitle, Long currentAmount);

    void sendVerificationEmail(String email);

    boolean verifyCode(String email, String code);

//    void sendMail(List<String> i);
}
