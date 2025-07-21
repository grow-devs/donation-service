package com.example.donationservice.domain.like;

import com.example.donationservice.domain.like.dto.CommentLikeDto;

public interface CommentLikeService {
    CommentLikeDto.CommentLikeToggleResponse toggleLike(Long userId, Long commentId);
}
