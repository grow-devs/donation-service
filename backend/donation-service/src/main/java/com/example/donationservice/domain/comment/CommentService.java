package com.example.donationservice.domain.comment;

import com.example.donationservice.domain.comment.dto.CommentDto;
import org.springframework.data.domain.Pageable;

public interface CommentService {
    void createComment(Long userId, CommentDto.CreateCommentRequest request);
    CommentDto.PagedCommentResponse getCommentsByPostId(Long userId, Long postId, Pageable pageable);
}
