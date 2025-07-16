package com.example.donationservice.domain.post;

import com.example.donationservice.domain.post.dto.PostDto;

import java.time.LocalDateTime;
import java.util.List;

public interface PostRepositoryCustom {
    List<PostDto.PostResponse> findPostsByCursor(
            String sortBy,
            Long lastId,
            LocalDateTime lastCreatedAt,
            LocalDateTime lastEndDate,
            Long lastFundingAmount,
            Long lastParticipants,
            Long categoryId,
            int size
    );
}
