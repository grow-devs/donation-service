package com.example.donationservice.domain.alarm;

import com.example.donationservice.domain.user.User;

import java.util.List;

public interface AlarmService {
    void saveDonationGoalReachedAlarms(Long postId, String postTitle, List<User> donorUsers);
}
