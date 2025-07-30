package com.example.donationservice.domain.like;

import com.example.donationservice.domain.like.dto.PostLikeDto;

public interface PostLikeService {
    PostLikeDto.PostLikeToggleResponse addLike(Long userId, Long postId);
}
