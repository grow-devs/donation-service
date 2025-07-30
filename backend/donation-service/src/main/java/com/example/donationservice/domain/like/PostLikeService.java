package com.example.donationservice.domain.like;

import com.example.donationservice.domain.like.dto.PostLikeDto;

public interface PostLikeService {
    PostLikeDto.PostLikeResponse addLike(Long userId, Long postId);
    boolean checkLike(Long userId, Long postId);
}
